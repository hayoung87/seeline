'use strict';
// Dimensioned geometry shared by elevation and room projections. Millimetres throughout.
const Placement=(()=>{
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function homography(q){const [a,b,c,d]=q,dx1=b[0]-c[0],dx2=d[0]-c[0],dx3=a[0]-b[0]+c[0]-d[0],dy1=b[1]-c[1],dy2=d[1]-c[1],dy3=a[1]-b[1]+c[1]-d[1],den=dx1*dy2-dx2*dy1;if(Math.abs(den)<1e-7)return null;const g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;return [b[0]-a[0]+g*b[0],d[0]-a[0]+h*d[0],a[0],b[1]-a[1]+g*b[1],d[1]-a[1]+h*d[1],a[1],g,h];}
 function validFloor(q){let sign=0;for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],c=q[(i+2)%4],cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.abs(cross)<100||sign&&Math.sign(cross)!==sign)return false;sign=Math.sign(cross);}return true;}
 function projector(q,ceiling,r){const m=homography(q);if(!m)return null;return (x,y,z=0)=>{const u=x/r.w,v=y/r.d,t=m[6]*u+m[7]*v+1;return [(m[0]*u+m[1]*v+m[2]+(ceiling[0]-q[0][0])*z/r.h)/t,(m[3]*u+m[4]*v+m[5]+(ceiling[1]-q[0][1])*z/r.h)/t];};}
 function inverse(q,point){const m=homography(q);if(!m)return null;const [X,Y]=point,A=m[0]-X*m[6],B=m[1]-X*m[7],C=X-m[2],D=m[3]-Y*m[6],E=m[4]-Y*m[7],F=Y-m[5],den=A*E-B*D;return Math.abs(den)<1e-7?null:[(C*E-B*F)/den,(A*F-C*D)/den];}
 function boxes(p,v){const W=v[1],D=v[2],H=v[3],out=[];const box=(x,y,z,w,d,h,color)=>out.push({x,y,z,w,d,h,color});if(p.category==='sofa'){
 const ink=p.id==='ink',leg=H*.08,seat=H*.46,n=v[0].startsWith('2')?2:v[0].startsWith('3')?3:v[0].startsWith('4')?4:v[0].startsWith('5')?5:6,arm=ink?0:W*.055,back=D*(ink?.24:.20);
 // Seats, raised back and individual arms expose the sofa silhouette.
 for(let i=0;i<n;i++)box(arm+i*(W-2*arm)/n,back,leg,(W-2*arm)/n,D-back,seat-leg,ink?'#bdb6aa':'#92725b');
 box(arm,0,leg,W-2*arm,back,H-leg,ink?'#ccc4b7':'#a48469');
 if(!ink){box(0,0,leg,arm,D,H*.75-leg,'#a48469');box(W-arm,0,leg,arm,D,H*.75-leg,'#a48469');}
 for(const xx of [W*.06,W*.90])for(const yy of [D*.10,D*.85])box(xx,yy,0,W*.025,D*.035,leg,'#48463f');
 }else if(p.category==='chair'){
 box(0,D*.78,H*.48,W,D*.22,H*.52,'#a39988');box(0,0,H*.45,W,D,H*.06,'#bbb19e');for(const xx of [0,W*.92])for(const yy of [0,D*.92])box(xx,yy,0,W*.08,D*.08,H*.45,'#66665d');
 }else{box(0,0,H*.94,W,D,H*.06,'#d2cbc0');for(const xx of [W*.12,W*.82])for(const yy of [D*.12,D*.82])box(xx,yy,0,W*.06,D*.06,H*.94,'#6c6b63');}return out;}
 function world(a,x,y,rotation,W,D){const turn=rotation%360;return turn===90?[x+D-a[1],y+a[0],a[2]]:turn===180?[x+W-a[0],y+D-a[1],a[2]]:turn===270?[x+a[1],y+W-a[0],a[2]]:[x+a[0],y+a[1],a[2]];}
 const pt=a=>a.map(n=>n.toFixed(2)).join(',');
 function furniture(p,v,project,x,y,rotation){let faces=[];for(const b of boxes(p,v)){const corners=[[b.x,b.y,b.z],[b.x+b.w,b.y,b.z],[b.x+b.w,b.y+b.d,b.z],[b.x,b.y+b.d,b.z],[b.x,b.y,b.z+b.h],[b.x+b.w,b.y,b.z+b.h],[b.x+b.w,b.y+b.d,b.z+b.h],[b.x,b.y+b.d,b.z+b.h]].map(a=>world(a,x,y,rotation,v[1],v[2]));for(const ids of [[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]]){const poly=ids.map(i=>project(...corners[i]));faces.push({poly,color:b.color,depth:poly.reduce((s,a)=>s+a[1],0)/4});}}faces.sort((a,b)=>a.depth-b.depth);return faces.map(f=>`<polygon points="${f.poly.map(pt).join(' ')}" fill="${f.color}" stroke="#534e43" stroke-width="1.2" stroke-linejoin="round"/>`).join('');}
 return {clamp,homography,validFloor,projector,inverse,boxes,world,furniture,pt};
})();
