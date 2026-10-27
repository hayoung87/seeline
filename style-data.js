/* Shared reference styles: consultation cues, not fixed design packages. */
window.SeelineStyles = Object.freeze([
  { id: 'minimal', name: '밝은 미니멀', description: '화이트 · 간결한 선 · 넓은 여백', image: 'images/styles/minimal.webp' },
  { id: 'natural', name: '따뜻한 내추럴', description: '우드 · 크림톤 · 편안한 질감', image: 'images/styles/natural.webp' },
  { id: 'modern', name: '차분한 모던', description: '그레이 · 스톤 · 깊이 있는 색감', image: 'images/styles/modern.webp' },
  { id: 'classic', name: '우아한 클래식', description: '몰딩 · 곡선 · 은은한 장식', image: 'images/styles/classic.webp' },
  { id: 'chrome', name: '감각적인 미드센추리', description: '금속 · 우드 · 컬러 포인트', image: 'images/styles/chrome.webp' },
  { id: 'unsure', name: '아직 모르겠어요', description: '대화하면서 함께 찾아갈게요.', image: null }
].map(style => Object.freeze(style)));
