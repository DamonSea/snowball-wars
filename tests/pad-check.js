(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
const gp={id:'DualSense Wireless Controller (054c)',mapping:'standard',connected:true,timestamp:1,buttons:Array.from({length:18},()=>({pressed:false,value:0})),axes:[0,0,0,0]};
navigator.getGamepads=()=>[gp];const tap=i=>{gp.buttons[i].pressed=true;gp.timestamp++;__step(1);gp.buttons[i].pressed=false;gp.timestamp++;__step(1)};
const X=0,O=1,TRI=3,L1=4,R1=5,UP=12,DN=13,LT=14,RT=15;
const inView=(el,box)=>{const a=el.getBoundingClientRect(),b=box.getBoundingClientRect();return a.top>=b.top-1&&a.bottom<=b.bottom+1};
menu();__step(3);ok('controller detected: prompts on',document.body.classList.contains('haspad'));
pickMode='run';pickLevel=0;$('cs').classList.remove('hide');state='select';ci=2;showChar();__step(2);
const badge=$('csCust').querySelector('.pk');ok('Customize shows the triangle prompt',badge&&badge.textContent==='△'&&getComputedStyle(badge).display!=='none');
ok('Play shows cross, Back shows circle',$('csGo').querySelector('.pk').textContent==='✕'&&$('csBack').querySelector('.pk').textContent==='○');
tap(TRI);__step(3);ok('triangle opens Customize',CUST.on);
tap(DN);ok('D-pad focuses a control in the panel',$('cust').contains(document.activeElement));
tap(R1);ok('R1 switches to Colors',CUST.tab==='color');
let allVis=true,moved=0,prev=null;const body=$('custBody');for(let i=0;i<14;i++){tap(DN);const a=document.activeElement;if(a!==prev)moved++;prev=a;if(body.contains(a)&&!inView(a,body))allVis=false}
ok('scrolling the Colors list keeps the focused swatch in view ('+moved+' moves, scrolled '+body.scrollTop+'px)',allVis&&body.scrollTop>0&&moved>8);
tap(RT);const sw=document.activeElement;tap(X);ok('cross picks the focused swatch',sw.dataset.p&&LOOKS[2].c[sw.dataset.p]===+sw.dataset.c);
ok('focus stays on that swatch after the redraw',document.activeElement&&document.activeElement.dataset.c===sw.dataset.c&&document.activeElement.dataset.p===sw.dataset.p);
tap(R1);tap(R1);tap(R1);tap(DN);tap(DN);const ab=document.activeElement;tap(X);ok('accessory picked with cross ('+(ab.textContent)+')',ab.dataset.s&&LOOKS[2].a[ab.dataset.s]===ab.dataset.a);
gp.axes[2]=1;const r0=CUST.rot;__step(10);gp.axes[2]=0;ok('right stick turns the character',CUST.rot>r0+.3);
tap(O);ok('circle closes back to select',!CUST.on&&state==='select');
// settings
openSet();__step(5);ok('settings hides the menu underneath',getComputedStyle($('cs')).visibility==='hidden');
const card=$('set').querySelector('.setcard');ok('opens scrolled to the top',card.scrollTop===0);
tap(R1);ok('R1 → Sound tab',setTab==='sound');let vis=true;for(let i=0;i<16;i++){tap(DN);const r=$('setList').querySelector(`[data-row="${setRow}"]`);if(!r||!inView(r,card))vis=false}
ok('every focused Sound row is fully visible while scrolling (scrolled '+card.scrollTop+'px)',vis&&card.scrollTop>0);
tap(R1);tap(R1);ok('wraps to Game',setTab==='game');
tap(O);ok('circle closes settings and the menu comes back',!setOpen&&getComputedStyle($('cs')).visibility!=='hidden');
// More maps panel
$('cs').classList.add('hide');openMapsPanel();__step(2);tap(DN);ok('More maps: D-pad focuses inside',$('maps').contains(document.activeElement));
const mb=$('mBack');ok('Back shows circle prompt',!!mb.querySelector('.pk'));tap(O);ok('circle goes back',!mapsOpen);
navigator.getGamepads=()=>[];__step(3);ok('unplugged: prompts hidden',!document.body.classList.contains('haspad'));
return out.join('\n')})()
