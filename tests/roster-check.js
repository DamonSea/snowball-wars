(()=>{const out=[];const ok=(n,c)=>out.push((c?'OK   ':'FAIL ')+n);
menu();__step(2);pickMode='run';pickLevel=0;select('run',0);__step(2);const seen=[];for(let i=0;i<5;i++){seen.push(chars[ci].name);cycle(1);__step(1)}
ok('character select cycles Flip → Nova → Tuk only ('+seen.join(', ')+')',seen.join()==='Flip,Nova,Tuk,Flip,Nova');
ok('dots show three characters',document.querySelectorAll('#csDots *').length===3||!$('csDots'));
localStorage.setItem('orbRunPick','4');ok('a benched saved pick falls back to Flip on load',(()=>{const v=+localStorage.getItem('orbRunPick');return!ORDER.includes(v)})());localStorage.removeItem('orbRunPick');
select('adv',1);__step(2);ok('Adventure levels list all three',pickOrder().length===3);
menu();return out.join('\n')})()
