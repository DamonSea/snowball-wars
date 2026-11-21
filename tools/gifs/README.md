# GIF recorder

Records the README GIFs by playing scripted scenes in headless Chrome with real three.js (software WebGL).

Needs Python, Playwright, Google Chrome, ffmpeg and a copy of three.js r128 (`build/three.min.js`):

```
THREE_JS=/path/to/three.min.js python3 tools/gifs/scenes.py            # all scenes
THREE_JS=/path/to/three.min.js python3 tools/gifs/scenes.py climb      # one scene
```

GIFs are written to `docs/media/`. Each scene in `scenes.py` runs a small script once per game step
(`__run`), and one GIF frame is captured every 4 steps (15 fps). `common.js` sets up the recording
(closer camera, hidden hints); `lineup.js` stages the character and enemy lineup stills.
