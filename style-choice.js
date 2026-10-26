/* One choice, then carry it into the existing consultation brief. */
(function () {
  'use strict';
  const form = document.getElementById('styleForm');
  const button = document.getElementById('styleContinue');
  const status = document.getElementById('styleStatus');
  const styles = window.SeelineStyles;
  const query = new URLSearchParams(location.search).get('style');
  const saved = query || window.SeelineCart.brief().styleId;
  const choice = styles.find(style => style.id === saved);
  if (choice) form.elements.style.value = choice.id;

  function update() {
    const selected = styles.find(style => style.id === form.elements.style.value);
    button.disabled = !selected;
    button.textContent = selected?.id === 'unsure' ? '함께 취향 찾으며 상담하기 →' : '이런 느낌으로 상담하기 →';
    status.textContent = selected ? (selected.id === 'unsure' ? '괜찮아요. 생활 이야기부터 시작해요.' : '선택한 분위기: ' + selected.name) : '마음이 가는 사진을 하나 골라주세요.';
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', event => {
    const selected = styles.find(style => style.id === form.elements.style.value);
    if (!selected) { event.preventDefault(); return; }
    window.SeelineCart.setBrief({ styleId: selected.id });
    // The native form also carries this non-sensitive ID in the URL when storage is blocked.
  });
  update();
})();
