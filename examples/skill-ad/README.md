# Example: the launch-film ad

The 30-second film from the main README, made with this skill. It's a complete, editable film you can render yourself or copy from.

| File | What it is |
|---|---|
| `film.html` | The 16:9 film (1920x1080). Every frame is a pure function of time: `window.__seek(t)`. |
| `film-vertical.html` | The same film laid out for 9:16 (1080x1920). |
| `render.mjs` | Serves the folder locally and renders with Playwright: QA stills, a one-frame-per-beat sheet, or the full 60 fps video with 4 blended subframes. |
| `sound.mjs` | Mixes the song plus one recorded sound effect per event, each placed by its measured peak, normalised to -14 LUFS. |
| `cues.json` | Every sound cue: beat, time, file, gain. |
| `claims.md` | Every on-screen line and where it comes from. |

## Run it

```bash
npm install playwright-core
# the song isn't in the repo (Mixkit's license asks not to redistribute it), so download it
curl -L -o assets/song-1001.mp3 https://assets.mixkit.co/music/1001/1001.mp3

node render.mjs beats                       # qa/beats.jpg, one frame per beat
node render.mjs video --out video.mp4       # 16:9, 60 fps
node render.mjs video --page film-vertical.html --w 1080 --h 1920 --out video-vertical.mp4
node sound.mjs                              # soundtrack.wav
ffmpeg -i video.mp4 -i soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest launch-film.mp4
```

`sound.mjs` reads CC0 sound effects from `~/.claude/skills/sound-effects/sfx` (Kenney and Freesound recordings). Point `LIB` at any folder of your own CC0 sounds that uses the same file names.

## Timing

The song is "I Do!" by Michael Ramir C. (Mixkit #1001), at 128 BPM, used from 26.25 s, so its drop lands on beat 24, the moment the camera finishes zooming into the photo. Change `B` (seconds per beat) at the top of the film and `START` in `sound.mjs` to retime everything to another song.

Photos and Reel frames in `assets/` belong to Electric Emporium and Prachaar Prasaar. They're included so the example runs, not for reuse.
