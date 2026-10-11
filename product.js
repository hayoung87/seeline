'use strict';
const $=id=>document.getElementById(id),p=products.find(x=>x.id===new URLSearchParams(location.search).get('id'));
let mode='plan',variantIndex=0,rotation=0,x=0,y=0,photoRatio=4/3,photoUrl=null,drag=null;
let pins=[[280,350],[720,350],[950,700],[50,700],[280,100]];
const clamp=Placement.clamp;
if(!p){$('detail').textContent='제품을 찾을 수 없습니다. 셀렉션 목록에서 다시 선택해 주세요.';$('planner').hidden=true;}else{
 document.title=p.name+' · 내 공간 배치 | 디자인시선';
 $('detail').innerHTML=`<div><img class="detail-photo" src="${p.image}" alt="${p.name} 공식 대표 이미지"><p class="work-note">공식 대표 사진입니다. 아래 배치 모델은 선택한 구성의 실측 크기를 반영하며, 사진의 모듈·색상과 다를 수 있습니다.</p></div><div><p class="hero-kicker">JACKSON CHAMELEON / ${p.room==='living'?'LIVING':'DINING'}</p><h1>${p.name}</h1><p>${p.detail}</p><p class="spec-list">${p.spec}</p><p id="dimensions"></p><p>${p.price?p.price.toLocaleString('ko-KR')+'원 · 공식 목록 표시가':'모듈·마감 옵션 확정 후 견적 확인'}</p><p><a class="button button-primary" href="#planner">내 공간에 배치하기</a></p><p><button class="button button-primary" id="saveProduct" type="button">관심 목록에 담기</button></p><p><a href="${p.url}" target="_blank" rel="noopener">공식 상세 정보와 옵션 확인 ↗</a></p><p id="saveStatus" role="status"></p></div>`;
 $('space').value=p.room==='living'?'거실':'다이닝';p.variants.forEach((v,i)=>{const opt=document.createElement('option');opt.value=i;opt.textContent=`${v[0]} · ${v[1]}×${v[2]}×${v[3]}mm`;$('variant').append(opt);});
 function dims(){const v=p.variants[variantIndex];return {v,w:rotation%180?v[2]:v[1],d:rotation%180?v[1]:v[2],h:v[3]};}
 function room(){const w=Number($('roomW').value),d=Number($('roomD').value),h=Number($('roomH').value);return w>=500&&w<=20000&&d>=500&&d<=20000&&h>=500&&h<=10000?{w,d,h}:null;}
 function svgText(X,Y,text){return `<text x="${X}" y="${Y}" text-anchor="middle" font-size="18" fill="#322e26">${text}</text>`;}
 function setupPins(){pins=[[280,350],[720,350],[950,700],[50,700],[280,100]];}
 function render(){const a=dims(),r=room(),photo=mode==='photo',front=!photo&&$('view').value==='front',scene=$('scene');
 $('dimensions').textContent=`선택 구성: ${a.v[0]} / 가로 ${a.v[1]} · 깊이 ${a.v[2]} · 높이 ${a.h}mm`;
 $('planMode').setAttribute('aria-pressed',!photo);$('photoMode').setAttribute('aria-pressed',photo);$('photoInputLabel').hidden=!photo;$('calibrate').hidden=!photo;$('viewLabel').hidden=photo;$('roomPhoto').hidden=!photo||!photoUrl;$('stage').classList.toggle('photo-mode',photo);$('stage').style.aspectRatio=photo?photoRatio:4/3;$('furniture').hidden=true;
 $('modeNote').textContent=photo?'사진에서 ① 뒤 왼쪽, ② 뒤 오른쪽, ③ 앞 오른쪽, ④ 앞 왼쪽 바닥을 드래그해 맞추고, ⑤를 ① 바로 위 천장에 맞춰 주세요. 입력한 가로·깊이·높이에 따라 크기와 원근을 계산합니다. 수직선이 평행한 사진을 기준으로 하며 왜곡·가림은 보정하지 않습니다.':front?'폭과 높이를 같은 축척으로 그린 정면 입면도입니다. 좌판·등받이·팔걸이를 나누어 표시합니다. 깊이와 동선은 공간 3D 보기에서 확인하세요.':'공간과 가구를 동일한 실측 비율로 그린 3D 배치입니다. 방향 버튼은 바닥에서 100mm씩 이동합니다. 모델을 드래그하거나 방향키로 이동할 수 있습니다.';
 if(!r){scene.innerHTML='';$('plannerStatus').textContent='가로·깊이 500~20,000mm, 높이 500~10,000mm를 입력해 주세요.';return;}
 x=clamp(x,0,Math.max(0,r.w-a.w));y=clamp(y,0,Math.max(0,r.d-a.d));
 const fits=a.w<=r.w&&a.d<=r.d&&a.h<=r.h;
 $('position').textContent=`왼쪽 ${Math.round(x)}mm · 뒤 벽 ${Math.round(y)}mm · 방향 ${rotation}° · ${a.v[0]}`;
 $('plannerStatus').textContent=!fits?'제품이 공간의 폭·깊이 또는 높이를 초과합니다. 빨간 외곽을 확인해 주세요.':photo&&!photoUrl?'집 사진을 선택한 뒤 바닥과 천장 기준점을 맞춰 주세요. JPEG·PNG·WebP 최대 15MB.':'입력한 공간 안에 들어가는 크기입니다. 착석·보행·문 여닫기 여유는 별도로 확인하세요.';
 $('modeNote').textContent+=' 형상의 곡선·모듈 수·코너 구성은 실제 제품과 다를 수 있는 간략 모델입니다.';
 const floor=photo?pins.slice(0,4):[[260,350],[740,350],[960,700],[40,700]],ceiling=photo?pins[4]:[260,80];
 if(photo&&photoUrl&&(!Placement.validFloor(floor)||ceiling[1]>=floor[0][1]-20)){scene.innerHTML=pinMarkup();$('plannerStatus').textContent='바닥 네 점을 교차하지 않는 사각형으로 맞추고 천장점을 뒤 왼쪽 바닥점 위에 놓아 주세요.';return;}
 let html='';
 if(front){
 const s=Math.min(850/Math.max(r.w,a.w),550/Math.max(r.h,a.h)),left=(1000-r.w*s)/2,bottom=660;
 html+=`<rect x="${left}" y="${bottom-r.h*s}" width="${r.w*s}" height="${r.h*s}" fill="#f7f4ed" stroke="#bbb3a6"/>`;
 const project=(X,Y,Z)=>[left+X*s,bottom-Z*s];
 html+=`<g data-model="true" tabindex="0" role="button" aria-label="가구를 좌우로 이동">${Placement.furniture(p,a.v,project,x,y,rotation)}</g>`;
 html+=`<path d="M ${left+x*s} ${bottom+15} v 12 h ${a.w*s} v -12" fill="none" stroke="${fits?'#5b6b4e':'#b64434'}"/>`;
 html+=svgText(left+(x+a.w/2)*s,bottom+52,`${a.w}mm · 높이 ${a.h}mm`)+svgText(500,35,`정면 입면 · 공간 ${r.w} × ${r.h}mm`);
 }else{
 const project=Placement.projector(floor,ceiling,r),points=a=>a.map(Placement.pt).join(' ');
 if(!photo||!photoUrl)html+=`<polygon points="${points([floor[0],floor[1],project(r.w,0,r.h),ceiling])}" fill="#eee9df"/><polygon points="${points([floor[1],floor[2],project(r.w,r.d,r.h),project(r.w,0,r.h)])}" fill="#e3dfd4"/>`;
 html+=`<polygon points="${points(floor)}" fill="${photo?'#d8dec022':'#f3f0e5'}" stroke="#879177" stroke-width="2"/>`;
 for(let i=1;i<5;i++)html+=`<path d="M ${Placement.pt(project(r.w*i/5,0))} L ${Placement.pt(project(r.w*i/5,r.d))} M ${Placement.pt(project(0,r.d*i/5))} L ${Placement.pt(project(r.w,r.d*i/5))}" stroke="#87917755" fill="none"/>`;
 const footprint=[[x,y],[x+a.w,y],[x+a.w,y+a.d],[x,y+a.d]].map(t=>project(...t));
 html+=`<polygon points="${points(footprint)}" fill="none" stroke="${fits?'#5b6b4e':'#b64434'}" stroke-width="3"/>`;
 html+=`<g data-model="true" tabindex="0" role="button" aria-label="배치 가구: 드래그 또는 방향키로 이동">${Placement.furniture(p,a.v,project,x,y,rotation)}</g>`;
 if(photo)html+=pinMarkup();else html+=svgText(500,30,`공간 ${r.w} × ${r.d} × ${r.h}mm`);
 }
 scene.innerHTML=html;
 }
 function pinMarkup(){return pins.map((a,i)=>`<g data-pin="${i}" tabindex="0" role="button" aria-label="${['뒤 왼쪽 바닥','뒤 오른쪽 바닥','앞 오른쪽 바닥','앞 왼쪽 바닥','뒤 왼쪽 천장'][i]} 기준점: 드래그 또는 방향키"><circle cx="${a[0]}" cy="${a[1]}" r="18" fill="#5b6b4e" stroke="white" stroke-width="3"/><text x="${a[0]}" y="${a[1]+6}" text-anchor="middle" fill="white" font-size="18" pointer-events="none">${i+1}</text></g>`).join('');}
 function center(){const r=room(),a=dims();if(r){x=Math.max(0,(r.w-a.w)/2);y=Math.max(0,(r.d-a.d)/2);}render();}
 function move(dx,dy){x+=dx*100;y+=dy*100;render();}
 $('planMode').onclick=()=>{mode='plan';render();};$('photoMode').onclick=()=>{mode='photo';render();};$('variant').onchange=()=>{variantIndex=Number($('variant').value);render();};
 ['roomW','roomD','roomH','view'].forEach(id=>$(id).addEventListener('input',render));$('reset').onclick=()=>{rotation=0;center();};$('calibrate').onclick=()=>{setupPins();render();};$('rotate').onclick=()=>{rotation=(rotation+90)%360;render();};
 const directions={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
 document.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>move(...({up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.move])));
 $('scene').addEventListener('keydown',e=>{const d=directions[e.key];if(!d)return;const pin=e.target.closest('[data-pin]');if(pin){const i=Number(pin.dataset.pin);pins[i]=[clamp(pins[i][0]+d[0]*5,20,980),clamp(pins[i][1]+d[1]*5,20,730)];render();$('scene').querySelector(`[data-pin="${i}"]`).focus();}else if(e.target.closest('[data-model]')){move(...d);$('scene').querySelector('[data-model]').focus();}else return;e.preventDefault();});
 function pointer(e){const rect=$('scene').getBoundingClientRect();return [(e.clientX-rect.left)/rect.width*1000,(e.clientY-rect.top)/rect.height*750];}
 $('scene').addEventListener('pointerdown',e=>{const pin=e.target.closest('[data-pin]'),model=e.target.closest('[data-model]');if(!pin&&!model||!room())return;drag={pin:pin?Number(pin.dataset.pin):null,start:pointer(e),x,y};$('scene').setPointerCapture(e.pointerId);e.preventDefault();});
 $('scene').addEventListener('pointermove',e=>{if(!drag)return;const t=pointer(e),r=room();if(!r)return;if(drag.pin!==null){pins[drag.pin]=[clamp(t[0],20,980),clamp(t[1],20,730)];}else if(mode==='plan'&&$('view').value==='front'){const s=Math.min(850/Math.max(r.w,dims().w),550/Math.max(r.h,dims().h));x=drag.x+(t[0]-drag.start[0])/s;}else{const floor=mode==='photo'?pins.slice(0,4):[[260,350],[740,350],[960,700],[40,700]],start=Placement.inverse(floor,drag.start),end=Placement.inverse(floor,t);if(start&&end){x=drag.x+(end[0]-start[0])*r.w;y=drag.y+(end[1]-start[1])*r.d;}}render();});
 ['pointerup','pointercancel','lostpointercapture'].forEach(event=>$('scene').addEventListener(event,()=>drag=null));
 $('photo').onchange=()=>{const file=$('photo').files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024){$('plannerStatus').textContent='JPEG·PNG·WebP 파일을 15MB 이하로 선택해 주세요.';return;}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=url;photoRatio=img.naturalWidth/img.naturalHeight;$('roomPhoto').src=url;setupPins();mode='photo';render();};img.onerror=()=>{URL.revokeObjectURL(url);$('plannerStatus').textContent='사진을 읽을 수 없습니다. 다른 파일을 선택해 주세요.';};img.src=url;};
 $('saveProduct').onclick=()=>{try{let ids=JSON.parse(localStorage.getItem('seeline-selection-v1')||'[]');if(!Array.isArray(ids))ids=[];localStorage.setItem('seeline-selection-v1',JSON.stringify([...new Set([...ids,p.id])]));$('saveStatus').textContent='담았습니다. 셀렉션 목록에서 상담 내용을 복사할 수 있습니다.';}catch{$('saveStatus').textContent='관심 목록을 저장하지 못했습니다.';}};
 center();
}
