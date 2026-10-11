'use strict';
const sets=[
 {name:'편안한 거실',ids:['ink','ink-table'],text:'패브릭 소파와 곡선 테이블을 연결하는 제안.'},
 {name:'정돈된 거실',ids:['tartan','kante'],text:'가죽 소파와 간결한 테이블을 연결하는 제안.'},
 {name:'원형 다이닝',ids:['round','petalo'],text:'테이블 1개 + 의자 4개 표시가 합계 2,442,000원. 배치·옵션 확인 전 참고 금액.'},
 {name:'타원형 다이닝',ids:['oval','note'],text:'테이블 1개 + 의자 4개 표시가 합계 3,343,000원. 배치·옵션 확인 전 참고 금액.'},
 {name:'소재가 읽히는 다이닝',ids:['fp-hush','moss-slide-chair'],text:'세라믹 상판과 컬러 체어를 연결하는 조합 제안. 색상·사이즈·의자 수량은 상담에서 맞춥니다.'},
 {name:'레이어드 거실',ids:['alloso-didim-3','moss-round-tea','rr-system04'],text:'패브릭 소파, 벌우드 테이블, 모듈 선반의 소재 대비를 살린 구성 제안.'},
 {name:'모듈형 거실',ids:['tartan','moss-lhr-st01','rr-system10'],text:'가죽 소파와 간결한 테이블, 높이감 있는 철제 선반으로 시선을 정리한 구성 제안.'}
];
const categoryNames={sofa:'소파', 'lounge-chair':'라운지체어','dining-table':'식탁','sofa-table':'소파 테이블',chair:'의자',stool:'스툴',storage:'수납·선반',desk:'책상',mirror:'거울',lighting:'조명',rug:'러그·카펫'};
const key='seeline-selection-v1';let selected=new Set();
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))selected=new Set(saved.filter(id=>products.some(p=>p.id===id)));}catch{}
const $=id=>document.getElementById(id),money=n=>n.toLocaleString('ko-KR')+'원';let storageFailed=false;
function persist(){try{localStorage.setItem(key,JSON.stringify([...selected]));}catch{storageFailed=true;}}
function toggle(id){selected.has(id)?selected.delete(id):selected.add(id);persist();render();}
function renderBrands(){const selector=$('brand');for(const b of brands){const option=document.createElement('option');option.value=b.id;option.textContent=b.name;selector.append(option);}
 const holder=$('brandLinks');holder.replaceChildren();for(const b of brands){const count=products.filter(p=>p.brand===b.id).length,card=document.createElement('article');card.className='brand-card';card.innerHTML=`<span class="brand-name">${b.name}</span><span class="brand-meta">${count}개 셀렉션 제품 · ${b.note}</span><button type="button" class="brand-filter-button">셀렉션 제품 보기 ↓</button><a class="brand-arrow" href="${b.catalog}" target="_blank" rel="noopener">브랜드 전체 보기 ↗</a>`;card.querySelector('button').onclick=()=>{$('brand').value=b.id;render();$('grid').scrollIntoView({behavior:'smooth',block:'start'});};holder.append(card);}}
function render(){
 const brand=$('brand').value||'all',room=$('room').value||'all',category=$('category').value||'all',q=$('search').value.trim().toLowerCase(),w=Number($('width').value),b=Number($('budget').value);
 const found=products.filter(p=>(brand==='all'||p.brand===brand)&&(room==='all'||p.room===room)&&(category==='all'||p.category===category)&&(!q||(p.name+' '+p.tags+' '+p.spec+' '+(p.brandName||'')).toLowerCase().includes(q))&&(!(w>0)||(p.width!==null&&p.width<=w))&&(!(b>0)||(p.price!==null&&p.price<=b)));
 $('grid').replaceChildren();$('results').textContent=found.length?`${found.length}개 제품`:'조건에 맞는 제품이 없습니다. 조건을 조정하거나 브랜드 전체 보기를 이용해 주세요.';
 for(const p of found){const card=document.createElement('article');card.className='product-card';const detail=`product.html?id=${encodeURIComponent(p.id)}`,brandName=p.brandName||brands.find(x=>x.id===p.brand)?.name||'';
 const photo=p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:`<span class="photo-placeholder"><span>${brandName}</span><strong>${categoryNames[p.category]||'CURATED'}</strong></span>`;
 card.innerHTML=`<a class="product-photo" href="${detail}" aria-label="${p.name} 상세 보기">${photo}</a><span class="tag">${brandName} / ${categoryNames[p.category]||'가구'}</span><h3><a href="${detail}">${p.name}</a></h3><p class="spec">${p.spec}</p><p>${p.detail}</p><p>${p.price?money(p.price)+' · 조회 시점 표시가':'가격·옵션은 판매처에서 확인'}</p><div class="actions"><a href="${p.url}" target="_blank" rel="noopener">상품 원문 보기 ↗</a><button type="button" aria-pressed="${selected.has(p.id)}">${selected.has(p.id)?'관심 목록에서 빼기':'관심 목록에 담기'}</button></div>`;
 card.querySelector('button').addEventListener('click',()=>toggle(p.id));$('grid').append(card);
 }
 $('count').textContent=selected.size;$('savedList').replaceChildren();const list=products.filter(p=>selected.has(p.id));if(!list.length)$('savedList').textContent='아직 담은 제품이 없습니다.';
 for(const p of list){const row=document.createElement('p'),text=document.createElement('span'),button=document.createElement('button');text.textContent=`${p.brandName||brands.find(b=>b.id===p.brand)?.name||''} · ${p.name}`;button.textContent='삭제';button.setAttribute('aria-label',p.name+' 관심 목록에서 삭제');button.onclick=()=>toggle(p.id);row.append(text,button);$('savedList').append(row);}
 $('summary').value=list.length?'[디자인시선 큐레이티드 셀렉션 상담]\n'+list.map(p=>`브랜드: ${p.brandName||brands.find(b=>b.id===p.brand)?.name||''}\n- ${p.name}\n  ${p.url}`).join('\n\n')+'\n\n희망 공간/구성:\n공간 치수:\n가구 예산:\n지역/입주 예정일:\n\n가격·옵션·공급·배치 적합성은 상담 시 확인':'관심 제품을 담으면 상담 내용이 여기에 표시됩니다.';
 if(storageFailed)$('copyStatus').textContent='브라우저 저장이 제한되어 현재 화면에서만 관심 목록이 유지됩니다.';
}
for(const s of sets){const el=document.createElement('article');el.className='set-card';const items=s.ids.map(id=>products.find(p=>p.id===id));el.innerHTML=`<h3>${s.name}</h3><div class="set-products">${items.map(p=>`<a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name} 상세 보기">${p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:`<span class="photo-placeholder"><strong>${p.name}</strong></span>`}<span>${p.name}</span></a>`).join('')}</div><p>${s.text}</p><button type="button">이 구성 담기</button>`;el.querySelector('button').onclick=()=>{s.ids.forEach(id=>selected.add(id));persist();render();$('saved').scrollIntoView({behavior:'smooth'});};$('sets').append(el);}
renderBrands();const initial=new URLSearchParams(location.search).get('room');if(['living','dining'].includes(initial))$('room').value=initial;
['brand','room','category','search','width','budget'].forEach(id=>$(id).addEventListener('input',render));
$('copy').onclick=async()=>{if(!selected.size){$('copyStatus').textContent='먼저 관심 제품을 담아 주세요.';return;}try{await navigator.clipboard.writeText($('summary').value);$('copyStatus').textContent='복사했습니다. 상담 신청폼의 요청 사항에 붙여넣어 주세요.';}catch{$('summary').focus();$('summary').select();$('copyStatus').textContent='자동 복사가 지원되지 않습니다. 선택된 내용을 직접 복사해 주세요.';}};
render();
