# Changelog

All notable changes to Snowball Wars (formerly Orb Run, then briefly Frosty Falls).
Versions before 2.1.0 were numbered afterwards, when the project moved to GitHub; their dates weren't recorded.

## [2.10.1] - 2026-11-21 — Slides in the Map Builder, stuck fixes
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
