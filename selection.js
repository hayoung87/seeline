'use strict';
const sets=[
 {name:'곡선으로 이어지는 거실',room:'living',ids:['ink','ink-table'],text:'소파와 테이블의 곡선을 연결합니다. 큰 소파를 선택할 때는 테이블 주위의 여백을 함께 살펴보세요.',point:'형태의 연결 · 여백'},
 {name:'낮은 무게감의 거실',room:'living',ids:['tartan','kante'],text:'낮은 등받이와 간결한 테이블로 수평선을 맞춥니다. 가죽과 상판의 색상은 바닥·벽의 톤과 함께 고릅니다.',point:'높이의 균형 · 소재'},
 {name:'둘러앉는 원형 다이닝',room:'dining',ids:['round','petalo'],text:'원형 테이블과 가벼운 선의 의자를 연결합니다. 의자를 빼고 앉는 자리까지 공간에 포함해 보세요.',point:'생활 동선 · 형태'},
 {name:'길게 이어지는 다이닝',room:'dining',ids:['oval','note'],text:'타원형 테이블과 의자의 비례를 맞춥니다. 가족 수와 식탁에서 보내는 시간을 기준으로 구성을 정합니다.',point:'비례 · 사용 방식'},
 {name:'소재가 읽히는 다이닝',room:'dining',ids:['fp-hush','moss-slide-chair'],text:'세라믹 상판과 컬러 체어가 만드는 조합입니다. 주변 마감과 함께 색상의 중심을 정해보세요.',point:'색과 소재의 관계'},
 {name:'수납까지 연결한 거실',room:'living',ids:['alloso-didim-3','moss-round-tea','rr-system04'],text:'소파와 테이블에 선반을 더한 구성입니다. 수납의 높이와 비워둘 면을 함께 조율합니다.',point:'수납의 높이 · 균형'},
 {name:'선을 정돈한 거실',room:'living',ids:['tartan','moss-lhr-st01','rr-system10'],text:'가죽 소파와 철제 선반의 선을 연결합니다. 높이가 있는 수납은 시야와 채광을 함께 확인합니다.',point:'시선 · 소재 대비'}
];
const categoryNames={sofa:'소파','lounge-chair':'라운지체어','dining-table':'식탁','sofa-table':'소파 테이블',chair:'의자',stool:'스툴',storage:'수납·선반',desk:'책상',mirror:'거울',lighting:'조명',rug:'러그·카펫'};
const key='seeline-selection-v1',$=id=>document.getElementById(id);
let selected=new Set(),storageFailed=false,limit=12,expandedSets=false,toastTimer;
try{const v=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(v))selected=new Set(v.filter(id=>products.some(p=>p.id===id)));}catch{}
const brandName=p=>p.brandName||brands.find(b=>b.id===p.brand)?.name||'';
const canPlace=p=>Boolean(p.variants?.length);
const detail=p=>`product.html?id=${encodeURIComponent(p.id)}`;
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function photo(p){return p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">`:`<span class="photo-placeholder"><span>${escapeHTML(brandName(p))}</span><strong>사진 준비 중</strong></span>`;}
function guardImages(root){root.querySelectorAll('img').forEach(img=>{img.onerror=()=>{const fallback=document.createElement('span');fallback.className='photo-placeholder';fallback.textContent='사진을 불러오지 못했어요 · 상세 정보 보기';img.replaceWith(fallback);};});}
function persist(){try{localStorage.setItem(key,JSON.stringify([...selected]));}catch{storageFailed=true;}}
function announce(message){$('matchToast').textContent=message;$('matchToast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('matchToast').classList.remove('visible'),2400);}
function syncButtons(){document.querySelectorAll('[data-save]').forEach(b=>{const saved=selected.has(b.dataset.save);b.setAttribute('aria-pressed',String(saved));b.textContent=saved?'담음 ✓':'내 조합에 담기 +';b.setAttribute('aria-label',(products.find(p=>p.id===b.dataset.save)?.name||'제품')+(saved?' 내 조합에서 빼기':' 내 조합에 담기'));});}
function toggleProduct(id){const wasSaved=selected.has(id);wasSaved?selected.delete(id):selected.add(id);persist();renderSaved();syncButtons();announce(wasSaved?'내 조합에서 뺐습니다.':'내 조합에 담았습니다.');}
function renderSets(){const room=$('room').value,visible=sets.filter(s=>room==='all'||s.room===room);$('sets').replaceChildren();
 for(const s of (expandedSets?visible:visible.slice(0,3))){const items=s.ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);if(!items.length)continue;
 const card=document.createElement('article');card.className='set-card';card.innerHTML=`<p class="set-point">${s.point}</p><h3>${s.name}</h3><div class="set-products">${items.map(p=>`<a href="${detail(p)}">${photo(p)}<span>${escapeHTML(p.name)}</span></a>`).join('')}</div><p class="set-explanation">${s.text}</p><button type="button">이 조합 담기 +</button>`;
 card.querySelector('button').onclick=()=>{items.forEach(p=>selected.add(p.id));persist();renderSaved();syncButtons();announce(`${s.name} 조합을 담았습니다.`);};guardImages(card);$('sets').append(card);}
 $('moreSets').hidden=visible.length<=3;$('moreSets').textContent=expandedSets?'조합 접기 ↑':'다른 조합 더 보기 ↓';
 document.querySelectorAll('[data-room]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===room)));
}
function renderProducts(){const brand=$('brand').value,room=$('room').value,category=$('category').value,q=$('search').value.trim().toLowerCase(),w=Number($('width').value),budget=Number($('budget').value);
 const found=products.filter(p=>(brand==='all'||p.brand===brand)&&(room==='all'||p.room===room)&&(category==='all'||p.category===category)&&(!q||[p.name,p.tags,p.spec,brandName(p)].join(' ').toLowerCase().includes(q))&&(!$('placeable').checked||canPlace(p))&&(!(w>0)||((p.width>0&&p.width<=w)||p.variants?.some(v=>v[1]<=w)))&&(!(budget>0)||(p.price>0&&p.price<=budget)));
 $('grid').replaceChildren();$('results').textContent=`${found.length}개 제품${found.length>limit?` · ${limit}개 표시`:''}`;
 if(!found.length){const empty=document.createElement('div');empty.className='matching-empty';empty.innerHTML='<h3>조건에 맞는 가구가 아직 없어요.</h3><p>검색어나 필터를 조금 넓혀보세요.</p><button class="text-button" type="button">전체 가구 다시 보기 ↗</button>';empty.querySelector('button').onclick=resetFilters;$('grid').append(empty);}
 for(const p of found.slice(0,limit)){const card=document.createElement('article');card.className='product-card';card.innerHTML=`<a class="product-photo" href="${detail(p)}" aria-label="${escapeHTML(p.name)} 상세 보기">${photo(p)}${canPlace(p)?'<span class="placement-badge">배치 가능</span>':''}</a><span class="tag">${escapeHTML(brandName(p))} · ${categoryNames[p.category]||'가구'}</span><h3><a href="${detail(p)}">${escapeHTML(p.name)}</a></h3><p class="spec">${escapeHTML(p.spec)}</p><div class="actions"><a href="${detail(p)}${canPlace(p)?'#planner':''}">${canPlace(p)?'배치해보기 ↗':'상세 보기 ↗'}</a><button type="button" data-save="${p.id}" aria-label="${escapeHTML(p.name)} 내 조합에 담기" aria-pressed="${selected.has(p.id)}">담기</button></div>`;
 card.querySelector('[data-save]').onclick=()=>toggleProduct(p.id);guardImages(card);$('grid').append(card);}
 $('loadMore').hidden=found.length<=limit;syncButtons();
}
function updateSummary(){const list=products.filter(p=>selected.has(p.id));$('summary').value=list.length?'[디자인시선 가구매칭 상담]\n'+list.map(p=>`${brandName(p)} · ${p.name}\n${p.url}`).join('\n\n')+`\n\n공간 크기·특징: ${$('spaceNote').value}\n원하는 분위기: ${$('moodNote').value}\n희망 수량·예산:\n지역·입주 예정일:\n\n제품 옵션·가격·수량·배치 적합성은 상담에서 확인합니다.`:'마음에 드는 가구를 담으면 상담 내용이 여기에 정리됩니다.';}
function renderSaved(){const list=products.filter(p=>selected.has(p.id));$('count').textContent=selected.size;$('dockCount').textContent=selected.size;$('savedList').replaceChildren();
 if(!list.length){$('savedList').innerHTML='<div class="matching-empty"><h3>우리 집의 첫 조합을 찾아보세요.</h3><p>제안된 조합이나 마음에 드는 제품을 담아둘 수 있어요.</p><a href="#combinations">공간별 조합 살펴보기 ↑</a></div>';}
 for(const p of list){const row=document.createElement('article');row.className='saved-item';row.innerHTML=`<a class="saved-photo" href="${detail(p)}">${photo(p)}</a><div><span>${escapeHTML(brandName(p))}</span><h3><a href="${detail(p)}">${escapeHTML(p.name)}</a></h3><a class="saved-detail" href="${detail(p)}${canPlace(p)?'#planner':''}">${canPlace(p)?'제품별 배치 미리보기 ↗':'제품 상세 보기 ↗'}</a></div><button type="button" aria-label="${escapeHTML(p.name)} 내 조합에서 빼기">빼기</button>`;row.querySelector('button').onclick=()=>toggleProduct(p.id);guardImages(row);$('savedList').append(row);}
 updateSummary();if(storageFailed)$('copyStatus').textContent='브라우저 저장이 제한되어 현재 화면에서만 조합이 유지됩니다.';
}
function updateFilters(){limit=12;renderProducts();}
function changeRoom(room){$('room').value=room;expandedSets=false;renderSets();updateFilters();const url=new URL(location.href);url.searchParams.set('room',room);history.replaceState(null,'',url);}
function resetFilters(){['brand','category'].forEach(id=>$(id).value='all');['search','width','budget'].forEach(id=>$(id).value='');$('placeable').checked=false;changeRoom('all');}
for(const b of brands){const o=document.createElement('option');o.value=b.id;o.textContent=b.name;$('brand').append(o);}
const initial=new URLSearchParams(location.search).get('room');if(['living','dining','all'].includes(initial))$('room').value=initial;
document.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>changeRoom(b.dataset.room));
$('room').onchange=()=>changeRoom($('room').value);
['brand','category','search','width','budget','placeable'].forEach(id=>$(id).addEventListener('input',updateFilters));
['spaceNote','moodNote'].forEach(id=>$(id).addEventListener('input',updateSummary));
$('resetFilters').onclick=resetFilters;$('moreSets').onclick=()=>{expandedSets=!expandedSets;renderSets();};$('loadMore').onclick=()=>{limit+=12;renderProducts();};
$('copy').onclick=async()=>{if(!selected.size){$('copyStatus').textContent='먼저 가구를 내 조합에 담아 주세요.';return;}try{await navigator.clipboard.writeText($('summary').value);$('copyStatus').textContent='복사했습니다. 상담 신청폼의 요청 사항에 붙여넣어 주세요.';}catch{$('summary').focus();$('summary').select();$('copyStatus').textContent='선택된 내용을 직접 복사해 주세요.';}};
window.addEventListener('storage',e=>{if(e.key!==key)return;try{const ids=JSON.parse(e.newValue||'[]');selected=new Set(Array.isArray(ids)?ids.filter(id=>products.some(p=>p.id===id)):[]);renderSaved();syncButtons();}catch{}});
renderSets();renderProducts();renderSaved();
