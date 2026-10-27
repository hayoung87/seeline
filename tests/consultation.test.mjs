import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createHandler, ready, mailOptions, REQUIRED_CONFIG, RETENTION_SECONDS, createDependencies } from '../lib/consultation.mjs';
const env = Object.fromEntries(REQUIRED_CONFIG.map(k => [k, 'test-value']));
Object.assign(env, { CONSULTATION_ENABLED: 'true', CONSULTATION_ORIGIN: 'https://seeline-rho.vercel.app', SMTP_USER: 'sender@example.com', CONSULTATION_TO: 'owner@example.com', CONSULTATION_OWNER_MOBILE: '01000000000' });
const sample = () => ({ requestId: randomUUID(), name: '테스트 고객', phone: '010-1234-5678', summary: '[디자인시선 인테리어 상담]\n상담 내용: 인테리어 시공\n감각적인 미드센추리\n잉크 소파 2개\n거실 4500 × 3500mm', consent: true, token: 'test-token', website: '' });
function fixture(overrides = {}, config = env) {
  const db = new Map(), sent = [], alerts = [], logs = [];
  const deps = {
    async redis([cmd, key, value, ...args]) {
      if (cmd === 'GET') return db.get(key) || null;
      if (cmd === 'DEL') return db.delete(key);
      if (cmd === 'EVAL') return 1;
      if (cmd === 'SET') { if (args.includes('NX') && db.has(key)) return null; db.set(key, value); return 'OK'; }
      throw Error(cmd);
    },
    async verify() { return true; }, async sendMail(lead) { sent.push(lead.data); },
    async sendKakao(lead) { alerts.push(lead.data.requestId); return 'group-test'; }, ...overrides
  };
  const handler = createHandler(config, deps, (...items) => logs.push(items));
  async function call(body = sample(), extra = {}) {
    const req = { method: 'POST', headers: { origin: env.CONSULTATION_ORIGIN, 'content-type': 'application/json' }, body, socket: { remoteAddress: '127.0.0.1' }, ...extra };
    const headers = {}; let result;
    await handler(req, { statusCode: 0, setHeader(k,v) { headers[k] = v; }, end(s) { result = { status: this.statusCode, data: JSON.parse(s), headers }; } });
    return result;
  }
  return { db, sent, alerts, logs, call };
}
test('unconfigured service cannot accept or falsely confirm requests; public config contains no secrets', async () => {
  const f = fixture({}, {}); assert.equal(ready({}), false);
  const config = await f.call(undefined, { method: 'GET' }); assert.deepEqual(config.data, { enabled: false, siteKey: null });
  assert.equal((await f.call()).status, 403); assert.equal(f.sent.length, 0);
  const g = fixture({}, { ...env, SMTP_APP_PASSWORD: '' }); assert.equal((await g.call()).status, 503);
});
test('validation, missing consent, payload limits, CSRF and honeypot fail before sending', async () => {
  const f = fixture();
  for (const patch of [{ consent: false }, { phone: '123' }, { name: 'A\nB' }, { website: 'bot' }, { requestId: 'x' }, { summary: 'x'.repeat(20001) }]) assert.equal((await f.call({ ...sample(), ...patch })).status, 400);
  assert.equal((await f.call(sample(), { headers: { origin: 'https://other.example', 'content-type': 'application/json' } })).status, 403);
  assert.equal((await f.call(sample(), { headers: { origin: env.CONSULTATION_ORIGIN, 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await f.call('invalid json')).status, 400); assert.equal(f.sent.length, 0);
  assert.equal((await fixture({ verify: async () => false }).call()).status, 400);
  assert.equal((await fixture({ redis: async ([cmd]) => cmd === 'EVAL' ? 11 : null }).call()).status, 429);
});
test('complete request persists before email, emails owner, then alerts owner; retry is idempotent', async () => {
  const f = fixture(), body = sample();
  const result = await f.call(body); assert.equal(result.status, 200); assert.equal(result.data.ok, true);
  assert.equal(f.sent.length, 1); assert.equal(f.alerts.length, 1); assert(f.sent[0].summary.includes('잉크 소파 2개'));
  const lead = JSON.parse(f.db.get('seeline:lead:' + body.requestId)); assert.equal(lead.status, 'accepted'); assert.equal(lead.kakaoStatus, 'provider_accepted');
  assert.equal((await f.call(body)).status, 200); assert.equal(f.sent.length, 1); assert.equal(f.alerts.length, 1);
  assert.equal((await f.call({ ...body, name: '다른 이름' })).status, 409);
  const mail = mailOptions(env, lead); assert.equal(mail.to, env.CONSULTATION_TO); assert(mail.text.includes('01012345678')); assert.equal(mail.html, undefined);
  assert.equal(RETENTION_SECONDS, 90 * 86400);
});
test('concurrent submissions with one ID cannot send two emails', async () => {
  let release, count = 0;
  const gate = new Promise(r => release = r);
  const f = fixture({ sendMail: async () => { count++; await gate; } }), body = sample();
  const first = f.call(body); await new Promise(r => setImmediate(r));
  const second = await f.call(body); assert.equal(second.status, 409); release(); await first; assert.equal(count, 1);
});
test('definite SMTP failure is retryable; ambiguous timeout is not automatically resent', async () => {
  let count = 0;
  const f = fixture({ sendMail: async () => { count++; throw Object.assign(Error('rejected'), { responseCode: 550 }); } }), body = sample();
  assert.equal((await f.call(body)).status, 502); assert.equal((await f.call(body)).status, 502); assert.equal(count, 2); assert.equal(f.alerts.length, 0);
  count = 0;
  const g = fixture({ sendMail: async () => { count++; throw Error('timeout'); } });
  assert.equal((await g.call(body)).data.uncertain, true); assert.equal((await g.call(body)).status, 409); assert.equal(count, 1);
});
test('Kakao failure does not lose email receipt or trigger duplicate email; it remains reviewable', async () => {
  const f = fixture({ sendKakao: async () => { throw Error('provider down'); } }), body = sample();
  assert.equal((await f.call(body)).status, 200); assert.equal(f.sent.length, 1);
  assert.equal(JSON.parse(f.db.get('seeline:lead:' + body.requestId)).kakaoStatus, 'needs_review');
  assert.equal((await f.call(body)).status, 200); assert.equal(f.sent.length, 1);
  assert(!JSON.stringify(f.logs).includes(body.phone)); assert(!JSON.stringify(f.logs).includes(body.name));
});
test('storage outage fails closed before email', async () => {
  const f = fixture({ redis: async () => { throw Error('offline'); } });
  assert.equal((await f.call()).status, 503); assert.equal(f.sent.length, 0);
});
test('Solapi receives only owner number, approved template variables and no SMS fallback', async () => {
  let captured;
  const deps = createDependencies(env, async (url, options) => {
    captured = { url, options };
    return { ok: true, json: async () => ({ groupInfo: { groupId: 'g', count: { registeredSuccess: 1 } } }) };
  });
  const body = sample(); await deps.sendKakao({ data: body, createdAt: new Date().toISOString() });
  const request = JSON.parse(captured.options.body), message = request.messages[0];
  assert.equal(message.to, env.CONSULTATION_OWNER_MOBILE); assert.notEqual(message.to, body.phone);
  assert.equal(message.kakaoOptions.disableSms, true); assert.equal(message.type, 'ATA');
  assert(!captured.options.body.includes(body.name)); assert(!captured.options.body.includes(body.summary));
  assert.match(captured.options.headers.Authorization, /^HMAC-SHA256 /);
});
