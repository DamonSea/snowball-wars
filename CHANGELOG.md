# Changelog

All notable changes to Snowball Wars (formerly Orb Run, then briefly Frosty Falls).
Versions before 2.1.0 were numbered afterwards, when the project moved to GitHub; their dates weren't recorded.

## [2.47.0] - 2026-11-26 — Character customization patch
### Changed
- **Flip is now Flipper, and Nova is now Parker.** Saved looks and outfits carry over.
- **Shared gear:** Flipper's scarf (new **Neck** slot), Parker's winter hat and snowboard, and the cape can be worn by
  either of them. On their owner they're the original models; on the other one they're built to fit. Picking
  **None** now really takes an item off, even one the character or outfit starts with (Flipper's scarf, Parker's hat
  and board, Super Flipper's cape). Parker's curls show with her hat off; a winter hat on Flipper replaces his cap.
- Super Flip is now Super Flipper.
### Added
- **Flaming head** (Head): your head is on fire. Flickering flames and rising embers, for everyone.
- **Goggles** switch for Flipper: On head / Off.
- **Hoodie** for every character: Regular fit or Oversized, in any color, over their outfit. The hood bounces and the
  drawstrings swing as you move; friends see it too.
### Removed
- Crown, Wings, Backpack, Jetpack and Mustache accessories, and the gold outfits (Golden Ace, Gold Rush, Gold Tooth,
  Golden Fleece). Saves that used them fall back to the nearest thing that still exists.

## [2.46.0] - 2026-11-26 — Mouse aiming
### Changed
- **Aiming with the mouse:** hold the left mouse button and Flip turns toward the cursor, so you spin the arc around
  just by moving the mouse. It turns his body, not his running direction, so you can run one way and throw another.
  A quick click throws straight at the cursor. Aiming with F still uses the walking keys until you move the mouse.
  Controllers are unchanged. Friends see you turned toward your aim.
### Fixed
- Clicks over the on-screen controls list (bottom left) didn't throw.

## [2.45.0] - 2026-11-25 — Eye switches
### Added
- **Eye whites** and **Eye shine** switches in Flip's Face tab (On / Off). With the whites off his pupils grow to fill
  the eye for solid cartoon eyes; with the shine off the little highlights go (on every eye style, beady included).

## [2.44.0] - 2026-11-25 — Body types and face switches
### Added
- **Body type** (Customize → Outfits, Flip): **Stout** is his usual build; **Slender** uses Nova's proportions: longer legs, a narrower, slightly taller torso and narrower shoulders. Works with every outfit (including Off Duty's shorts) and friends see it too.
### Changed
- **Face switches**: Nose, Freckles and Blush each get their own clear On / Off row in the Face tab.

## [2.43.0] - 2026-11-25 — Jacket polish
### Changed
- **Flip's bomber jacket, polished:** a shearling collar with small lapels folding down the chest; a zip track with a
  pull tab (instead of a flat bar); slanted slash pockets with fleece-trimmed welts (instead of boxes); a fitted,
  ribbed waistband; rounded shoulders on the sleeves; and a round pilot's patch with little wings on his left sleeve
  (not on the Super Flip suit).

 - 2026-11-25 — Plain shoes
### Added
- **Shoes: With soles / Plain** in Customize → Accessories (Flip): Plain takes off the flat soles under his boots and
  leaves just the rounded boots. Kept across outfits; friends see it; Reset look brings the soles back.

 - 2026-11-25 — Cap polish; take the cap off
### Changed
- **Flip's aviator cap, polished:** the goggle strap no longer crosses in front of the lenses; it runs round the sides
  and back (with a little buckle) and ends at the frames, and the lenses sit on the dome tilted to its surface. A
  fleece lining rolls out at the edge, a seam with a button runs over the top (instead of the flat bar), and the ear
  flaps are rounded, fleece-lined, with snaps.
### Added
- **Aviator cap On / Off** in Customize → Accessories (Flip): take it off to show his hair with the goggles pushed up
  on it, or put it on with outfits that don't come with it. Kept across outfit changes; Reset look restores the
  outfit's choice; friends see it.

 - 2026-11-25 — Name on character select; pickups you can see
### Changed
- **"Your name" moved to the character select screen** (Trick Park only; Adventure is single-player). The first time,
  the cursor starts in it; Enter goes to Play. Typing there doesn't change character.
- **Snowball pickups stand out on the snow** (Snowball Wars packs and snowman drops): glowing blue snowballs in a
  bigger bundle, a bold blue ring that pulses, and a short blue beam.

 - 2026-11-25 — Wind
### Added
- **Trees sway in the wind:** their branches (and the snow on them) move gently, more toward the top, each tree a
  little out of step with its neighbours. It's done in the vertex shader, so it costs next to nothing. Off on Low
  graphics (and when Auto has dropped to its lowest setting). The giant Christmas tree stays still so its baubles
  don't float off it.

 - 2026-11-25 — Face options for Flip
### Added
- **Face tab in Customize** (Flip): the camera zooms in on his face while you pick.
  - **Eyes:** Round (the original), Relaxed (half-lidded), Focused (determined), Happy (closed arcs), Chill (flat
    lines), Beady (small dark ovals). Round, Relaxed, Focused and Beady blink.
  - **Eyebrows:** None (the original), Soft, Bold, Raised, Worried, in his hair color.
  - **Mouth:** Smile (the original), Calm, Grin, Smirk, Flat, Oh, None.
  - **Show:** switch his nose, freckles and blush off (or back on).
  Choices are saved with your look, survive outfit changes, reset with Reset look, and friends see them. Q / E and
  L1 / R1 cycle through the tab; characters without face options skip it.

 - 2026-11-25 — Fringe and hair color
### Changed
- Flip's fringe falls straight down over his forehead (fanning out a little, stopping above the brows) instead of being
  swept to one side.
### Added
- **Hair color in Customize** (Flip, Colors tab): its own palette of natural shades (gingers, blondes, browns, black,
  grey, white) plus a few bold ones. The darker locks follow a shade darker. Friends see it; ↺ resets to ginger.

 - 2026-11-25 — Hair physics
### Added
- **Flip's hair reacts to movement** (Off Duty, Super Flip): each of its 28 locks hangs from a pivot at its root on a
  damped spring. Speeding up flings the locks back, stopping throws them forward and they wobble back, running
  streams them back a little, jumping and landing bounce them, falling lifts them, and they sway gently at rest.
  Friends' Flips sway and stream too. Nothing runs when the hair is hidden under his cap.

 - 2026-11-25 — Back to the chunky locks
### Changed
- Flip's hair is the tousled chunky-lock mop again (two shades of ginger, fuller at the back, fringe swept to his
  left, a few locks sticking up), instead of the one-piece mop.
- Off Duty's goggles sit higher, on top of the locks.

 - 2026-11-25 — Flip's new hair; Off Duty
### Changed
- **Flip's hair, rebuilt** (see 2.35.1 for the version that stuck).
- **Off Duty replaces Beach Day:** the stunt pilot on a summer day, in a short-sleeve linen pilot shirt (collar, chest
  pockets, wooden buttons, rolled cuffs), olive shorts and canvas sneakers with gum soles, with his goggles pushed up
  on his hair. Same slot in the list, so a saved choice carries over.
- Super Flip no longer shows the goggle strap.
### Fixed
- The ginger tufts that peeked out from under his winter cap are gone.

 - 2026-11-25 — Flip's summer and superhero outfits; snowmen drop snowballs
### Added
- **Beach Day** (Flip): a plain tee with short sleeves, cargo shorts, sneakers, shades and his own hair (no cap,
  goggles, scarf or gloves).
- **Super Flip** (Flip): blue suit, domino mask, gold-and-red chest emblem, gold belt, red boots and gloves, and a red
  cape that flows when he runs. Your own Back accessory replaces the cape; clear it and the cape comes back.
- Outfits can now show and hide pieces of the model (`show`, `hide`, `shorts` in `OUTFITS`, `rig.parts` in
  `buildChibi`), and come with an accessory (`acc`). Friends see the new outfits in multiplayer.
  Both are added at the end of the list, so saved outfit choices keep their numbers.
### Changed
- **Knocking down a snowman** (a target or a Winter Crew snowman) **drops a snowball pickup** where it stood instead
  of giving snowballs straight away: the same bobbing bundle as Snowball Wars, worth 2. Walk into it to grab it (if
  you have room); it blinks and disappears after 15 seconds.

 - 2026-11-25 — The aim arc knows what it will hit
### Changed
- **The aim arc stops at whatever the snowball would hit first:** walls, ledges, trees and the ground. The ring sits
  where it hits, flat on the ground or upright against a wall or tree.
- **Red when a target is in its path:** a player, a computer rival, an enemy, a penguin or a snowman turns the dots
  red, with a bigger red ring at its feet. Red wins over the gold charged colour (a charged shot still pulses).
  The arc uses the same hit tests as a real snowball, so red means it will hit.
### Fixed
- **Snowballs (and the arc) flew through tree branches;** only the thin trunk counted. Trees now block snowballs with
  their real shape: trunk, then the two layers of branches.

 - 2026-11-23 — Switch 2 Pro Controller
### Added
- **Switch 2 Pro Controller support** (wired, in Chrome or Edge on a computer), from Controller Tester. Every button
  and both sticks land where the game expects them, so it plays exactly like a DualSense. Over USB the controller sends
  nothing until it's woken: the first time, a small button in the corner asks you to click it and pick the controller;
  after that it wakes by itself when the game loads or the controller is plugged in. Player light 1 turns on.
- **Rumble on the Switch 2 Pro** through its HD rumble (one optional click to allow it).
- **Nintendo button names on screen while you use it:** prompts, the Controls card, help text and rebinding show B / A /
  Y / X, L / R, ZL / ZR and + / − instead of ✕ / ○ / □ / △. Pick up a DualSense and they switch back.

## [2.32.0] - 2026-11-24 — Multiplayer on the GitHub copy
### Added
- **Peer-to-peer multiplayer outside claude.ai** (`js/net/p2p.js`): the GitHub Pages copy now has the same Trick Park
  multiplayer (avatars, names, shared orbs and spikeballs, Snowball Wars, Collectathon, Tag), with no server. Browsers
  meet through public Nostr relays via Trystero 0.25.2 (pinned, from esm.run) and then talk directly over WebRTC.
  It's a stand-in for claude.ai's room capability, so the game code is unchanged; on claude.ai nothing changes.
- Public lobby by default; `?room=name` in the link for a private group (shown on the title screen).
- Only changed parts of your state are sent (about 100 bytes an update); players who go silent for 20 s are dropped.
- Optional TURN relay setting (`P2P.turn`) for networks that block direct connections.
- `tests/p2p/p2p-check.py`: two game windows against a BroadcastChannel stand-in for Trystero (16 checks).

 - 2026-11-23 — Your name; solid snowmen
### Added
- **Name box on the Trick Park picker** ("Your name"): what friends see on your name tag and the scoreboards. It's
  saved on this device and used every time you join. The first time, the cursor starts in it; Enter or Esc goes back
  to the picker. Until you type one, your claude.ai name is used (or "Player"). A typed name beats a friend's account
  name on your screen too.
### Fixed
- **Snowmen could be walked through.** Standing snowmen are solid now, for you and for computer players; knocked down,
  you can walk through. Dives, belly slides, punches and snowballs still knock them over, and you can still land on top.

 - 2026-11-23 — Tap to taunt, hold for the wheel
### Changed
- **Tapping L1 (Q / right-click) on the ground now taunts straight away** instead of opening the wheel. The quick
  taunt is your last pick from the wheel (Wave to start; Snow Angel and Yellow Snow don't count), and it's remembered.
- **Holding it opens the wheel, with a visible indicator:** your quick taunt's icon appears with a gold ring that
  fills over 0.3 s; when it's full the wheel opens in its place. Point and let go to pick, or let go with nothing
  picked to close it. The tap-to-keep-open mode is gone.

 - 2026-11-23 — Aim arc and charged snowballs; easier tree grabs
### Added
- **Hold Throw to aim:** a dotted sky-blue arc shows exactly where the snowball will fly, with a ring where it lands.
  Turn to aim while holding. A quick tap still throws immediately.
- **Charged snowballs:** hold for 1 second and the arc turns gold; let go for a bigger, glowing snowball with double
  damage: 2 hearts in Snowball Wars, twice the orbs knocked loose in a Collectathon, and a longer stun (also on Tag
  and computer players). Friends see it charged and take the double damage too.
### Fixed
- **Jumping into a tree didn't always grab it** (some Plaza trees only worked with a dive): the grab reach sat right
  where the trunk stops your body, so a jump that bumped off a few centimetres short missed. It now reaches a little
  further, and in the air aiming roughly at the tree is enough. All 15 Plaza trees grab from a running jump.

 - 2026-11-23 — Collectathon and Change map
### Changed
- **Orb Race is now called Collectathon:** "How many orbs can you collect before time runs out?" (mode menu,
  scoreboard, pause menu, map picker, Settings → Collectathon rivals, the builder's map settings).
### Added
- **Change map** in the Trick Park pause menu: opens the map picker (Dev Maps / User Maps) over the paused game.
  Pick a map to go straight there with the same character; Back returns to the pause menu. Any game in progress ends.

 - 2026-11-23 — Simpler scoring
### Fixed
- **Two scoreboards at once with friends:** the friends' trick-points list showed on top of a game's scoreboard,
  and friends' rows on the game scoreboard showed their free-roam trick points. Now the trick-points list only
  shows in free roam (and only friends who are in free roam), and game boards use each game's own count.
- Friends' name tags show what they're doing: KOs in a match, orbs in an orb race, It time in Tag, trick points in
  free roam.
### Changed
- **No lives in free roam:** the Lives box is gone and getting hurt costs nothing. Lives still count in the orb race
  and a flag race; Snowball Wars has its hearts.
- **Orb Race is a straight count:** every orb is 1, the board shows an orb icon and each player's count, a hit knocks
  up to 2 orbs loose, and the map picker / title screen show your best orb count.
- **Snowball Wars has no points:** hearts and KOs; most KOs wins, hits break ties. Hits still pop up "Hit!",
  "Trick Shot!" or "KO!".
- Free roam's score box is now labelled **Tricks**.

 - 2026-11-23 — Emote wheel and dances
### Added
- **Emote wheel (every character):** standing on the ground, hold Ground pound (L1 / Q / right-click), point the
  stick, WASD or mouse at an emote and let go. A quick tap keeps the wheel open: pick with the stick and press Jump
  (✕) or Ground pound, click or tap one, or press 1-8. Esc or Crouch (○) closes it.
- **Dances:** Robot, Shuffle, Disco and Chicken Dance loop until you move, jump, attack or throw. Also **Wave** and
  **Cheer**. Friends see them in multiplayer (the pose is already synced).
- Snow Angel and Yellow Snow are on the wheel; slots that can't be used right now are dimmed with the reason
  (no snow, turned off in Settings, Nova, empty).
- Moves screen: a new Emotes page.
### Changed
- Ground pound on the ground no longer starts yellow snow (or Nova's snow angel) by itself; it opens the wheel.
  Crouch + Ground pound is still a quick snow angel, and Ground pound in the air is unchanged.
- Yellow snow from the wheel keeps spraying (walk and steer as before) until you press Ground pound again or run dry.
### Fixed
- The wheel closes on pause, menus, respawns and level changes.

 - 2026-11-23 — Dev Maps and User Maps
### Added
- **Trick Park picker tabs: Dev Maps and User Maps.** Switch with the tabs, Q/E (or Up/Down), or L1/R1.
- **Maps published from the builder now appear in User Maps** for everyone, credited "by <maker>", newest first,
  after the maps shipped with the game. Unpublishing removes them. Each is built once per published version.
### Changed
- Player maps merge only their plain top-level pieces, so animated parts (flags, snowmen) keep working.
- The publish message now points to Trick Park → User Maps.

 - 2026-11-23 — User Maps
### Added
- **User Maps:** player-made maps that ship with the game, at the end of the Trick Park picker, marked
  "User Map by <name>". The first is **Ben's Madness Map** by Ben: blocks, stairs, orbs and a forest of 335
  climbable lamp posts. Every mode works on it (orb run, Orb Race, Snowball Wars, Tag).
- `js/maps/user-maps.js`: add a map by pasting an exported `.snowmap.json` into `USER_MAPS`.
### Changed
- Builder lamps share one glow material, and User Maps merge their static meshes (the same merge the Christmas
  Village uses, now shared in `js/levels/engine.js`). Ben's map draws in 175 calls instead of 489.
- 26 exact duplicate items in Ben's map file (same thing, same spot) were removed; nothing visible changed.

 - 2026-11-23 — Tag bots that actually tag
### Fixed
- **A computer player who started a round of Tag as It could never tag anyone**, so the round stalled. Its
  "ready to tag" timer started unset and was read as "not yet" forever. In a simulated 100 seconds of bots-only
  Tag they now make about 20 tags (was 0-1).
- A stunned It (hit by a snowball) can no longer tag anyone until the stun wears off.
### Added
- **Tag personalities**, shown on each computer player's name tag:
  - **Sleet, the Hunter:** the fastest chaser; aims where you're going, not where you are; goes after whoever's
    winning (least time as It).
  - **Flurry, the Trickster:** zigzags and hops when running away; creeps up, then lunges.
  - **Drift, the Sneak:** runs away early, to the far side; as It it picks on you, stalking and then sprinting.
- `tests/comment_scan.py`: flags code accidentally hidden behind a `//` comment on the same line.

## [2.23.1] - 2026-11-23 — Village stars, Play menu
### Changed
- **Orb style has a new default, Auto:** each map picks its own style, so Christmas Village uses stars and every
  other map uses crystals. Choosing a specific style still applies it everywhere. (A saved "Crystal" from before,
  when it was the default, now counts as Auto.)
- The giant Christmas tree no longer has a star on top; the star orb that floats there does the job.
- The pause menu's **Games** is now **Play**.

## [2.23.0] - 2026-11-23 — Games menu, Moves screen, dive grab
### Changed
- **Pause menu decluttered:** Resume, **Games**, Moves, Settings, Quit. Games opens Orb Race, Snowball Wars and
  Tag, each with a one-line description, plus Back. ○ / Esc / Options on Games goes back to the pause menu.
- **The Moves screen is rebuilt like the map picker.** Five pages (Basics, Big Jumps, In the Air,
  Snowballs & Fighting, Game) you flip with ◀ ▶, ← →, L1 / R1 or the tabs. Each move is a card with its name, the
  buttons on your device (keyboard or PS5) and a one-line tip. When a move has two buttons they read "○ / R2".
- The title now reads "Flip's Moves" (or Nova's, or Tuk's).
### Added
- **Dive grab:** diving (or belly-sliding) into a tree or pole grabs it and starts the climb. It's a trick
  worth 100.

## [2.22.1] - 2026-11-23 — Snowball pickups
### Changed
- **Snowball Wars: snow piles are replaced by snowball pickups that work like orbs.** Glowing bundles of snowballs
  sit at the map's orb spots, including the high ones and the ones in mid-air. Ground bundles give 2; high and
  mid-air ones give 4, are bigger and have a light beam so you can spot them. Six are out at a time; grab one and
  another appears somewhere else. They stay put if you're already full. Each player has their own.
- The slow snowball trickle is now 1 every 8 seconds (was 3), so the pickups (and snowmen) are your real refill.

## [2.22.0] - 2026-11-23 — Tag, and friendly penguins
### Added
- **Tag**, a third Trick Park mode (PLAY pad or pause menu → Tag). A 2-minute round: whoever's It wears an "IT!"
  sign; touch someone to pass it on. No tag-backs for 2 seconds, and a new It counts for 1.5 seconds before they
  can tag. The scoreboard tracks each player's time as It, and least time wins. Snowballs stun whoever you hit.
  - Solo: Sleet, Flurry and Drift play. When It they chase and hop up low ledges after you (up to ~4 high, so the
    tallest rooftops are a real refuge); otherwise they run from the It.
  - With friends: players only, and starting a game pulls everyone on the map in; tags travel through presence.
### Changed
- **Penguins are friendly until you attack them.** Calm penguins waddle about, sometimes come over to look at
  you, never charge and are harmless to bump into. Hit one (punch, kick, snowball or stomp) and instead of going
  down it reels, gets angry (scowl and red cheeks), and squawks: penguins within 9 units join in. Angry penguins
  charge like before; a second hit takes one out. They calm down after 25 seconds.

## [2.21.2] - 2026-11-23 — Snowmen drop snowballs
### Added
- **Knocking down a snowman gives you 2 snowballs**, up to a full load. This works for the target snowmen in every
  park and the Winter Crew's snowman enemies, however you take them down: snowball, punch, kick, dive, slide,
  ground pound, stomp or a rolled giant snowball. Other enemies don't drop any. The amount is
  `T.snow.snowmanAmmo` in tuning.js.

## [2.21.1] - 2026-11-23 — Classic stick fix
### Fixed
- **With the Classic camera, the stick could walk you in the wrong direction** after you'd used the Free camera
  (introduced in 2.19.1). The input lock kept the Free camera's last angle, and Classic never reset it, so "up"
  could mean south-east. Each camera now has its own movement setup: **Classic** maps the stick straight to the
  world (Up is always north); **Free** is camera-relative with the input lock.
### Changed
- **Camera options are now just Classic and Free.** Behind you and Free + auto are parked: their code is kept but
  they're not in Settings. If you had one saved, you're moved to Free.

## [2.21.0] - 2026-11-23 — Christmas Village
### Added
- **Christmas Village**, a new Trick Park map built as one connected rooftop loop around a town square. Every jump
  is sized from the measured moveset: ordinary hops 4-6 apart, long-jump gaps 9.5 (too far for a running jump), an
  expert gap that needs a long jump *and* a dive, and heights chosen so each tier takes a specific move.
  - **Giant Tree:** climb it and Tree-top Flip onto the Clock Tower's bell deck.
  - **Clock Tower:** base deck (backflip / triple jump from the street, or from the rooftops), bell deck (backflip
    from the base), and a star pole on top to climb and flip off for the sky orb.
  - **Rooftop Row:** Gingerbread House and Toy Shop with pitched roofs. Run the ridges, hop between them, or
    butt-slide down a roof and hop off the eave.
  - **Santa's Workshop:** wall-jump up Chimney Alley (behind a giant wrapped present) or climb the candy cane and
    flip; double-jump onto the chimney; Sleigh Drop onto the Clock Tower.
  - **Sledding Hill:** snow terraces, a sled chute down into the square, and the Sky Sled: long jump + dive from
    the summit onto the rooftops.
  - **Frozen Pond:** skate it, or long-jump from the pier to the island (Ice Leap).
  - **Market stalls** whose awnings chain round the square, candy-cane lamp posts you can climb, a reindeer stable,
    snowmen, string lights and a sign on the workshop.
  - 13 named gaps for combos and 23 orb spots placed along the routes (worth more the harder they are to reach).
- **Sloped named-gap regions:** a gap can now land on a pitched roof (a height range instead of a single height).
### Notes
- The village merges its static decorations into one mesh per material, so it draws about as many objects
  as the other maps despite the extra detail.

## [2.20.0] - 2026-11-23 — Choose a mode
### Changed
- **The START pad is now the PLAY pad, and it asks which mode you want:** Orb Race or Snowball Wars (or Cancel),
  each with a one-line description. Pressing △ / Enter in free roam opens the same menu, and ○ / Esc / Options
  cancels. After cancelling, step off the pad and back on to open it again. If a map offers only one mode, it
  starts straight away.
- The pause menu's "Start game" is now **Orb Race**, next to **Snowball Wars**.
- The map builder calls it the PLAY pad too.

## [2.19.3] - 2026-11-23 — Free + auto camera rebuilt
### Changed
- **Free + auto now follows where you're moving, not where you face.** Run sideways and it turns with you; the more
  sideways, the faster it turns, so it settles behind you smoothly in about a second (was about 1.3 s, with a lazy
  drift). Run straight away from the camera and it holds still. Run toward it and, after a moment, it swings steadily
  round behind you. In the air it barely turns. It takes over 0.6 s after you stop using the right stick (was 1.4 s).
### Fixed
- **Side flips, wall jumps and other moves that flip your facing no longer yank the camera.** A side flip used to
  swing it about 125°.

## [2.19.2] - 2026-11-23 — Fewer pop-ups
### Changed
- **Removed the instruction banners** at the bottom of the screen: the free roam tip, "Get ready!", the Snowball
  Wars and Orb Race intros, the Adventure level intro and the map-tester tip. When a friend starts a match or race,
  a small toast tells you instead.
- **The banners that remain clear themselves after a few seconds.** These are end-of-run results and Adventure
  progress such as "Core found!" and what a door needs.

## [2.19.1] - 2026-11-23 — No more walking in circles
### Fixed
- **Pulling back with the Behind or Free + auto camera walked you in a circle.** You'd turn to face the camera, the
  camera would swing behind you, "back" would then point somewhere new, and you'd keep turning. Now a direction you
  hold keeps meaning the same way in the world until you let go, clearly change direction, or turn the camera
  yourself. Pulling back walks you straight back toward the camera, and the camera swings round behind you
  (faster than before when you've turned all the way around). The right stick still steers while you run.

## [2.19.0] - 2026-11-23 — Orb Race
### Added
- **The orb run is now a race.**
  - **With friends:** starting an orb run pulls everyone on the map into the same timed run, racing for the shared
    orbs. A live scoreboard shows everyone, and the end-of-run banner gives your place.
  - **Knock orbs loose:** a snowball hit during a run knocks up to 200 of your points loose as 100-point orbs that
    land around you, free for anyone to grab, including you. Knocked-loose orbs don't respawn once grabbed.
  - **Solo rivals:** Sleet and Flurry race you for the ground orbs (the high ones are yours) and throw snowballs
    to make you drop points. Hit them to make *them* drop. Settings → Game → **Orb run rivals**: 2 computer,
    1 computer, or Off for the classic solo run.

## [2.18.1] - 2026-11-23 — Knockouts fall flat
### Changed
- **Knockouts in Snowball Wars** no longer make people vanish. The knocked-out player turns to face the throw, gets
  knocked back and falls flat on their back with arms and legs splayed and dizzy stars over their face. They lie
  there for the knockout time, then disappear in a puff of snow and respawn somewhere else. Friends see your fall
  too, since it's part of your shared pose.

## [2.18.0] - 2026-11-23 — Snowball Wars mode
### Added
- **Snowball Wars**, a 3-minute free-for-all snowball fight in Trick Park (pause menu → Snowball Wars).
  - Everyone has 3 hearts. A hit scores 100; a **Trick Shot** (thrown mid-air or mid-trick) scores 200; the hit that
    takes someone's last heart adds a 250 KO bonus. Knocked-out players respawn elsewhere a few seconds later,
    blinking and safe for a moment.
  - **Snow piles** around the map refill your snowballs while you stand on them, plus a slow trickle.
  - Playing alone, three computer players join: **Sleet** (Nova), **Flurry** (Tuk) and **Drift** (Flip). They pick
    fights with each other too, and go after whoever hit them last.
  - With friends on the same map it's players only, and when one person starts a match everyone on that map joins.
  - A live scoreboard with hearts, a results screen (Play again / Keep playing), and a best score per map.
  - Orbs and enemies clear out for the match and come back afterwards. Hold △ / Enter restarts the match; the pause
    menu has Restart match and End match.
### Fixed
- Unreleased: an edit made the Settings computer player ignore its on/off switch. Caught by the tests before
  release.

## [2.17.0] - 2026-11-23 — Orb styles
### Added
- **Orb style** setting (Settings → Game): Crystal (the original, still the default), Donuts (pink icing with
  sprinkles), Stars, Snowflakes, Presents or Coins. Each has a gold version for bonus orbs: golden-glazed donuts,
  orange stars, gold snowflakes, gold presents and gold coins. Switching restyles the orbs already on the map, and
  your pick is remembered. It's cosmetic and only changes what you see, so friends can each pick their own.

## [2.16.2] - 2026-11-21 — Multiplayer fix
### Fixed
- **Friends on the same map couldn't see each other.** Each map used its own named room, and some viewers (such as
  people invited from outside your account) can be refused named rooms. The join failed silently and retried
  forever, so players showed up in the lobby ("Bob is in Plaza") but never met on the map. Map play now runs
  over the lobby everyone is already in, drawing only players on the same map.
- Tuk (and Vex) showed up looking like Flip to other players.
### Added
- If multiplayer hits an error, the menu's "Online now" line says so instead of failing silently.

## [2.16.1] - 2026-11-21 — Snappier turning
### Changed
- **Turning from a standstill or a walk** is now near-instant: your character spins round on the spot (about 4 frames
  for a full about-face) and walks straight where you point, instead of curving round in a little arc. At running
  speed you still lean into turns, and a hard reversal still skids (and sets up the side flip).
### Fixed
- **Attacks aim with the stick in every camera mode.** With the Behind, Free or Auto camera, the stick direction
  wasn't adjusted for the camera, so swings could go off at an angle.

## [2.16.0] - 2026-11-21 — Quality of life
### Added
- **Hold to respawn** (L3 on a controller, R on the keyboard): back to the spawn point, or to your last checkpoint in a
  flag race. A meter shows while you hold, so a tap does nothing.
- **Hold to restart** (△ / Enter): restarts the orb run (in place, with a fresh countdown), the flag race, or the
  Adventure level.
- **Moves** in the pause menu: the full move list for your character, scrollable with the controller.
- **Stop orb run** in the pause menu, plus **Restart orb run**.
### Changed
- When an orb run ends (time's up or out of lives) there's no results screen and no trip back to spawn: a banner shows
  your score, best combo and any new best, and you keep playing right where you are in free roam.
- The pause menu is now Resume, then that mode's actions, then Moves, Settings and Quit.

## [2.15.2] - 2026-11-21 — Unstuck from walls
### Fixed
- **Getting stuck against walls:** you're kept a small buffer away from walls, and any move inside that buffer was
  refused, even walking straight away. If something put you inside it (falling past a ledge, a knockback, jumping
  up beside a raised deck), you froze until something else moved you. Now a move is only refused if it goes deeper
  into a wall, so you can always walk out or slide along it.

## [2.15.1] - 2026-11-21 — Stuck-crouch hunting
### Fixed
- The controller is released while the game doesn't have focus (the browser can stop updating it and keep reporting
  the last buttons as held, which could leave Crouch stuck). A message says to click the game to keep playing.
### Added
- The stats overlay (` key) now shows what your character is doing (crouch, butt slide, ledge hang, climbing...)
  and exactly which key or controller button the game thinks is holding Crouch, plus map, position and camera.

## [2.15.0] - 2026-11-21 — The core three
### Changed
- The playable cast is now **Flip, Nova and Tuk**. Sunny, Rook and Vex are benched for now: their code stays in the
  game (one line in `characters.js` brings any of them back), but they're no longer offered. A saved pick of a benched
  character falls back to Flip.

## [2.14.0] - 2026-11-21 — Tuk
### Added
- **Tuk**, a new acrobat with Flip's full moveset: a yeti cub with big round eyes, rosy cheeks, buck teeth, little
  curved horns, huge paws and a hand-knit zigzag sweater and scarf. Floppy ears, head tuft and scarf tail on springs;
  his belly jiggles when he lands; idle, he catches snowflakes on his tongue. Five outfits (Cozy, Glacier, Berry,
  Midnight, and Golden Fleece after Sky Gauntlet), with every part paintable in Customize.

## [2.13.1] - 2026-11-21 — Vertical pause menu
### Changed
- The pause menu is one vertical column like the main menu: Resume, the mode's actions (Start game; in a flag race,
  Last checkpoint and Restart race), Settings, Quit to menu. Titled "Trick Park" (or the custom map's name), with no
  paragraph; flag races keep one line with the race time.

## [2.13.0] - 2026-11-21 — Simpler menus
### Changed
- **Main menu:** just the title and three buttons (Trick Park, Adventure, Map Builder) beside Flip; the intro
  paragraph and score list are gone.
- **Trick Park menu:** one map at a time, with a picture of the map, its name between ◀ ▶ arrows, and your best score.
  Click the picture or Play to go. Controller: ←→ flip maps, ✕ play, △ more maps, ○ back. Keyboard: arrows, Enter, Esc.

 - 2026-11-21 — Camera modes
### Added
- **Settings → Game → Camera:** Classic (the default, unchanged), Behind you (swings round to stay behind you as you
  run), Free (aim it with the right stick; up/down tilts) and Free + auto (like Free, but drifts back behind you when
  you leave it alone). In the turning modes, movement is camera-relative and the camera rises over walls instead of
  hiding behind them.
- Camera controls: right stick, or Z / X on the keyboard; R3 or V snaps the camera behind you. All rebindable.

 - 2026-11-21 — Map settings and the flag race
### Added
- **Map settings** in the Map Builder (shown when nothing is selected): Enemies on/off, Orb run on/off, Flag race on/off,
  with warnings when a needed piece is missing.
- **Spawn point**: where players appear, separate from the START pad (which now only starts the orb run). Older maps
  get a spawn point just in front of their START pad.
- **Flag race**: Checkpoint flags and a Finish flag (new Objectives group). The clock runs from the spawn point to the
  Finish flag; checkpoints turn green and become where you come back to when you run out of lives or pick
  **Last checkpoint** in the pause menu. Best times save per map.

 - 2026-11-21 — Slides in the Map Builder, stuck fixes
### Added
- Map Builder: **Slide** (a railed chute you can butt-slide down and walk under) and **Ramp** (a solid slope that
  launches you off the top). Both rotate four ways like Stairs.
- A safety net: if your character ever ends up overlapping something solid, the game nudges you out to open space
  (or onto the top if there's none nearby).
### Fixed
- **Stuck crouch on Mac:** keys pressed while Cmd was held (Cmd+C, the Cmd+Shift+4 screenshot shortcut) never sent a
  key-up, so C or Shift (Crouch) stayed held, even through menus. Cmd shortcuts are now ignored, and all keys release
  when Cmd is let go or the tab is hidden.
- **Stuck at the bottom of the slide:** crouch-walking into the chute's low lip started a butt slide, slid you off,
  and crawled you back on in a loop. A butt slide now only starts when heading downhill or sitting still on a slope.
- `tools/perf`: random-input stress tests (keyboard and simulated DualSense) that look for stuck states.

## [2.10.0] - 2026-11-20 — The Big Slide
### Added
- **The Big Slide** in the Plaza (front right): a 6-high tower with steps and a long railed chute back toward the middle.
- **Butt slide** for every character: hold Crouch on a slope to sit down and slide. The slope speeds you up, the stick
  steers, Jump hops off with your speed (Slide Hop), and letting go of Crouch stands you up. Butt Slide scores in combos.
- Ramps in the level engine: surfaces that rise along their length, with open space under the high end.
### Fixed
- Walking down a slope keeps you on the ground instead of hopping into the air every frame.

## [2.9.1] - 2026-11-20 — Controller-friendly menus
### Added
- Button prompts whenever a controller is connected: ✕ Play, △ Customize, ○ Back / Done, and L1 / R1 beside tabs.
- Full controller navigation in Customize and More maps: the D-pad moves to the nearest control, ✕ picks, ○ goes
  back, L1 / R1 switch tabs, and the right stick turns your character in Customize. Sliders change with ←→.
### Fixed
- Scrolling menus with a controller: the focused control now stays in view, settings open at the top instead of
  jumping to the bottom, and the menu behind Settings is hidden instead of showing through.

## [2.9.0] - 2026-11-20 — Performance
### Added
- **Settings → Game → Graphics: Auto / High / Balanced / Low.** Auto starts at 1.5x resolution and adjusts while you
  play: below ~50 fps it lowers resolution (then shadow detail) in steps, and raises it again when frames are smooth.
- **Performance stats** overlay (Settings → Game, or the ` key): fps, frame time, draw calls, triangles and GPU memory.
- `tools/perf`: scripts that measure every map and check for GPU memory build-up.
### Fixed
- GPU memory leaks: removed objects never freed their geometry and materials, so memory grew through a session.
  Enemy respawns, orbs, ground-pound rings, particles, snowballs, yellow snow, snow angels, multiplayer avatars,
  accessories and the Map Builder preview are now freed. In testing, 60 Map Builder edits used to leave ~3,800
  geometries on the GPU (now ~120: just the current map) and 20 enemy respawn cycles ~1,600 (now ~20: the live ones).

## [2.8.0] - 2026-11-20 — Make them yours
### Added
- **Customize** on character select for Flip, Nova and Vex: outfit presets, a color for every part, and accessories in
  three slots (head: crown, party hat, propeller cap, cat ears, halo; face: shades, round specs, mustache, clown nose;
  back: backpack, cape, jetpack, wings) with an accessory color. Accessories animate. Looks save per character and show
  in multiplayer.
- Pause camera: the view swings in front of your character, who faces you and waves beside the pause menu.
### Changed
- Settings are split into **Game**, **Sound** and **Controls** tabs (L1 / R1 switch tabs on a controller).
- Squash & stretch is now a slider from Default to Max instead of an on/off choice.
- The Music, Effects and Ambience sliders are stacked full width.
### Fixed
- The menu and character-select idle code never ran (a stray `else`), so the menu character now sways and waves
  every few seconds as intended.

## [2.7.0] - 2026-11-20 — Vex
### Added
- **Vex**, a new acrobat with Flip's full moveset: a mouthy skate punk with a pink mohawk, half-lidded side-eye, a
  smirk with a snaggletooth, a bandaged cheek, an oversized hoodie with glowing bolts, studded wristbands and high-tops.
  Five outfits (Street Punk, Toxic, Bubblegum, Blackout, and Gold Tooth after Sky Gauntlet).
- Spring physics for Vex's bandana tails, mohawk and wallet chain: they react to speeding up, stopping, turning and landing.
- Vex's idle: arms crossed, weight on one hip, and a bubble-gum bubble that pops.
- **Settings → Squash & stretch: Normal / Exaggerated**. Exaggerated springs the body around jumps, landings, attacks,
  ground pounds, dives, long jumps, crouches, skids, wall slides and snowball throws (every character, Sunny included).

## [2.6.0] - 2026-11-20 — Map Builder
### Added
- **Map Builder**: a top-down editor for your own Trick Park maps, with an asset library (blocks, walls, raised decks,
  monkey bars, stairs, tire stacks, ice, trampolines, poles, lamp posts, trees, rocks, orbs, snowman targets, rolling
  snowballs, START pad), an inspector for size, height and color, rotate, duplicate, delete, undo/redo and autosaved drafts.
- **Test play** straight from the editor; the pause menu offers Back to builder.
- **Publish**: in the claude.ai version, published maps appear under Trick Park → More maps for everyone.
  Authors (and the owner) can update or unpublish them; others can play them or edit a copy.
- **Export / Import** maps as `.snowmap.json` files.
- Trick Park menu: **More maps & builder**; main menu: **Map Builder**.
### Changed
- Multiplayer rooms are keyed by map, so friends on the same custom map play together.

## [2.5.1] - 2026-11-20
### Added
- **Settings** button in the pause menu.
### Fixed
- Ledge pull-up and ledge hop no longer snap up at the end (the camera jumped); you now rise and step onto the ledge smoothly.

## [2.5.0] - 2026-11-20 — Jungle Gym
### Added
- **Jungle Gym**, a fourth Trick Park map: one connected playground built so each structure hands you to the next.
  A two-level fort on posts you can run under, a tire run, a fireman pole, monkey bars to the East Tower, Pound Peak,
  trampolines up to the North Deck, a wall-jump canyon with a lookout, and a swing set. 12 named gaps.
- **Ledge hang**: grab a ledge as you fall past it facing it. Shimmy left/right (Hand Over Hand for 5 m), push toward
  it to pull up, Jump to hop up, crouch or push away to drop.
- **Pound Jump**: press Jump right as a ground pound lands to launch straight up (about three times a normal jump).
- **Trampolines** (Bounce), and a ground pound onto one for a **Super Bounce**.
- **Snow angels**: Crouch + Ground pound while standing in snow; leaves an angel imprint (Snow Angel).
- **Rolling snowballs**: push the small snowballs around Trick Park; they grow as they roll, bowl over enemies and
  snowmen (Bowled Over), reach Giant size, and can be stood on or smashed.
- Platforms can now have open space underneath (decks, bars, bridges), and you bonk your head on their undersides.
### Changed
- Nova no longer does yellow snow: her Ground pound on the ground makes a snow angel.
- Settings → Ledge hang: On / Off (next to Yellow snow: On / Off).

## [2.4.0] - 2026-11-20 — The winter crew
### Added
- New enemies replace the spikeballs in Trick Park and Adventure:
  - **Snow goons** waddle into range and lob snowballs (a hit stuns you); touching one costs a life.
  - **Penguin sliders** flap a red "!" warning, then belly-slide and bounce off walls; dizzy and harmless afterwards.
  - **Frost imps** hop after you and steal 2 snowballs; smack one before it escapes to get them back.
- **Stomp**: land on any of them from above to squash it and bounce (hold Jump for a bigger bounce).
- Each enemy bursts its own way (snow, feathers, ice). Adventure's patrol paths now carry penguins and imps.
- Multiplayer: the host runs the enemies and shares their states and the goons' snowballs.
- Settings → Enemies: **Winter crew / Spikeballs**. The original spikeballs are one click away.
### Fixed
- Penguins' white bellies were hidden inside their bodies.

## [2.3.0] - 2026-11-20
### Added
- **Nova**, a backcountry snowboarder with her own look (slouchy beanie, headphones, puffer, snowboard on her back) and five outfits. Same trick moveset as Flip.
- A glowing **flip arrow** on tree and pole tops shows exactly where your flip will go; left/right aim it.
- **Side somersault** replaces the skid side flip (the original tucked roll stays as Settings → Side flip style → Classic).
- **Yellow snow**: hold the Ground pound button while standing to spray a controllable yellow stream that marks the snow; your next snowball comes out yellow. Settings → Yellow snow turns it off.
- Punches, kicks, dives and belly slides smash snowmen.
### Changed
- Snowmen burst into snow instead of red sparks.
- The flip arrow follows your facing only (it no longer snaps to the stick or flickers).
### Removed
- Decorative blocks on Plaza's Sky Deck.

## [2.2.0] - 2026-11-20
### Added
- **Ground pound** (L1 / Q / right-click in the air): spin, drop, and a shockwave that smashes enemies and snowmen.
- **Custom controls**: rebind every action on keyboard & mouse and on a controller (Settings → Controls), two slots each.
- **Climbable poles**: lamp posts on all three maps and the antenna on top of the tallest Rooftops tower (Pole Leap, Pole-top Flip).

## [2.1.0] - 2026-11-20
### Changed
- Renamed to **Snowball Wars**, with an icy animated logo.
### Added
- Published on GitHub, with a playable GitHub Pages build.

## [2.0.0] - 2026-11-19 — Snowball fights
### Added
- **Snowball fights** in Trick Park: throw with F / R1 / touch, smash spikeballs, knock over snowman targets, hit friends.
- Getting hit knocks you back, stuns you (dizzy stars) and frosts your screen; hits on friends score **Direct Hit**.
- **Computer player** (Settings → Computer player) that wanders, throws back and can be stunned.
- Orbs refill snowballs (gold orbs fill you up).
### Changed
- Renamed from Orb Run to Frosty Falls (later Snowball Wars) with an icy title.

## [1.9.0]
### Changed
- **Plaza rebuilt** around intentional trick lines: tower and crown, runway, chimney, pillars, treehouse, fountain.
- 13 **named gaps** to discover (Tony Hawk style), saved per map.
- The code was split from one file into modules, with a central tuning file and a headless test harness.

## [1.8.0]
### Added
- **Multiplayer** for Trick Park: shared orbs and enemies, name tags, scores and trick callouts (Adventure stays single player).

## [1.7.0]
### Added
- **Rooftops**, a vertical city map built for wall jumps.
- **Tree climbing**, with a handstand at the top and a flip off it.

## [1.6.0]
### Added
- **Winter** look (snowfall, snowy trees, sleigh bells) with a Summer toggle.
- **Frozen Rink** map with real ice skating.

## [1.5.0]
### Changed
- Run mode rebuilt as **Trick Park**: combos, multipliers, high-value orbs and free roam with a START pad before the timed run.

## [1.4.0]
### Added
- Procedural **sound effects** with a per-move sound picker, plus music, ambience and rolling sounds.

## [1.3.0]
### Added
- **Flip** became the lead character, with alternate outfits (Golden Ace unlocks by beating Sky Gauntlet).
- Three-hit **attack combo**, crouch sweep kick and flying kick.
- **PS5 / standard controller** support.

## [1.2.0]
### Added
- Flip's Mario-style moveset: skid, crouch and crawl, dive, long jump, backflip, side flip, double and triple jump, wall jump.
- **Sky Gauntlet**, an Adventure level built around those moves.
- Pause menu (P) and an on-screen controls card.

## [1.1.0]
### Added
- **Adventure** mode with a level and an objective (Lighthouse Isles).
- Character select with Sunny the robot and Rook the explorer.

## [1.0.0]
### Added
- First playable demo: **Orb Run**, a 3D orb-collecting game in the browser.
