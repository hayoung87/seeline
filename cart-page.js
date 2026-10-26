'use strict';
const C=window.SeelineCart,$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fields=['scope','region','area','timing','budgetNote','spaceNote','moodNote'];
let signature='',styleSignature;
const styleParam=new URLSearchParams(location.search).get('style');
if(window.SeelineStyles.some(s=>s.id===styleParam)){
 C.setBrief({styleId:styleParam});
 const cleanUrl=new URL(location.href);cleanUrl.searchParams.delete('style');history.replaceState(null,'',cleanUrl);
}
function renderStyle(){
 const style=window.SeelineStyles.find(s=>s.id===C.brief().styleId);
 if(styleSignature===(style?.id||''))return;
 styleSignature=style?.id||'';
 $('changeStyle').textContent=style?'다른 분위기로 바꾸기 ↗':'사진으로 골라보기 ↗';
 $('consultStyle').innerHTML=style?`<div class="consult-style-choice">${style.image?`<a class="consult-style-photo" href="${style.image}" target="_blank" rel="noopener" aria-label="${esc(style.name)} 참고 이미지 크게 보기"><img src="${style.image}" alt="${esc(style.name)} 분위기의 참고 공간"><span>AI 참고 이미지</span></a>`:'<span class="consult-style-unsure" aria-hidden="true">?</span>'}<div><strong>${esc(style.name)}</strong><p>${esc(style.description)}</p><small>${style.image?'선택한 분위기를 우리 집의 구조와 생활에 맞춰 함께 다듬어요.':'좋아하는 것보다 지금 불편한 점부터 들려주셔도 좋아요.'}</small></div><button type="button" id="removeStyle" aria-label="선택한 공간 분위기 삭제">삭제</button></div>`:'<p class="consult-style-empty">사진 한 장으로 원하는 느낌을 알려주세요. <a href="style.html">5가지 분위기 둘러보기 →</a><span>아직 모르겠다면 선택하지 않고 상담해도 괜찮아요.</span></p>';
}
function guardImages(){document.querySelectorAll('.cart-thumb img,.cart-project img').forEach(img=>img.onerror=()=>{const span=document.createElement('span');span.className='cart-photo-fallback';span.textContent='제품 사진 확인 ↗';img.replaceWith(span);});}
function render(){
 const ids=C.ids(),projects=C.projects();
 $('projectCount').textContent=projects.length+'개';$('furnitureCount').textContent=ids.length;$('itemCount').textContent=ids.length+'종 · '+ids.reduce((n,id)=>n+C.item(id).quantity,0)+'개';
 const next=JSON.stringify([ids,ids.map(id=>C.item(id)),projects]);
 if(next!==signature){signature=next;
 $('cartProjects').innerHTML=projects.length?projects.map(p=>`<article class="cart-project"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div><h3>${esc(p.name)}</h3><a href="index.html#work">시공사례 다시 보기 ↗</a></div><button type="button" data-remove-project="${esc(p.id)}" aria-label="${esc(p.name)} 관심 시공사례 삭제">삭제</button></article>`).join(''):'<div class="cart-empty"><p>마음에 남은 시공사례를 담아주세요.</p><a href="index.html#work">우리 집의 방향 찾아보기 ↗</a></div>';
 $('cartItems').innerHTML=ids.length?ids.map(id=>{const p=products.find(p=>p.id===id),a=C.item(id),b=p.brandName||brands.find(b=>b.id===p.brand)?.name||'';return `<article class="cart-item"><a class="cart-thumb" href="product.html?id=${encodeURIComponent(id)}">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}">`:'<span class="cart-photo-fallback">사진 준비 중</span>'}</a><div class="cart-item-info"><span class="cart-brand">${esc(b)}</span><h3><a href="product.html?id=${encodeURIComponent(id)}">${esc(p.name)}</a></h3>${p.variants?.length?`<label>구성<select data-variant="${esc(id)}"><option value=""${a.variantIndex===null?' selected':''}>상담하면서 정할게요</option>${p.variants.map((v,i)=>`<option value="${i}"${a.variantIndex===i?' selected':''}>${esc(v[0])} · ${v[1]} × ${v[2]} × ${v[3]}mm</option>`).join('')}</select></label>`:'<p class="cart-note">옵션·규격은 상담에서 함께 확인합니다.</p>'}<div class="cart-item-bottom"><label>수량 <input type="number" min="1" max="99" step="1" value="${a.quantity}" data-quantity="${esc(id)}" aria-label="${esc(p.name)} 수량"></label><a href="product.html?id=${encodeURIComponent(id)}${p.variants?.length?'#planner':''}">${p.variants?.length?'배치 다시 보기':'상세 보기'} ↗</a></div>${a.room?`<p class="cart-room">배치 참고 · ${esc(a.room.space)} ${esc(a.room.w)} × ${esc(a.room.d)} × ${esc(a.room.h)}mm</p>`:''}</div><button class="cart-remove" type="button" data-remove="${esc(id)}" aria-label="${esc(p.name)} 장바구니에서 삭제">삭제</button></article>`;}).join(''):'<div class="cart-empty"><h3>어떤 가구가 어울릴지 아직 모르셔도 괜찮아요.</h3><p>가구매칭에서 취향을 찾거나, 아래에서 인테리어 상담을 바로 시작해보세요.</p><a href="selection.html">가구 조합 둘러보기 ↗</a></div>';
 guardImages();
 }
 renderStyle();
 const b=C.brief();fields.forEach(k=>{if(document.activeElement!==$(k)&&b[k]!=null)$(k).value=b[k];});
 const text=C.summary();$('inquirySummary').value=text;$('emailInquiry').href='mailto:truenature00@naver.com?subject='+encodeURIComponent('[디자인시선] 내 공간 인테리어 상담')+'&body='+encodeURIComponent(text);
 if(C.storageFailed()){$('storageNotice').hidden=false;$('storageNotice').textContent='브라우저 저장이 제한되어 있습니다. 이동 전 상담 내용을 복사해 주세요.';}
}
fields.forEach(k=>$(k).addEventListener('input',()=>C.setBrief({[k]:$(k).value})));
$('consultStyle').addEventListener('click',e=>{if(e.target.closest('#removeStyle')){C.setBrief({styleId:''});$('changeStyle').focus();}});
$('cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b)C.remove(b.dataset.remove);});
$('cartProjects').addEventListener('click',e=>{const b=e.target.closest('[data-remove-project]');if(b)C.removeProject(b.dataset.removeProject);});
$('cartItems').addEventListener('change',e=>{if(e.target.matches('[data-quantity]')){const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>99){e.target.value=C.item(e.target.dataset.quantity).quantity;return;}C.updateItem(e.target.dataset.quantity,{quantity:n});}if(e.target.matches('[data-variant]'))C.updateItem(e.target.dataset.variant,{variantIndex:e.target.value===''?null:Number(e.target.value)});});
async function copyInquiry(message='상담 내용을 복사했습니다.'){try{await navigator.clipboard.writeText(C.summary());$('inquiryStatus').textContent=message;return true;}catch{$('inquirySummary').focus();$('inquirySummary').select();$('inquiryStatus').textContent='자동 복사가 제한되어 있습니다. 선택된 내용을 직접 복사한 뒤 열린 상담 화면에 붙여넣어 주세요.';return false;}}
$('copyInquiry').onclick=()=>copyInquiry();
$('consultLink').addEventListener('click',()=>{copyInquiry('상담 내용을 복사했습니다. 상담폼의 요청 사항에 붙여넣고 제출해 주세요.');});
$('kakaoInquiry').addEventListener('click',()=>{copyInquiry('상담 내용을 복사했습니다. 열린 카카오톡 채팅에서 입력창을 눌러 붙여넣고 전송해 주세요.');});
window.addEventListener('seeline:cart',render);render();
