'use strict';
const C=window.SeelineCart,$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fields=['scope','region','area','timing','budgetNote','spaceNote','moodNote'];
let signature='';
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
 const b=C.brief();fields.forEach(k=>{if(document.activeElement!==$(k)&&b[k]!=null)$(k).value=b[k];});
 const text=C.summary();$('inquirySummary').value=text;$('emailInquiry').href='mailto:truenature00@naver.com?subject='+encodeURIComponent('[디자인시선] 내 공간 인테리어 상담')+'&body='+encodeURIComponent(text);
 if(C.storageFailed()){$('storageNotice').hidden=false;$('storageNotice').textContent='브라우저 저장이 제한되어 있습니다. 이동 전 상담 내용을 복사해 주세요.';}
}
fields.forEach(k=>$(k).addEventListener('input',()=>C.setBrief({[k]:$(k).value})));
$('cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b)C.remove(b.dataset.remove);});
$('cartProjects').addEventListener('click',e=>{const b=e.target.closest('[data-remove-project]');if(b)C.removeProject(b.dataset.removeProject);});
$('cartItems').addEventListener('change',e=>{if(e.target.matches('[data-quantity]')){const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>99){e.target.value=C.item(e.target.dataset.quantity).quantity;return;}C.updateItem(e.target.dataset.quantity,{quantity:n});}if(e.target.matches('[data-variant]'))C.updateItem(e.target.dataset.variant,{variantIndex:e.target.value===''?null:Number(e.target.value)});});
async function copyInquiry(){try{await navigator.clipboard.writeText(C.summary());$('inquiryStatus').textContent='복사했습니다. 상담폼의 요청 사항에 붙여넣고 제출해 주세요.';return true;}catch{$('inquirySummary').focus();$('inquirySummary').select();$('inquiryStatus').textContent='자동 복사가 제한되어 있습니다. 선택된 상담 내용을 직접 복사한 뒤 신청폼에 붙여넣어 주세요.';return false;}}
$('copyInquiry').onclick=copyInquiry;
$('consultLink').addEventListener('click',()=>{copyInquiry();});
window.addEventListener('seeline:cart',render);render();
