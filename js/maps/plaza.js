// Trick Park map 1: Plaza. A skatepark built around lines: routes that chain one trick into the next.
// Heights and gaps come from the jump math in tuning.js (apex = v*v/48; a ledge works if its top is
// within 0.5 of the apex). Ground everywhere, so a missed line costs time, never a life.
//
//   The Tower (centre back): stairs -> Deck (2.2, anyone) -> Tier 2 (5.4, backflip / side flip /
//     triple) -> Crown (7.4, a jump). Crown -> Sky Deck (8.0) is an 8-unit long jump.
//   The Chimney (right): wall-jump shaft, exits onto the Sky Deck.
//   The Runway (left): elevated runway, then a 13.5-unit gap: long jump + late dive only.
//     Lands on the Perch, which hops onto the Tower. A tree beside the Perch lets anyone climb up.
//   Pillar Run (right front): four pillars stepping up 1 unit each, for precision hops.
//   Treehouse (left front): climb the big tree, handstand, tree-top flip onto the Crow's Nest.
//   Fountain + boulevard ledges (centre front): low hops for flow between lines.
{advW=runW;plats=[];advCol=[];
add(new THREE.CylinderGeometry(30.5,26,3,48),sandM,0,-1.6,0,runW);
add(new THREE.CylinderGeometry(28.5,28.5,.2,48),grassM,0,-.1,0,runW).castShadow=false;
plats.push({k:'c',x:0,z:0,r:28.5,top:0});
const conc=seas(mat(0xdccdb0),0xdde3e8),concDk=seas(mat(0xbfae8f),0xb7c0c8),pave=seas(mat(0xc9bfa9),0xe4e9ed),
      tealP=mat(0x2bb3a8),coralP=mat(0xff7a59),sunP=mat(0xffd84a),blueP=mat(0x4f8fe0),plumP=mat(0x9a5fc4),
      waterM=new THREE.MeshStandardMaterial({color:0x5ec8e6,roughness:.15,metalness:.1,transparent:true,opacity:.85}),
      ironM=mat(0x3a3f47,{roughness:.5,metalness:.3}),woodM=mat(0x8a5a35);
const box=(x,z,w,d,top,s,t)=>boxPlat(x,z,w,d,top,s,t);
// central paving circle, so the plaza reads as a place
add(new THREE.CylinderGeometry(7.5,7.5,.04,40),pave,0,.02,-1,runW).receiveShadow=true;

// ---- The Tower ----
box(0,-9.75,4,1.5,1.1,conc,tealP);                     // stairs
box(0,-15.75,10,10.5,2.2,conc,tealP);                  // Deck   x -5..5,  z -10.5..-21
box(0,-15.75,6,6.5,5.4,concDk,sunP);                   // Tier 2 x -3..3,  z -12.5..-19
box(0,-17.5,3,3,7.4,concDk,coralP);                    // Crown  x -1.5..1.5, z -16..-19
// crown flag
add(new THREE.CylinderGeometry(.05,.05,2.4,6),ironM,-1.2,8.6,-18.7,runW);
add(B(1,.6,.04),coralP,-.68,9.35,-18.7,runW);
// stripes on the tower faces for scale
for(let k=0;k<3;k++)add(B(6.02,.18,.02),tealP,0,3+k*.8,-12.49,runW);

// ---- The Chimney and the Sky Deck ----
box(11.25,-12,2.5,6,8,concDk,blueP);box(16.75,-12,2.5,6,8,concDk,blueP);   // gap x 12.5..15.5
[-1,1].forEach(s=>{for(let k=0;k<3;k++)add(B(.06,6.5,.18),mat(0x3f8a3c),14+s*1.47,4.4,-10+k*-1.9,runW)});
box(13.9,-19.5,9,6,8,concDk,blueP);                    // Sky Deck x 9.4..18.4, z -16.5..-22.5
for(let k=-3;k<=3;k++)add(B(.5,.5,.5),sunP,13.9+k*1.2,8.25,-22.2,runW);   // deck edge blocks (decor)

// ---- The Runway and the Perch ----
box(-13,1.5,4,12,2.2,conc,coralP);                     // Runway x -15..-11, z 7.5..-4.5
box(-13,8.25,3,1.5,1.1,conc,coralP);                   // stairs at the south end
for(let k=0;k<6;k++)add(B(.5,.03,.9),seas(mat(0xffffff),0xffffff),-13,2.22,6-k*2,runW);   // runway arrows (decor)
box(-11,-21,6,6,2.2,conc,coralP);                      // Perch  x -14..-8, z -18..-24 (13.5 gap)
tree(-15.6,-17.2,1,runW,advCol,0,1);                   // climb-up tree for Sunny and Rook

// ---- Pillar Run ----
const PIL=[[13,3,1.8],[15.3,5.3,2.8],[17.6,7.6,3.8],[19.9,9.9,4.8]];
PIL.forEach(([x,z,t],i)=>box(x,z,1.8,1.8,t,conc,[tealP,sunP,coralP,plumP][i]));

// ---- Treehouse ----
tree(-15,12,2,runW,advCol,0,0);                        // big tree, top at 8.1
box(-19.5,17,3,3,9.5,woodM,woodM);                     // Crow's Nest x -21..-18, z 15.5..18.5
for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])add(new THREE.CylinderGeometry(.08,.08,1.1,6),woodM,-19.5+a*1.35,10.05,17+b*1.35,runW);
add(B(3.1,.08,.08),woodM,-19.5,10.55,15.6,runW);add(B(.08,.08,3.1),woodM,-18.1,10.55,17,runW);

// ---- Fountain ----
{const fx=-7,fz=7;for(let k=0;k<8;k++){const a=k*PI/4,x=fx+Math.cos(a)*2.75,z=fz+Math.sin(a)*2.75;box(x,z,1.2,1.2,1,conc,tealP)}
 add(new THREE.CylinderGeometry(2.1,2.1,.6,28),waterM,fx,.3,fz,runW);
 add(new THREE.CylinderGeometry(1.1,1.25,2.6,16),conc,fx,1.3,fz,runW);add(new THREE.CylinderGeometry(1.3,1.1,.25,16),tealP,fx,2.58,fz,runW);
 plats.push({k:'c',x:fx,z:fz,r:1.15,top:2.6});
 add(new THREE.ConeGeometry(.35,1.1,10),waterM,fx,3.2,fz,runW);}

// ---- Boulevard ledges (spawn -> tower) and lamps ----
[[-3.6,-4.5],[3.6,-4.5]].forEach(([x,z])=>box(x,z,1,4.5,.7,conc,sunP));
[[-5.5,-8],[5.5,-8],[-6,3],[6,3]].forEach(([x,z])=>{add(new THREE.CylinderGeometry(.09,.13,4,8),ironM,x,2,z,runW);
  add(new THREE.SphereGeometry(.28,12,8),new THREE.MeshStandardMaterial({color:0xffe2a8,emissive:0xffc46b,emissiveIntensity:1.2}),x,4.1,z,runW);advCol.push({x,z,r:.3})});

// rim trees and rocks (solid)
for(let a=0;a<PI*2;a+=PI/9){const x=Math.cos(a)*25.5,z=Math.sin(a)*25.5;if(!plats.some(p=>p.top>.5&&inside(p,x,z,2.5)))tree(x,z,.9+((a*7)%.4),runW,advCol,0,Math.round(a*3))}
[[21,-6],[-6,21],[5,-24]].forEach(([x,z],i)=>rock(x,z,.6+i*.1,runW,advCol));

// Named gaps: take off from one region, land in another without touching the ground in between.
// Regions are boxes at a surface height y. Points go into the combo.
const R=(x,z,w,d,y)=>({x,z,w,d,y});
const DECK=R(0,-15.75,10,10.5,2.2),TIER=R(0,-15.75,6,6.5,5.4),CROWN=R(0,-17.5,3,3,7.4),SKY=R(13.9,-19.5,9,6,8),
      RUNWAY=R(-13,1.5,4,12,2.2),PERCH=R(-11,-21,6,6,2.2),NEST=R(-19.5,17,3,3,9.5),TREETOP=R(-15,12,2.4,2.4,8.1),
      CHIMNEY=R(14,-12,3,6,0),WALLS=[R(11.25,-12,2.5,6,8),R(16.75,-12,2.5,6,8)],GROUND=R(0,0,60,60,0),
      RING=R(-7,7,7,7,1),SPOUT=R(-7,7,2.3,2.3,2.6),P=PIL.map(([x,z,t])=>R(x,z,1.8,1.8,t));
const gaps=[
  {name:'Crown Transfer',pts:400,from:[CROWN],to:[SKY]},
  {name:'Return Flight',pts:400,from:[SKY],to:[CROWN]},
  {name:'Runway Leap',pts:450,from:[RUNWAY],to:[PERCH]},
  {name:'Perch Hop',pts:100,from:[PERCH],to:[DECK]},
  {name:'Tower Lift',pts:150,from:[DECK],to:[TIER]},
  {name:'Crown Hop',pts:100,from:[TIER],to:[CROWN]},
  {name:'Chimney Climb',pts:300,from:[CHIMNEY],to:[SKY,...WALLS]},
  {name:'Chimney Escape',pts:150,from:WALLS,to:[SKY]},
  {name:'Leap of Faith',pts:150,from:[SKY,CROWN],to:[GROUND]},
  {name:'Pillar Hop',pts:75,from:P.slice(0,3),to:P.slice(1)},
  {name:'Pillar Summit',pts:200,from:[P[2]],to:[P[3]]},
  {name:"Crow's Nest",pts:450,from:[TREETOP],to:[NEST]},
  {name:'Fountain Hop',pts:75,from:[RING],to:[SPOUT]}];
RUNMAPS.push({name:'Plaza',grp:runW,plats,advCol,spad:{x:0,z:5},key:'orbRunPlaza2',gaps,spots:[
  {x:-3,z:-12,y:2.2,v:150,any:1},{x:3.5,z:-18.5,y:2.2,v:150,any:1},{x:-13,z:3,y:2.2,v:150,any:1},{x:-13,z:-2.5,y:2.2,v:150,any:1},
  {x:-7,z:7,y:2.6,v:150,any:1},{x:-11,z:-22,y:2.2,v:200,any:1},{x:13,z:3,y:1.8,v:100,any:1},{x:-19.5,z:17,y:9.5,v:450,any:1},
  {x:2,z:-15,y:5.4,v:250},{x:0,z:-17.5,y:7.4,v:400},{x:14,z:-20,y:8,v:350},{x:11,z:-21,y:8,v:350},
  {x:14,z:-12,y:4.5,v:250,air:1},{x:14,z:-12,y:7.5,v:300,air:1},
  {x:-12.5,z:-8,y:3,v:250,air:1},{x:-12,z:-13,y:2.6,v:250,air:1},{x:5.5,z:-17.5,y:9,v:300,air:1},
  {x:17.6,z:7.6,y:3.8,v:200},{x:19.9,z:9.9,y:4.8,v:300}]});
}
