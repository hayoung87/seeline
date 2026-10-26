"use strict";
const projects={
 namyang:{name:'남양휴튼',photos:[['hero-namyang.jpg','거실과 다이닝'],['work-namyang-living.jpg','다이닝'],['work-namyang-kitchen.jpg','주방']]},
 blooming:{name:'벽산블루밍',photos:[['work-haeundoosan-living.jpg','거실'],['work-haeundoosan-kitchen.jpg','주방'],['work-haeundoosan-entry.jpg','드레스룸'],['work-haeundoosan-closet.jpg','수납']]},
 'project-a':{name:'주거 프로젝트 A',photos:[['work-proja-kitchen.jpg','주방'],['work-proja-closet.jpg','드레스룸']]}
};
const dialog=document.getElementById('projectDialog');let activeProject,toastTimer;
function toast(s){const el=document.getElementById('siteToast');el.textContent=s;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2600);}
function saveProject(id){const p=projects[id];SeelineCart.addProject({id,name:p.name,image:'images/'+p.photos[0][0]});toast('관심 시공사례를 장바구니에 담았습니다.');document.getElementById('projectSaveStatus').textContent='장바구니에 담았습니다. 상담 시 참고할 공간으로 전달됩니다.';}
document.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>{activeProject=b.dataset.project;document.getElementById('projectSaveStatus').textContent='';const p=projects[activeProject];document.getElementById('projectTitle').textContent=p.name;document.getElementById('projectPhotos').innerHTML=p.photos.map(([src,caption])=>`<figure><img src="images/${src}" alt="${p.name} ${caption}"><figcaption>${caption}</figcaption></figure>`).join('');dialog.showModal();document.body.classList.add('dialog-open');});
document.querySelectorAll('[data-save-project]').forEach(b=>b.onclick=()=>saveProject(b.dataset.saveProject));
document.getElementById('closeProject').onclick=()=>dialog.close();dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('dialogSave').onclick=()=>saveProject(activeProject);document.getElementById('dialogConsult').onclick=()=>saveProject(activeProject);
