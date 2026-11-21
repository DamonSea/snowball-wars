window.__lineup=(items)=>{__go(2,0);__at(0,16,Math.PI,0,10);setCpu(false);P.scale.set(.001,.001,.001);
  T.camera.height=1.9;T.camera.back=5.6;const objs=[];
  items.forEach(([make,x],i)=>{const o=make();o.g.position.set(P.position.x+x,0,P.position.z-.6);o.g.rotation.y=o.ry||0;objs.push(o)});
  __step(60);return objs.length};
