// Runs once every level and map file has registered: picks the current Adventure level and Trick Park map.
let curL=levels[0],curIdx=0;
function useLevel(i){curIdx=i;curL=levels[i];({advW,plats,advCol,advHz,cores,flags,zones,goal}=curL)}
let runIdx=0;try{runIdx=+localStorage.getItem('orbRunMap')||0}catch(e){}if(!RUNMAPS[runIdx])runIdx=0;
runL=RUNMAPS[runIdx];
useLevel(0);
