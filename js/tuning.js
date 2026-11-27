// Tuning: every gameplay number in one place. Change feel here, not in the logic files.
// Heights a jump reaches = v*v / (2*gravity). With gravity 24: 9.5 -> 1.88, 11.2 -> 2.61,
// 13.8 -> 3.97, 15 -> 4.69. A ledge is climbable when its top is within 0.5 of your height.
const T={
  gravity:24,
  stepUp:.5,              // how far above your feet a surface can be and still be stepped onto
  footMargin:.15,         // how far past a platform edge you can still stand
  wallMargin:.35,         // how close to a wall your centre can get
  bodyH:1.7,bodyRadius:.55,         // push-out radius against trees, rocks, posts
  fallDeath:-2.5,         // below this height you've fallen in the water (Adventure)

  speed:{adventure:8,trickPark:9},
  turnRate:14,            // Sunny/Rook facing turn speed
  walkAccel:12,           // Sunny/Rook velocity smoothing

  flip:{                  // Flip's momentum moveset
    topSpeedBoost:1.1, accel:16, decel:20, stopDecel:26,
    turnSlow:7, turnFast:14, fastAbove:8, sharpTurn:1.2,
    pivotBelow:4, pivotTurn:45,     // below this speed you turn on the spot (fast) and move straight where the stick points
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
  tricks:{'Butt Slide':150,'Slide Hop':100,'Double Jump':50,'Dive':75,'Long Jump':100,'Wall Jump':100,'Tree Leap':75,'Handstand':100,
          'Triple Jump':150,'Backflip':150,'Side Flip':150,'Side Somersault':150,'Smash':150,'Dive Bomb':200,'Tree-top Flip':250,'Dive Grab':100,
          'Snowman Down':150,'Direct Hit':200,'Ground Pound':100,'Pound Jump':150,'Ledge Climb':50,'Ledge Hop':75,'Hand Over Hand':200,'Bounce':50,'Super Bounce':200,'Snow Angel':100,'Bowled Over':200,'Giant Snowball':250,'Yellow Snow':25,'Stomp':150,'Yellow Snowball':300,'Pole Leap':75,'Pole-top Flip':250},
  run:{time:60,goldEvery:6,goldValue:300,goldBonusTime:5,groundOrb:100,orbsOnField:7,
       hazardSpeed:3.4,hazardSpeedUp:.035,hazardsFree:2,hazardsStart:3,hazardsMax:7,hazardEvery:15,smashRespawn:3.5},
  foes:{goonSight:16,goonKeep:9,goonSpeed:1.7,goonEvery:2.8,penguinSight:18,penguinCurious:9,penguinCall:9,penguinGrudge:25,penguinWalk:1.3,penguinWindup:.75,penguinSlide:1.5,penguinSlideSpeed:11,penguinDizzy:1.4,penguinRest:2.5,
        impSight:20,impSpeed:5.5,impHopEvery:.5,impHopTime:.3,impFlee:6.5,impFleeTime:4,impSteals:2,stompBounce:11},
  yellow:{tank:4,refill:30,rate:45,speed:4.2,lift:2.2,gravity:14,walk:2.2,finish:.45,sessionLife:40,maxSessions:6,maxMarks:350},
  pound:{minHeight:1.2,spin:.28,fall:30,recover:.3,radius:3.2,jumpVy:17},
  // ledge hang: grab when a ledge top passes your hands (min..max above your feet) while falling, facing it
  hang:{min:1.3,max:1.95,reach:.8,off:.42,drop:1.6,shimmy:2.4,climbTime:.5,hopTime:.24,hopVy:10,overHand:5},
  // butt slide: crouch on a slope. accel = how hard the slope pulls (scaled by its steepness); friction on the slope and
  // on flat ground; steer = sideways control; stop = speed where you get up on flat ground
  butt:{accel:30,friction:.3,flatFriction:1.7,steer:5,max:17,stop:1.4,hopVy:11,minTrick:5},
  bounce:{vy:17,poundVy:22},
  angel:{time:2.6,life:45},
  roll:{r0:.35,rMax:1.5,grow:.045,push:4.2,friction:.55,iceFriction:.2,bounce:.4,bowl:1.8},
  snow:{speed:20,lift:4,gravity:18,life:2.5,ammo:6,regen:0,orbAmmo:2,cooldown:.3,hitKnock:9,hitLift:5,stun:.9,snowmanRespawn:8,snowmanAmmo:2,dropLife:15,chargeTime:1,chargeStun:1.6,chargeKnock:1.3},   // hold Throw chargeTime s for a charged snowball: double damage, longer stun, harder knock;
  // snowmanAmmo: snowballs you get for knocking down a snowman (target or Winter Crew)
  // Snowball Wars: match length (s), hearts, points per hit / trick shot / KO bonus, KO respawn and blink time,
  // computer players when alone, snowball pickups, and a slow trickle (s per snowball)
  // Orb Race (a straight orb count): a snowball hit knocks up to `spillN` orbs loose; rival walking speed
  race:{spillN:2,botSpeed:5.4},
  // Tag: round length, the new It's count before it can tag, no-tag-back time, touch reach, computer players and
  // their chase / flee speeds, and how high they can hop after you
  tag:{time:120,count:1.5,noBack:2,reach:1.3,bots:3,hopMax:4.2},   // chase / flee speeds live in each personality (TAG_PERS in tag.js)
  wars:{time:180,hp:3,respawn:2.5,invuln:2.5,bots:3,packs:6,packSmall:2,packBig:4,regen:8},   // packs: snowball pickups on the map (small on the ground, big up high / mid-air)
  camera:{height:10.5,back:13,autoTurn:2.6}   // autoTurn: Free + auto's turn speed (rad/s) when running fully sideways
};
