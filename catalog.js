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
products.forEach(p=>{p.image='images/products/'+p.id+'.png';p.variants=variants[p.id];p.brand='jackson';});

const productCategories={ink:'sofa',tartan:'sofa','ink-table':'sofa-table',kante:'sofa-table',round:'dining-table',oval:'dining-table',petalo:'chair',note:'chair'};
products.forEach(p=>p.category=productCategories[p.id]);

// Brand catalog entries are a hand-curated, photo-first selection. Store prices and
// dimensions are intentionally omitted unless verified in the product specification.
const brands=[
 {id:'jackson',name:'젝슨카멜레온',url:'https://jacksonchameleon.co.kr/',note:'공식 제품 페이지',catalog:'https://jacksonchameleon.co.kr/category/shop/178/'},
 {id:'flatpoint',name:'플랫포인트',url:'https://store.ohou.se/brands/2704',note:'오늘의집 브랜드관',catalog:'https://store.ohou.se/brands/2704'},
 {id:'mosscarpets',name:'모스카펫',url:'https://store.ohou.se/brands/83315',note:'오늘의집 브랜드관',catalog:'https://store.ohou.se/brands/83315'},
 {id:'rareraw',name:'레어로우',url:'https://store.ohou.se/brands/1443',note:'오늘의집 브랜드관',catalog:'https://store.ohou.se/brands/1443'},
 {id:'dese',name:'드세데',url:'https://interiorteacher.com/curated-collection/%EB%93%9C%EC%84%B8%EB%8D%B0-DS-266-SELECT-ROYAL-23961',note:'인테리어티쳐 큐레이션',catalog:'https://interiorteacher.com/curated-collection/%EB%93%9C%EC%84%B8%EB%8D%B0-DS-266-SELECT-ROYAL-23961'},
 {id:'alloso',name:'알로소',url:'https://www.alloso.co.kr/',note:'공식 제품 페이지',catalog:'https://www.alloso.co.kr/'}
];
const sourced=[
// Flatpoint — currently visible living/dining product range
['fp-page','flatpoint','페이지 소파 테이블','sofa-table','living','https://store.ohou.se/goods/3350421','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-500257917599808.png?w=900&q=80','오늘의집 상품 목록'],
['fp-hush','flatpoint','허쉬 세라믹 테이블','dining-table','dining','https://store.ohou.se/goods/3921046','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-459515869253696.jpg?w=900&q=80','원형·타원 옵션'],
['fp-arctic-chair','flatpoint','아틱 체어','chair','dining','https://store.ohou.se/goods/2802250','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-504866012373056.png?w=900&q=80','7 colors'],
['fp-oyu','flatpoint','오유 테이블','sofa-table','living','https://store.ohou.se/goods/3385955','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-353078273626240.jpg?w=900&q=80','오늘의집 상품 목록'],
['fp-tinto','flatpoint','틴토 미러','mirror','living','https://store.ohou.se/goods/3799147','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-504865702445056.png?w=900&q=80','S/M/L'],
['fp-arctic-soft','flatpoint','아틱 세라믹 소프트 테이블','dining-table','dining','https://store.ohou.se/goods/2802233','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-486845217271872.jpg?w=900&q=80','원형·타원 옵션'],
['fp-dob220','flatpoint','DOB 220','dining-table','dining','https://store.ohou.se/goods/2745944','','제품 상세에서 규격 확인'],
['fp-dob225','flatpoint','DOB 225','dining-table','dining','https://store.ohou.se/goods/2746769','','제품 상세에서 규격 확인'],
['fp-arden-m','flatpoint','아르덴 미러 M','mirror','living','https://store.ohou.se/goods/3385963','','제품 상세에서 규격 확인'],
['fp-mue','flatpoint','뮤 거실 소파테이블','sofa-table','living','https://store.ohou.se/goods/3675193','','제품 상세에서 규격 확인'],
['fp-fran','flatpoint','프란 라운지 체어','lounge-chair','living','https://store.ohou.se/goods/3668532','','제품 상세에서 규격 확인'],
['fp-dune','flatpoint','듄 거실 소파테이블','sofa-table','living','https://store.ohou.se/goods/3385960','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-353076151324736.jpg?w=900&q=80','오늘의집 상품 목록'],
['fp-goban','flatpoint','고반 소파 테이블','sofa-table','living','https://store.ohou.se/goods/3790997','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-428027834732672.jpg?w=900&q=80','오늘의집 상품 목록'],
['fp-hav','flatpoint','하브 세라믹 테이블','dining-table','dining','https://store.ohou.se/goods/2790159','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-455604112580672.jpg?w=900&q=80','원형·타원 옵션'],
['fp-cato','flatpoint','카토 펜던트 램프','lighting','living','https://store.ohou.se/goods/3721876','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-410761409794112.jpg?w=900&q=80','오늘의집 상품 목록'],
['fp-lato','flatpoint','라토 체어','chair','dining','https://store.ohou.se/goods/2798207','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-519417301336128.png?w=900&q=80','오늘의집 상품 목록'],
['fp-biblio','flatpoint','비블리오 쉘프','storage','living','https://store.ohou.se/goods/3668608','','제품 상세에서 규격 확인'],
['fp-dob125','flatpoint','DOB 125','dining-table','dining','https://store.ohou.se/goods/2749158','','제품 상세에서 규격 확인'],
['fp-arctic-round','flatpoint','아틱 세라믹 라운드 테이블','dining-table','dining','https://store.ohou.se/goods/2802241','','원형 옵션'],
['fp-arden-l','flatpoint','아르덴 미러 L','mirror','living','https://store.ohou.se/goods/3385961','','제품 상세에서 규격 확인'],
['fp-arden-s','flatpoint','아르덴 미러 S','mirror','living','https://store.ohou.se/goods/3385967','','제품 상세에서 규격 확인'],
// Moss Carpet — seating, tables, stools and storage
['moss-lhr-chair','mosscarpets','리히르 LHR-C-01 의자','chair','dining','https://store.ohou.se/goods/3111116','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-485399597322240.png?w=900&q=80','오늘의집 상품 목록'],
['moss-lhr-st01','mosscarpets','리히르 LHR-ST-01 소파테이블','sofa-table','living','https://store.ohou.se/goods/3112033','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-295027514589184.jpg?w=900&q=80','오늘의집 상품 목록'],
['moss-rotate','mosscarpets','콜드포그 Rotate Easy Chair','lounge-chair','living','https://store.ohou.se/goods/3113044','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-485413287755840.png?w=900&q=80','이지체어'],
['moss-lhr-st03','mosscarpets','리히르 LHR-ST-03 Ivory','sofa-table','living','https://store.ohou.se/goods/3405160','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-347053859582016.png?w=900&q=80','오늘의집 상품 목록'],
['moss-beam','mosscarpets','OTC Beam Table Color','dining-table','dining','https://store.ohou.se/goods/3493662','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-485417979109504.png?w=900&q=80','오늘의집 상품 목록'],
['moss-square','mosscarpets','콜드포그 Square Sofa Table','sofa-table','living','https://store.ohou.se/goods/3119060','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-296493481766976.png?w=900&q=80','벌우드'],
['moss-nemo','mosscarpets','콜드포그 Nemo Stool','stool','living','https://store.ohou.se/goods/3116457','','제품 상세에서 규격 확인'],
['moss-lhr-t03','mosscarpets','리히르 LHR-T-03 테이블','desk','living','https://store.ohou.se/goods/3111700','','책상·테이블'],
['moss-chair','mosscarpets','콜드포그 Chair','chair','dining','https://store.ohou.se/goods/3111733','','제품 상세에서 규격 확인'],
['moss-dubu','mosscarpets','콜드포그 Dubu Easy Chair','lounge-chair','living','https://store.ohou.se/goods/3116421','','Yellow Check 옵션'],
['moss-layered','mosscarpets','콜드포그 Layered Sofa','sofa','living','https://store.ohou.se/goods/4126779','','제품 상세에서 규격 확인'],
['moss-pook','mosscarpets','콜드포그 Pook Easy Chair','lounge-chair','living','https://store.ohou.se/goods/3493415','','제품 상세에서 규격 확인'],
['moss-magic-shelf','mosscarpets','매지컬 브루어리 V6-8675 Shelf','storage','living','https://store.ohou.se/goods/3405769','','제품 상세에서 규격 확인'],
['moss-lhr-stool','mosscarpets','리히르 LHR-S-01 스툴','stool','living','https://store.ohou.se/goods/3111268','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-485401117872192.png?w=900&q=80','오늘의집 상품 목록'],
['moss-nugu-blue','mosscarpets','콜드포그 Nugu Easy Chair · Blue Check','lounge-chair','living','https://store.ohou.se/goods/3112950','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-485414094471168.png?w=900&q=80','오늘의집 상품 목록'],
['moss-nugu-olive','mosscarpets','콜드포그 Nugu Easy Chair · Olive Stripe','lounge-chair','living','https://store.ohou.se/goods/3113001','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-295073499058176.jpg?w=900&q=80','오늘의집 상품 목록'],
['moss-round-tea','mosscarpets','콜드포그 Round Tea Table','sofa-table','living','https://store.ohou.se/goods/3116477','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-296141571891200.jpg?w=900&q=80','사이드 테이블 · 벌우드'],
['moss-slide-chair','mosscarpets','OTC Slide Chair','chair','dining','https://store.ohou.se/goods/3493518','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-485417314648064.png?w=900&q=80','오늘의집 상품 목록'],
['moss-jong-black','mosscarpets','길종주택 Sofa Table · Black','sofa-table','living','https://store.ohou.se/goods/3405763','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-347091119386752.png?w=900&q=80','오늘의집 상품 목록'],
['moss-net-table','mosscarpets','콜드포그 Net Table','dining-table','dining','https://store.ohou.se/goods/3116467','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-296136065388544.jpg?w=900&q=80','오늘의집 상품 목록'],
['moss-curved-chair','mosscarpets','콜드포그 Curved Easy Chair','lounge-chair','living','https://store.ohou.se/goods/3493498','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-364398867947584.png?w=900&q=80','오늘의집 상품 목록'],
['moss-dubu-blue','mosscarpets','콜드포그 Dubu Easy Chair · Blue Check','lounge-chair','living','https://store.ohou.se/goods/3116412','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-296125985726528.jpg?w=900&q=80','오늘의집 상품 목록'],
['moss-trolley','mosscarpets','콜드포그 Trolley','storage','living','https://store.ohou.se/goods/3116472','','제품 상세에서 규격 확인'],
['moss-tv-stand','mosscarpets','콜드포그 Black TV Stand','storage','living','https://store.ohou.se/goods/3405409','','거실장'],
// Rareraw — modular shelving and living/dining furniture
['rr-falls-mirror','rareraw','폴스 미러','mirror','living','https://store.ohou.se/goods/2812146','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-532853730799616.jpg?w=900&q=80','7 colors'],
['rr-home-helper','rareraw','홈 헬퍼','storage','living','https://store.ohou.se/goods/3956225','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-511616655499328.jpg?w=900&q=80','3 colors'],
['rr-system10','rareraw','시스템000 디스플레이 쉘빙 10','storage','living','https://store.ohou.se/goods/1431301','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-525432330633216.jpg?w=900&q=80','모듈 시스템'],
['rr-four','rareraw','포 스태킹 쉘프','storage','living','https://store.ohou.se/goods/1494940','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-512661197848704.jpg?w=900&q=80','스태킹 쉘프'],
['rr-four-set','rareraw','포 스태킹 쉘프 4단 SET','storage','living','https://store.ohou.se/goods/3370094','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-534613837201408.jpg?w=900&q=80','4단 구성'],
['rr-system04','rareraw','시스템000 디스플레이 쉘빙 04','storage','living','https://store.ohou.se/goods/1431202','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-525432944099456.jpg?w=900&q=80','모듈 시스템'],
['rr-sofa-table','rareraw','레어로우랙 소파 테이블','sofa-table','living','https://store.ohou.se/goods/1806830','','제품 상세에서 규격 확인'],
['rr-home-clean','rareraw','홈 클린','storage','living','https://store.ohou.se/goods/3809775','','4 colors'],
['rr-alter-chair','rareraw','알터 체어','chair','dining','https://store.ohou.se/goods/3243474','','8 colors'],
['rr-motion-desk','rareraw','레어로우워크 모션 데스크','desk','living','https://store.ohou.se/goods/2824822','','6 colors'],
['rr-system-standard02','rareraw','시스템000 스탠다드 쉘빙 02','storage','living','https://store.ohou.se/goods/1429839','','모듈 시스템'],
['rr-work-table','rareraw','레어로우워크 테이블','dining-table','dining','https://store.ohou.se/goods/2310819','','20 colors'],
['rr-creative-storage','rareraw','시스템000 크리에이티브 스토리지 02','storage','living','https://store.ohou.se/goods/1433626','','모듈 시스템'],
['rr-cylinder','rareraw','실린더 테이블','sofa-table','living','https://store.ohou.se/goods/1534008','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-343098373754944.jpg?w=900&q=80','오늘의집 상품 목록'],
['rr-cylinder-mini','rareraw','실린더 테이블 미니','sofa-table','living','https://store.ohou.se/goods/1534034','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-343098409082944.jpg?w=900&q=80','오늘의집 상품 목록'],
['rr-fleet','rareraw','플릿 테이블','dining-table','dining','https://store.ohou.se/goods/471226','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-343098294456448.jpg?w=900&q=80','4 colors'],
['rr-storage04','rareraw','시스템000 베이직 스토리지 04','storage','living','https://store.ohou.se/goods/1433617','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-525432655564800.jpg?w=900&q=80','모듈 시스템'],
['rr-work-stool','rareraw','레어로우워크 스툴','stool','living','https://store.ohou.se/goods/2317284','','6 colors'],
['rr-plant-rack','rareraw','레어로우랙 플랜트 랙','storage','living','https://store.ohou.se/goods/1806816','','제품 상세에서 규격 확인'],
['rr-grid-storage','rareraw','그리드 스토리지 Shelf Type','storage','living','https://store.ohou.se/goods/4150699','','5 colors'],
['rr-shoerack','rareraw','레어로우랙 신발장','storage','living','https://store.ohou.se/goods/1806805','','제품 상세에서 규격 확인'],
['rr-grid-3set','rareraw','그리드 스토리지 3칸 세트','storage','living','https://store.ohou.se/goods/4147391','','5 colors'],
['rr-grid-2set','rareraw','그리드 스토리지 2칸 세트','storage','living','https://store.ohou.se/goods/4147497','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-521594080968832.jpg?w=900&q=80','벽선반 · 5 colors'],
['rr-toms-curve','rareraw','탐스 소파 2.0 커브 세그먼트','sofa','living','https://store.ohou.se/goods/2830345','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-242915961790592.jpg?w=900&q=80','17 colors'],
['rr-rack-hanger','rareraw','레어로우랙 2단 행거 H2080','storage','living','https://store.ohou.se/goods/4097318','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-507141363597376.jpg?w=900&q=80','오늘의집 상품 목록'],
['rr-meeting-table','rareraw','워크 미팅 테이블','dining-table','dining','https://store.ohou.se/goods/2311423','','20 colors'],
['rr-toms-line','rareraw','탐스 소파 2.0 라인 세그먼트','sofa','living','https://store.ohou.se/goods/2830283','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-242913491615744.jpg?w=900&q=80','17 colors'],
['rr-dining-shelf','rareraw','시스템000 다이닝 쉘빙 01','storage','dining','https://store.ohou.se/goods/3560080','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-468432096391232.jpg?w=900&q=80','오늘의집 상품 목록'],
['rr-workstation','rareraw','레어로우랙 워크 스테이션','storage','living','https://store.ohou.se/goods/2596417','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-207579838779392.jpg?w=900&q=80','오늘의집 상품 목록'],
['rr-cylinder-bin','rareraw','스윙 빈','storage','living','https://store.ohou.se/goods/3373944','https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-340692145414208.jpg?w=900&q=80','수납 바스켓'],
['rr-compact-shelf','rareraw','시스템000 컴팩트 쉘빙','storage','living','https://store.ohou.se/goods/4123113','','제품 상세에서 규격 확인'],
// Alloso — official sofa range, current listings include fabric/leather material variants
['alloso-carpone-nordic','alloso','카포네 슬림 4인 · 노르딕 패브릭','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB242X1','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260929/_99035f49-a653-49e5-8692-2cb05c7de056_S500.png','공식몰 표시가 2,870,000원'],
['alloso-carpone-soft','alloso','카포네 슬림 4인 · 소프트 프리모 레더','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB242JN','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260929/_f7638b7a-6d6a-4eaf-b583-f9d647ef6c66_S500.png','공식몰 표시가 3,370,000원'],
['alloso-carpone-russo','alloso','카포네 슬림 4인 · 루소 패브릭','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB242R','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260929/_6e9e2ac8-15f4-400f-9a4c-1c6ad022c531_S500.png','공식몰 표시가 3,490,000원'],
['alloso-carpone-leather','alloso','카포네 슬림 4인 · 르아테 레더','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB242GN','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260930/_734dfc3d-564e-4730-980a-901e08eaf118_S500.png','공식몰 표시가 4,590,000원'],
['alloso-carpone-dreaming','alloso','카포네 슬림 4인 · 드리밍 헤비 레더','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB242BN','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260929/_60a51bee-ca68-4621-b748-028be9337dd1_S500.png','공식몰 표시가 3,870,000원'],
['alloso-didim-family','alloso','디딤 패밀리 라운지','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB453K1','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260324/_e8cbdf4a-46d5-4309-a51d-9b23cafe8572_S500.png','공식몰 표시가 5,860,000원'],
['alloso-didim-4','alloso','디딤 4인 · 릴레이트 패브릭','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB452K1','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260324/_1c42b15d-2862-4c49-9dc0-3129a5b46410_S500.png','공식몰 표시가 5,680,000원'],
['alloso-didim-3','alloso','디딤 3인 · 릴레이트 패브릭','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB451K1','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260324/_9ab64095-3573-41cc-abcd-dda33e53acb5_S500.png','공식몰 표시가 3,990,000원'],
['alloso-didim-leather','alloso','디딤 4인 · 르아테 레더','sofa','living','https://www.alloso.co.kr/product/detail?productCd=ACSB452GN','https://cdn.alloso.co.kr/AllosoUpload/product/color/20260324/_3eeb6c42-4e0b-42f4-9513-2cb899d9df1e_S500.png','공식몰 표시가 7,050,000원'],
// DseDe — the exact curated product URL supplied by the user
['dese-ds266','dese','DS-266 SELECT ROYAL','sofa','living','https://interiorteacher.com/curated-collection/%EB%93%9C%EC%84%B8%EB%8D%B0-DS-266-SELECT-ROYAL-23961','','제품 옵션·규격은 원문에서 확인']
];
for(const [id,brand,name,category,room,url,image,spec] of sourced){
 const b=brands.find(x=>x.id===brand);
 products.push({id,brand,brandName:b.name,name,category,room,url,image:image||'',price:null,width:null,spec,detail:'디자인시선 큐레이션 후보입니다. 현재 판매 여부·가격·옵션·치수는 원문 상품 페이지에서 확인해 주세요.',tags:`${b.name} ${name} ${category}`,variants:[]});
}
