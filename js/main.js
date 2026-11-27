// Startup: apply the season, show the menu, start the loop and connect multiplayer.
applySeason();
// everything built by now (maps, characters) is permanent; shared pieces made on the fly are kept too
keepScene();keep(partGeo,orbGeo,ringGeo,sbGeo,sbMat,sbYellow,rollGeo,rollM,ysDropGeo,ysDropM,ysMarkGeo,snowGeo);
chars.forEach(c=>c.rig&&(c.rig.accA||[]).forEach(it=>it.g.traverse(m=>{KEEP.delete(m.geometry);KEEP.delete(m.material)})));
menu();tick();mpInit();commInit();
