// Runs once every map file has registered: picks the current Trick Park map.
let runIdx=0;try{runIdx=+localStorage.getItem('orbRunMap')||0}catch(e){}if(!RUNMAPS[runIdx])runIdx=0;
runL=RUNMAPS[runIdx];({plats,advCol}=runL);
