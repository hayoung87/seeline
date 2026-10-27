(function () {
  'use strict';
  const form = document.getElementById('consultForm'), button = document.getElementById('submitInquiry');
  const status = document.getElementById('inquiryStatus');
  let token = '', enabled = false, sending = false, finished = false, uncertain = false, attempted = false, widget;
  const updateButton = () => { button.disabled = !enabled || !token || sending || finished || uncertain; };
  function resetChallenge() { token = ''; if (window.turnstile && widget != null) window.turnstile.reset(widget); updateButton(); }
  async function configure() {
    try {
      const response = await fetch('/api/consultation', { cache: 'no-store' });
      if (!response.ok) throw new Error('unavailable');
      const config = await response.json();
      if (!config.enabled || !config.siteKey) throw new Error('unavailable');
      enabled = true;
      window.seelineTurnstileReady = () => {
        widget = window.turnstile.render('#consultChallenge', { sitekey: config.siteKey, action: 'consultation', theme: 'light', size: 'flexible',
          callback: value => { token = value; updateButton(); if (!sending && !finished && !uncertain && !attempted) status.textContent = '확인 후 신청 버튼을 눌러주세요.'; },
          'expired-callback': () => { token = ''; updateButton(); status.textContent = '자동 입력 방지 확인을 다시 진행해 주세요.'; },
          'error-callback': () => { token = ''; updateButton(); status.textContent = '자동 입력 방지 확인을 불러오지 못했습니다. 새로고침하거나 전화로 문의해 주세요.'; }
        });
      };
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=seelineTurnstileReady&render=explicit'; script.async = true;
      script.onerror = () => { enabled = false; updateButton(); status.textContent = '자동 입력 방지 확인을 불러오지 못했습니다. 전화 또는 카카오톡으로 문의해 주세요.'; };
      document.head.appendChild(script);
      status.textContent = '자동 입력 방지 확인을 진행하고 있습니다.';
    } catch { status.textContent = '온라인 상담 접수 연결을 확인하고 있습니다. 지금은 전화 또는 카카오톡으로 문의해 주세요.'; }
    updateButton();
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || finished || uncertain || !enabled || !token || !form.reportValidity()) return;
    sending = true; attempted = true; updateButton();
    const contact = { name: document.getElementById('contactName').value.trim(), phone: document.getElementById('contactPhone').value,
      summary: window.SeelineCart.summary(), consent: document.getElementById('privacyConsent').checked };
    let digest;
    try { digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(contact))); }
    catch { sending = false; status.textContent = '안전한 접수 연결을 준비하지 못했습니다. 새로고침하거나 전화로 문의해 주세요.'; updateButton(); return; }
    const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    let attempt;
    try { attempt = JSON.parse(sessionStorage.getItem('seeline-inquiry-attempt')); } catch { /* private browser storage can be unavailable */ }
    if (!attempt || attempt.hash !== hash) attempt = { id: crypto.randomUUID(), hash, status: 'new' };
    if (attempt.status === 'accepted') { sending = false; showSuccess('SL-' + attempt.id.toUpperCase()); return; }
    if (attempt.status === 'uncertain') { sending = false; uncertain = true; status.textContent = '이 상담의 접수 상태를 확인 중입니다. 전화로 문의해 주세요. 접수번호: SL-' + attempt.id.toUpperCase(); updateButton(); return; }
    const remember = () => { try { sessionStorage.setItem('seeline-inquiry-attempt', JSON.stringify(attempt)); } catch { /* only a random ID and digest, never contact fields */ } };
    sending = true; attempt.status = 'sending'; remember(); updateButton(); button.textContent = '상담 내용을 전송하고 있습니다…';
    status.textContent = '이 화면을 잠시 유지해 주세요.';
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 65000);
    try {
      const response = await fetch('/api/consultation', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, requestId: attempt.id, token, website: document.getElementById('consultWebsite').value }), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        uncertain = result.uncertain === true;
        attempt.status = uncertain ? 'uncertain' : 'failed'; remember();
        status.textContent = (result.error || '전송하지 못했습니다. 잠시 후 다시 시도해 주세요.') + (result.receiptId ? ' 접수번호: ' + result.receiptId : '');
        resetChallenge(); return;
      }
      attempt.status = 'accepted'; remember(); showSuccess(result.receiptId);
    } catch {
      // Preserve the ID so a retry asks the server about this exact request before sending mail again.
      attempt.status = 'failed'; remember(); status.textContent = '연결이 끊겨 접수 결과를 확인하지 못했습니다. 다시 신청하면 같은 접수번호로 상태를 확인합니다.'; resetChallenge();
    } finally { clearTimeout(timeout); sending = false; button.textContent = finished ? '상담 신청 완료' : '이 내용으로 상담 신청하기 →'; updateButton(); }
  });
  function showSuccess(id) {
    finished = true; status.textContent = '';
    document.getElementById('receiptNumber').textContent = '접수번호: ' + id;
    const success = document.getElementById('inquirySuccess'); success.hidden = false; success.focus();
    button.textContent = '상담 신청 완료'; updateButton();
  }
  configure();
})();
