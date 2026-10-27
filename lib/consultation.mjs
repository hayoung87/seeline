import { createHash, createHmac, randomBytes } from 'node:crypto';

export const RETENTION_SECONDS = 90 * 86400;
export const REQUIRED_CONFIG = ['SMTP_USER', 'SMTP_APP_PASSWORD', 'CONSULTATION_TO',
  'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY',
  'SOLAPI_API_KEY', 'SOLAPI_API_SECRET', 'SOLAPI_PF_ID', 'SOLAPI_TEMPLATE_ID', 'CONSULTATION_OWNER_MOBILE'];
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export function ready(env) {
  return env.CONSULTATION_ENABLED === 'true' && REQUIRED_CONFIG.every(k => !!env[k]?.trim())
    && EMAIL.test(env.SMTP_USER) && EMAIL.test(env.CONSULTATION_TO)
    && /^01[016789]\d{7,8}$/.test(env.CONSULTATION_OWNER_MOBILE)
    && /^https:\/\/[^/]+$/.test(env.CONSULTATION_ORIGIN || '');
}
function invalid(message) { const e = new Error(message); e.status = 400; throw e; }
export function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid('상담 내용을 확인해 주세요.');
  const { requestId, name, phone, summary, consent, website, token } = input;
  if (typeof requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) invalid('접수 화면을 새로 열어주세요.');
  if (typeof name !== 'string' || !name.trim() || name.length > 50 || /[\r\n\x00-\x1f]/.test(name)) invalid('이름을 확인해 주세요.');
  if (typeof phone !== 'string' || !/^[0-9+()\-\s]{8,24}$/.test(phone)) invalid('연락처를 확인해 주세요.');
  const digits = phone.replace(/\D/g, '');
  if (!/^0\d{8,10}$/.test(digits)) invalid('연락처를 확인해 주세요.');
  if (typeof summary !== 'string' || summary.length < 10 || summary.length > 20000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(summary)) invalid('상담 내용이 너무 길거나 올바르지 않습니다.');
  if (consent !== true) invalid('상담을 위한 개인정보 수집·이용에 동의해 주세요.');
  if (website) invalid('요청을 처리할 수 없습니다.');
  if (typeof token !== 'string' || token.length > 2048) invalid('자동 입력 방지 확인을 다시 진행해 주세요.');
  return { requestId: requestId.toLowerCase(), name: name.trim(), phone: digits, summary: summary.trim(), consent: true, consentVersion: '2026-10-27' };
}
export const fingerprint = data => createHash('sha256').update(JSON.stringify(data)).digest('hex');
export const receiptId = id => 'SL-' + id.toUpperCase();
export function mailOptions(env, lead) {
  return {
    from: { name: '디자인시선 홈페이지', address: env.SMTP_USER },
    to: env.CONSULTATION_TO,
    subject: '[디자인시선 상담] ' + receiptId(lead.data.requestId),
    messageId: `<seeline-${lead.data.requestId}@${env.SMTP_USER.split('@')[1]}>`,
    text: ['디자인시선 홈페이지 상담 신청', '접수번호: ' + receiptId(lead.data.requestId),
      '접수일시: ' + new Date(lead.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      '이름: ' + lead.data.name, '연락처: ' + lead.data.phone, '', lead.data.summary, '',
      '개인정보 수집·이용 동의: 확인 (' + lead.data.consentVersion + ')',
      '이름·연락처 및 아래 내용은 고객이 입력한 상담 자료입니다. 계약·견적 확정 내용이 아닙니다.'].join('\n'),
    disableFileAccess: true, disableUrlAccess: true
  };
}
export function createDependencies(env, fetcher = fetch) {
  async function redis(command) {
    const r = await fetcher(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST', headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(command), signal: AbortSignal.timeout(5000)
    });
    const data = await r.json();
    if (!r.ok || data.error) throw new Error('STORE_UNAVAILABLE');
    return data.result;
  }
  return {
    redis,
    async verify(token) {
      const r = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }), signal: AbortSignal.timeout(5000)
      });
      const data = await r.json();
      return r.ok && data.success === true && data.action === 'consultation' && data.hostname === new URL(env.CONSULTATION_ORIGIN).hostname;
    },
    async sendMail(lead) {
      const { default: nodemailer } = await import('nodemailer');
      const transport = nodemailer.createTransport({ host: 'smtp.naver.com', port: 465, secure: true,
        auth: { user: env.SMTP_USER, pass: env.SMTP_APP_PASSWORD },
        connectionTimeout: 10000, greetingTimeout: 5000, socketTimeout: 10000,
        logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true });
      try {
        const info = await transport.sendMail(mailOptions(env, lead));
        if (!info.accepted?.includes(env.CONSULTATION_TO)) {
          const error = new Error('MAIL_REJECTED'); error.responseCode = 550; throw error;
        }
      } finally { transport.close(); }
    },
    async sendKakao(lead) {
      const date = new Date().toISOString(), salt = randomBytes(16).toString('hex');
      const signature = createHmac('sha256', env.SOLAPI_API_SECRET).update(date + salt).digest('hex');
      const response = await fetcher('https://api.solapi.com/messages/v4/send-many/detail', {
        method: 'POST', signal: AbortSignal.timeout(7000),
        headers: { 'Content-Type': 'application/json', Authorization: `HMAC-SHA256 apiKey=${env.SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}` },
        body: JSON.stringify({ messages: [{ to: env.CONSULTATION_OWNER_MOBILE, type: 'ATA',
          kakaoOptions: { pfId: env.SOLAPI_PF_ID, templateId: env.SOLAPI_TEMPLATE_ID, disableSms: true,
            variables: { '#{접수번호}': receiptId(lead.data.requestId), '#{접수시간}': new Date(lead.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) } }
        }], strict: true, allowDuplicates: false })
      });
      const result = await response.json();
      if (!response.ok || result.failedMessageList?.length || result.groupInfo?.count?.registeredSuccess !== 1) throw new Error('KAKAO_NOT_ACCEPTED');
      return result.groupInfo.groupId;
    }
  };
}
export function createHandler(env = process.env, deps = createDependencies(env), log = console.error) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const reply = (status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(body)); };
    if (req.method === 'GET') return reply(200, { enabled: ready(env), siteKey: ready(env) ? env.TURNSTILE_SITE_KEY : null });
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return reply(405, { error: '지원하지 않는 요청입니다.' }); }
    if (req.headers.origin !== env.CONSULTATION_ORIGIN) return reply(403, { error: '홈페이지에서 다시 신청해 주세요.' });
    if (!ready(env)) return reply(503, { error: '온라인 상담 접수 연결을 확인하고 있습니다. 전화 또는 카카오톡으로 문의해 주세요.' });
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return reply(415, { error: '올바르지 않은 요청입니다.' });
    let data, lead, key, locked = false, emailAccepted = false;
    try {
      if (Number(req.headers['content-length']) > 65536) return reply(413, { error: '상담 내용이 너무 깁니다.' });
      let input = req.body;
      if (typeof input === 'string') { if (Buffer.byteLength(input) > 65536) return reply(413, { error: '상담 내용이 너무 깁니다.' }); input = JSON.parse(input); }
      if (Buffer.byteLength(JSON.stringify(input) || '') > 65536) return reply(413, { error: '상담 내용이 너무 깁니다.' });
      data = validate(input); key = 'seeline:lead:' + data.requestId;
      const hash = fingerprint(data), prior = await deps.redis(['GET', key]);
      if (prior) {
        lead = JSON.parse(prior);
        if (lead.hash !== hash) return reply(409, { error: '전송 중인 상담 내용과 다릅니다. 새 상담으로 신청해 주세요.' });
        if (lead.status === 'accepted') return reply(200, { ok: true, receiptId: receiptId(data.requestId) });
        if (['processing', 'uncertain'].includes(lead.status)) return reply(409, { uncertain: true, receiptId: receiptId(data.requestId), error: '접수 상태를 확인 중입니다. 중복 신청하지 마시고 접수번호로 전화 문의해 주세요.' });
      }
      const ip = String(req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0];
      const rateKey = 'seeline:rate:' + createHmac('sha256', env.UPSTASH_REDIS_REST_TOKEN).update(ip).digest('hex');
      const rate = await deps.redis(['EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n", '1', rateKey]);
      if (rate > 10) return reply(429, { error: '신청 요청이 많습니다. 잠시 후 다시 시도해 주세요.' });
      if (!await deps.verify(input.token)) return reply(400, { error: '자동 입력 방지 확인이 만료되었습니다. 다시 확인해 주세요.' });
      locked = !!await deps.redis(['SET', key + ':lock', '1', 'EX', '120', 'NX']);
      if (!locked) return reply(409, { uncertain: true, error: '상담을 전송 중입니다. 잠시 후 접수 상태를 확인해 주세요.' });
      // Re-read inside the distributed lock: another instance may have finished after our first read.
      const latest = await deps.redis(['GET', key]);
      if (latest) {
        lead = JSON.parse(latest);
        if (lead.hash !== hash) return reply(409, { error: '전송 중인 상담 내용과 다릅니다.' });
        if (lead.status === 'accepted') return reply(200, { ok: true, receiptId: receiptId(data.requestId) });
        if (['processing', 'uncertain'].includes(lead.status)) return reply(409, { uncertain: true, receiptId: receiptId(data.requestId), error: '접수 상태를 확인 중입니다. 접수번호로 전화 문의해 주세요.' });
      }
      lead = { data, hash, createdAt: lead?.createdAt || new Date().toISOString(), status: 'processing', kakaoStatus: 'not_attempted' };
      await deps.redis(['SET', key, JSON.stringify(lead), 'EX', String(RETENTION_SECONDS)]);
      try { await deps.sendMail(lead); emailAccepted = true; }
      catch (error) {
        // A network timeout after SMTP DATA is ambiguous. Never auto-resend it.
        lead.status = Number(error.responseCode) >= 400 || error.code === 'EAUTH' ? 'failed' : 'uncertain';
        await deps.redis(['SET', key, JSON.stringify(lead), 'EX', String(RETENTION_SECONDS)]);
        log('consultation_mail_' + lead.status, data.requestId);
        return reply(502, { uncertain: lead.status === 'uncertain', receiptId: receiptId(data.requestId), error: lead.status === 'uncertain' ? '전송 결과 확인이 지연되고 있습니다. 중복 신청하지 마시고 접수번호로 전화 문의해 주세요.' : '전송하지 못했습니다. 작성 내용은 그대로 있으니 잠시 후 다시 시도해 주세요.' });
      }
      lead.status = 'accepted'; lead.emailAcceptedAt = new Date().toISOString();
      await deps.redis(['SET', key, JSON.stringify(lead), 'EX', String(RETENTION_SECONDS)]);
      try { lead.kakaoGroupId = await deps.sendKakao(lead); lead.kakaoStatus = 'provider_accepted'; }
      catch { lead.kakaoStatus = 'needs_review'; log('consultation_kakao_needs_review', data.requestId); }
      // Email is already accepted. Notification failure must not ask the customer to submit again.
      await deps.redis(['SET', key, JSON.stringify(lead), 'EX', String(RETENTION_SECONDS)]);
      return reply(200, { ok: true, receiptId: receiptId(data.requestId) });
    } catch (error) {
      if (emailAccepted) { log('consultation_post_email_store_error', data.requestId); return reply(200, { ok: true, receiptId: receiptId(data.requestId) }); }
      if (error.status === 400 || error instanceof SyntaxError) return reply(400, { error: error.status === 400 ? error.message : '올바르지 않은 요청입니다.' });
      log('consultation_service_unavailable', data?.requestId || 'invalid-request');
      return reply(503, { error: '지금은 상담을 전송할 수 없습니다. 작성 내용은 유지되며, 잠시 후 다시 시도하거나 전화로 문의해 주세요.' });
    } finally {
      if (locked) { try { await deps.redis(['DEL', key + ':lock']); } catch { /* lock expires after 120 seconds */ } }
    }
  };
}
