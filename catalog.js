'use strict';

const base='https://jacksonchameleon.co.kr/product/';
const products=[
{id:'ink',room:'living',name:'잉크 소파',url:base+'ink-sofa/4787/category/166/display/1/',price:null,width:null,spec:'패브릭 · 모듈 조합형',detail:'2인 1550×1050×685mm / 4인 3030×1300×685mm. 추천할 구성을 상담에서 확정합니다.',tags:'패브릭 모듈 소파'},
{id:'tartan',room:'living',name:'타탄 레더 소파',url:base+'tartan-sofa-leather/4399/category/166/display/1/',price:null,width:null,spec:'가죽 · FULL / COMBI 옵션',detail:'모듈·가죽·프레임 옵션별 확인이 필요합니다. 큰 모듈은 반입 경로를 실측합니다.',tags:'가죽 레더 모듈 소파'},
{id:'ink-table',room:'living',name:'잉크 소파 테이블',url:base+'ink-sofa-table/3980/category/303/display/1/',price:990000,width:1310,spec:'1310×772×358mm · 무늬목 MDF / 철판',detail:'오크·아이보리 옵션. 곡선 상판으로 거실 구성을 연결합니다.',tags:'테이블 오크 아이보리 곡선'},
{id:'kante',room:'living',name:'칸테 소파 테이블',url:base+'kante-sofa-table/3718/category/303/display/1/',price:760000,width:780,spec:'780×780×320mm · 아이보리 / 블랙',detail:'소재란에는 HPL·MDF·철제가 표시됩니다. 설명 일부와 차이가 있어 최종 소재는 확인이 필요합니다.',tags:'테이블 아이보리 블랙'},
{id:'round',room:'dining',name:'플라토 라운드 테이블',url:base+'plato-round-table/5566/category/291/display/1/',price:1122000,width:1100,spec:'1100×1100×740mm · HPL / MDF / 금속',detail:'원형 식탁. 의자와 주변 동선을 함께 확인합니다.',tags:'테이블 원형 라운드'},
{id:'oval',room:'dining',name:'플라토 오벌 테이블',url:base+'plato-oval-table/5567/category/291/display/1/',price:1463000,width:1600,spec:'1600×850×740mm · HPL / MDF / 스테인레스',detail:'화이트·오이스터·블랙 옵션. 길게 이어지는 식사 공간의 후보입니다.',tags:'테이블 타원 오벌'},
{id:'petalo',room:'dining',name:'페탈로 체어',url:base+'petalo-chair/1627/category/304/display/1/',price:330000,width:490,spec:'490×500×770mm · 합판 / 폴리에스테르 / 철제',detail:'내추럴·화이트·크림·그레이·딥그린·파우더블루 옵션.',tags:'의자 체어 크림 그레이'},
{id:'note',room:'dining',name:'노트 다이닝체어',url:base+'note-dining-chair/5126/category/304/display/1/',price:470000,width:562,spec:'562×496×773mm · 좌판 옵션 / 철제 다리',detail:'내추럴·블랙·레더 옵션과 크롬·블랙 다리를 확인합니다.',tags:'의자 체어 레더 블랙'}];

const variants={ink:[['4인',3030,1300,685],['2인',1550,1050,685],['5인',3415,1550,685],['6인',3800,1550,685]],tartan:[['3인',2300,1070,610],['3인 B',2540,1070,610],['4인 A',2940,1070,610]],'ink-table':[['기본',1310,772,358]],kante:[['기본',780,780,320]],round:[['기본',1100,1100,740]],oval:[['기본',1600,850,740]],petalo:[['기본',490,500,770]],note:[['기본',562,496,773]]};
products.forEach(p=>{p.image='images/products/'+p.id+'.png';p.variants=variants[p.id];});
