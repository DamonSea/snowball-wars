// Tuning: every gameplay number in one place. Change feel here, not in the logic files.
// Heights a jump reaches = v*v / (2*gravity). With gravity 24: 9.5 -> 1.88, 11.2 -> 2.61,
// 13.8 -> 3.97, 15 -> 4.69. A ledge is climbable when its top is within 0.5 of your height.
const T={
  gravity:24,
  stepUp:.5,              // how far above your feet a surface can be and still be stepped onto
  footMargin:.15,         // how far past a platform edge you can still stand
  wallMargin:.35,         // how close to a wall your centre can get
  bodyRadius:.55,         // push-out radius against trees, rocks, posts
  fallDeath:-2.5,         // below this height you've fallen in the water (Adventure)

  speed:{adventure:8,trickPark:9},
  turnRate:14,            // Sunny/Rook facing turn speed
  walkAccel:12,           // Sunny/Rook velocity smoothing

  flip:{                  // Flip's momentum moveset
    topSpeedBoost:1.1, accel:16, decel:20, stopDecel:26,
    turnSlow:7, turnFast:14, fastAbove:8, sharpTurn:1.2,
    jumps:[0,9.5,11.2,13.8],        // single, double, triple jump launch speeds
    chainWindow:.27, chainMinSpeed:5,
    jumpCut:.5, jumpCutAbove:2,     // tap-jump: upward speed is halved on release
    skid:{angle:2.3,minSpeed:6,time:.32,decel:42,exitSpeed:1.5},
    sideFlip:{vy:13.5,speed:3.5},
    crouch:{decay:2.5,crawlSpeed:2.6,accel:10,turnCrawl:9,turnSlide:3},
    longJump:{minSpeed:3.5,vy:8.2,speed:16,landKeep:.5},
    backflip:{vy:15,speed:-3},
    dive:{minVy:3.5,speed:12.5,slideTime:.5,slideDecay:2.5},
    wallJump:{vy:11,speed:6.5,lock:.3,contact:.14,slideFall:-3},
    air:{turn:3.5,accel:8},
    knockTime:.35
  },
  ice:{speedBoost:1.3,push:5,coast:1.3,bounce:.35,bounceSound:4},
  climb:{speed:3.4,circle:2.4,leap:{vy:10,speed:6},topFlipVy:13.5,grabDelay:.15,regrabCooldown:.35},
  attacks:{1:{dur:.26,reach:.95,r:.9},2:{dur:.26,reach:.95,r:.9},3:{dur:.44,reach:1,r:1.35},sweep:{dur:.5,reach:0,r:1.75},air:{dur:.42,reach:.85,r:1.1}},

  combo:{window:1.4,orbExtend:.8},
  tricks:{'Double Jump':50,'Dive':75,'Long Jump':100,'Wall Jump':100,'Tree Leap':75,'Handstand':100,
          'Triple Jump':150,'Backflip':150,'Side Flip':150,'Smash':150,'Tree-top Flip':250,
          'Snowman Down':150,'Direct Hit':200,'Ground Pound':100,'Pole Leap':75,'Pole-top Flip':250},
  run:{time:60,goldEvery:6,goldValue:300,goldBonusTime:5,groundOrb:100,orbsOnField:7,
       hazardSpeed:3.4,hazardSpeedUp:.035,hazardsFree:2,hazardsStart:3,hazardsMax:7,hazardEvery:15,smashRespawn:3.5},
  pound:{minHeight:1.2,spin:.28,fall:30,recover:.3,radius:3.2},
  snow:{speed:20,lift:4,gravity:18,life:2.5,ammo:6,regen:0,orbAmmo:2,cooldown:.3,hitKnock:9,hitLift:5,stun:.9,snowmanRespawn:8},
  camera:{height:10.5,back:13}
};
