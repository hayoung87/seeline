/* Shared consultation cart. Keep the original product ID key for existing visitors. */
(function(){
 'use strict';
 const ID_KEY='seeline-selection-v1',DETAIL_KEY='seeline-cart-details-v1';
 let ids=[],data={items:{},projects:[],brief:{}},failed=false;
 const catalog=()=>typeof products==='undefined'?[]:products;
 function read(){try{const old=JSON.parse(localStorage.getItem(ID_KEY)||'[]');ids=Array.isArray(old)?[...new Set(old.filter(id=>catalog().some(p=>p.id===id)))]:[];const raw=JSON.parse(localStorage.getItem(DETAIL_KEY)||'{}');data={items:raw&&typeof raw.items==='object'&&raw.items?raw.items:{},projects:Array.isArray(raw?.projects)?raw.projects.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string'):[],brief:raw&&typeof raw.brief==='object'&&raw.brief?raw.brief:{}};}catch{failed=true;}}
 function notify(){document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=ids.length+data.projects.length);window.dispatchEvent(new Event('seeline:cart'));}
 function save(){try{localStorage.setItem(ID_KEY,JSON.stringify(ids));localStorage.setItem(DETAIL_KEY,JSON.stringify(data));}catch{failed=true;}notify();}
 function item(id){const raw=data.items[id]||{},p=catalog().find(p=>p.id===id),v=Number(raw.variantIndex);return {...raw,quantity:Math.max(1,Math.min(99,Number(raw.quantity)||1)),variantIndex:raw.variantIndex!=null&&Number.isInteger(v)&&p?.variants?.[v]?v:null};}
 function brand(p){return p.brandName||(typeof brands==='undefined'?'':brands.find(b=>b.id===p.brand)?.name)||'';}
 function summary(){const b=data.brief,lines=['[디자인시선 인테리어 상담]','상담 내용: '+(b.scope||'인테리어 설계·시공 + 가구 큐레이션'),''];const style=(window.SeelineStyles||[]).find(s=>s.id===b.styleId);if(style){lines.push('원하는 공간 분위기: '+style.name);if(style.image){lines.push('느낌: '+style.description,'참고 이미지: '+new URL(style.image,location.href).href,'스타일 참고용 AI 이미지이며 실제 시공사례가 아닙니다.');}else lines.push('생활과 취향을 이야기하며 함께 정하고 싶습니다.');lines.push('');}if(data.projects.length){lines.push('관심 시공사례: '+data.projects.map(p=>p.name).join(', '),'');}if(ids.length){lines.push('관심 가구:');ids.forEach((id,i)=>{const p=catalog().find(p=>p.id===id);if(!p)return;const a=item(id),v=p.variants?.[a.variantIndex];lines.push(`${i+1}. ${brand(p)} · ${p.name} / ${a.quantity}개`);if(v)lines.push(`구성: ${v[0]} / 가로 ${v[1]} × 깊이 ${v[2]} × 높이 ${v[3]}mm`);else lines.push('구성: 상담 시 선택');if(a.room){const r=a.room;lines.push(`배치 참고: ${r.space||'공간'} ${r.w} × ${r.d} × ${r.h}mm`);if(Number.isFinite(r.x)&&Number.isFinite(r.y))lines.push(`제품 위치: 왼쪽 ${r.x}mm · 뒤 벽 ${r.y}mm · 회전 ${r.rotation||0}°`);}lines.push(p.url,'');});}else lines.push('가구는 상담에서 함께 정하고 싶습니다.','');[['지역·주거 형태','region'],['면적','area'],['희망 공사·입주 시기','timing'],['전체 예산','budgetNote'],['공간 크기·현재 불편한 점','spaceNote'],['원하는 분위기·유지할 가구','moodNote']].forEach(([label,key])=>{if(b[key])lines.push(label+': '+b[key]);});lines.push('','제품 옵션·가격과 공간에 맞는 배치는 상담에서 확인하고 싶습니다.');return lines.join('\n');}
 window.SeelineCart={ids:()=>[...ids],item,projects:()=>data.projects.map(p=>({...p})),brief:()=>({...data.brief}),summary,storageFailed:()=>failed,
 add(id,info={}){if(!catalog().some(p=>p.id===id))return;if(!ids.includes(id))ids.push(id);data.items[id]={...item(id),...info};save();},
 remove(id){ids=ids.filter(x=>x!==id);delete data.items[id];save();},
 updateItem(id,info){if(!ids.includes(id))return;data.items[id]={...item(id),...info};save();},
 addProject(p){if(!data.projects.some(x=>x.id===p.id))data.projects.push(p);save();},
 removeProject(id){data.projects=data.projects.filter(p=>p.id!==id);save();},
 setBrief(brief){data.brief={...data.brief,...brief};save();}
 };
 read();notify();window.addEventListener('storage',e=>{if(e.key===ID_KEY||e.key===DETAIL_KEY||e.key===null){read();notify();}});
})();
