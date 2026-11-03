---
name: "launch-film"
description: "Make a beat-synced, one-continuous-take product or brand launch film for any brand, optionally matching a reference video or turning an article into a video. Asks brand, product, vibe and story first so every film looks different. Zero cost."
---

# Launch Film

A keynote-quality advert for Instagram Reels and other social formats: one continuous take, every scene made out of the previous one, something happening on every beat, a cursor driving every change, and a last frame that equals the first so the Reel loops seamlessly. Built as one HTML page rendered to MP4 with Playwright and ffmpeg.

The user is usually a business owner, marketer or agency making adverts for their own brands and for clients. Keep replies short.

## Hard rules
- Zero cost. Only free tools and assets: Mixkit music/SFX (free for commercial use), Pexels/Pixabay footage, Google Fonts / other free fonts, Playwright, ffmpeg, local Python/Node, local Ollama/Whisper if needed. Never use paid APIs, paid stock, Suno free-tier music (non-commercial) or anything needing credits. If something would cost money, stop and offer a free route.
- Honest claims only. Every spec, price, offer and claim on screen must come from the user, the client, or the brand's official page; list each in `claims.md` with its source. No fake reviews, invented prices, fake discounts or fake urgency.
- Use the user's or client's own photos and footage for products. Do not pull other brands' marketing images from the web.

## Step 0. Brand
Ask which brand this film is for. Brand profiles live in `brands/<slug>.json` in this skill's folder. If the profile exists, load it and confirm in one line. If not, create it by asking: brand name; one-word wordmark (a verb or short name works best, ending in a period, e.g. `launch.`); logo file (optional); 2-3 brand colours (hex) or 'pick for me'; preferred fonts or 'pick for me' (free fonts only); default language; end card details (CTA, WhatsApp/phone, location or handle); anything that must or must not appear.

Brand constants that stay the same in every film for that brand (the repetition is the signature): the opening wordmark squeezing into its own period and the loop back to it at the end, and the end card layout.

## Step 1. Intake (one round, sensible defaults so the user can just accept)
1. Product or subject: what it is, category, variants (colours, sizes, plans, flavours...), and a price only if real.
2. One-line message: the single thing a viewer should remember.
3. Vibe (pick one or describe your own):
   - Keynote Clean: warm off-white canvas, black UI, liquid glass, 118-124 BPM.
   - Night Premium: charcoal canvas, warm tones, slow springs, 100-110 BPM.
   - Festive: marigold, deep red and gold, punchy springs, 124-130 BPM.
   - Technical Pro: blueprint navy, white line art, amber accents, precise motion.
   - Desi Playful: bright flat colours, bouncy springs, Hinglish text, 120-128 BPM.
   - Editorial Bold: big condensed type, two-colour palette, magazine layouts, 110-120 BPM.
   - Brand-led: built from the brand profile's colours and fonts.
4. Story arc (pick one):
   - Journey: discover -> choose variant -> order/enquire -> on its way -> in use.
   - Problem -> Fix: the pain turns into the product solving it.
   - Compare: before vs after, or old vs new, with an honest sourced difference.
   - Feature tour: three features, each shown by one interaction.
   - Occasion: festival, season or launch (real offers only).
   - Brand story: who we are, what we do, proof, CTA (good for agency or service brands).
   - Explainer: turn a supplied article, post or notes into a short visual explanation (every fact from the source).
5. Signature mechanic: propose 3 interactions specific to this product and let the user pick. Examples: fan = speed dial spinning the blades; light = dimmer that relights a room; switch = toggle lighting a room; wire = flame-test bar or layer peel; food = slider that fills a plate; clothing = swatch that recolours the garment; service/agency = a feed that fills with posts, a graph that climbs, a calendar that books itself.
6. Language of on-screen text: English / Hinglish / Hindi (Devanagari: Noto Sans Devanagari or Mukta), or any language the user writes in.
7. Format and length: 9:16 1080x1920 (default), 1:1 1440x1440, 4:5 1080x1350 or 16:9 1920x1080; about 15 s or about 30 s.
8. Assets: folder with 9-12 photos, optional 3-8 s real footage of the product in use, logo. Song: the user's Mixkit pick, or suggest 3 Mixkit tracks matching vibe and BPM with a drop and a quiet breakdown.
9. Reference (optional): a video the user likes the look of, and/or an article or text to build from.
   - Reference video: sample one frame every 2 s (`ffmpeg -i ref.mp4 -vf fps=0.5 ref/%03d.png`), look at every frame, and write `reference.md`: palette, type style, layout grid, pacing (cuts or changes per second), transition types, camera moves. Use it as the style target for this film. Take the feel, never the content: do not copy its logos, characters, footage, exact layouts or text.
   - Article or text: read it in full first and build the story only from its facts; each on-screen fact goes into `claims.md` with the line it came from.
   Prompt order when working from long material: put the reference material (article, `reference.md`, frames) first, then the brief, style, tech constraints and done-criteria, and the request last.

## Quality benchmark
This skill grew out of a keynote-style launch film prompt by @twoclipping: a photo that travels through one continuous take (iris, bento grid, glass slider relight, glass orb, lock screen, product page, order pill, real wall footage, back to the wordmark). Hold every film to that bar.

Copy its craft:
- A new idea about every 2 s, with something moving on every beat.
- One consistent object travelling through the whole film (usually the hero photo).
- Real UI details (sliders, swatches, prices only if real, a progress pill) so it feels like a product, not an advert.
- One restrained palette; real footage only near the end, as the payoff; a seamless loop.

Fix what that format gets wrong:
- Weak muted open: a lone dot on a blank canvas for 2 s. Show the wordmark plus a hook line by 0.5 s.
- Square-only: default to vertical 1080x1920 and keep text clear of the Instagram UI zones.
- A borrowed stage (phone lock screen, laptop, browser): replace it with the product's own signature mechanic and the brand's real ordering route (WhatsApp, store visit, website).
- Tiny UI text: every on-screen word must be readable on a phone at full-screen size.

## Step 2. Variety check
Keep `history/<brand-slug>.json`. Within a brand, do not reuse the same vibe + arc + mechanic combination as any of the last 5 films, nor the same song or palette as the last 3. Across all brands, do not reuse the same song within 30 days. Rotate the transition vocabulary so consecutive films for a brand do not open the same way after the wordmark. If the user's choices collide, say so in one line and suggest the nearest alternative.

## Step 3. Beat map and stills (approval gate)
Measure BPM and downbeats (librosa or aubio). Write a beat map: beat, time, what happens. The camera zoom lands on the drop, the calm scene sits in the breakdown, the wordmark returns on the beat return. Something happens on every beat. Render 5 stills (0 s, 2 s, signature mechanic, story peak, end card) and show them with the beat map. The 0 s and 2 s stills are the muted-autoplay check: the hook must be clear from them alone. Wait for approval before writing the full film.

## Direction (all vibes)
- Muted-first. Most Reels autoplay without sound, so the first 2 s must read with the sound off: a clear visual hook and a short text line on screen by 0.5 s. Every key message in the film appears as on-screen text; nothing important lives only in the audio.
- Style discipline, set as CSS variables at the top of the film:
  - Exactly one distinctive display font plus one mono (or one secondary) font, both free. Never Inter, Roboto or Arial (or their look-alikes) as the display face. Devanagari text uses its own font as the secondary face.
  - Exactly one dominant colour (`--c-dom`) and one sharp accent (`--c-acc`), plus neutrals. Brand-led films take both from the brand profile.
- Staggered entrances: when several elements enter together, each starts 60-120 ms after the previous one (`t_j = t0 + j*delta`), so groups reveal in a deliberate cascade, never all at once and never scattered at random. The first element of a group lands on the beat.
- One continuous take. Every scene is made out of the previous one: nothing fades, blurs or cuts. Objects change shape instead.
- Transition vocabulary (rotate): text rising out of a mask line; icons popping from zero on a spring; bars drawing across; pages pushing; a shape flooding the frame and contracting into the next scene; a 6-blade iris closing and opening; goo/droplet merges; a pill that keeps morphing its label (e.g. Ordered -> Packed -> On its way -> Delivered).
- A cursor drives every change with real clicks, drags and long-presses. Screen-studio camera: zoom so each moment fills the frame; the cursor scales with it.
- Banned: crossfades, blur-ins, brightness developing, 3D flips, particles, glows, holds longer than 1 s, stock-template looks.
- Last frame = first frame.

## Build
1. One HTML file at the chosen resolution. Every style is computed from time inside an async `seek(t)` (exposed as `window.__seek`): no CSS transitions, no timers, no state between frames, and no unseeded randomness (use a seeded PRNG so every render is identical).
2. Springs are closed-form step responses. A value with many targets is the sum of one spring per change, so it stays a pure function of time.
3. Liquid glass (where the vibe uses it): each glass element holds its own clone of the scene behind it, filtered with an SVG feImage displacement map (rounded-rect distance field) through three feDisplacementMaps at slightly different scales for chromatic edges, plus a rim light. Glass letters: a canvas distance field per glyph gives map, mask and highlights. (A per-pixel canvas version of the same idea, with smooth-min goo, is in `examples/skill-ad/film.html`.)
4. Goo: blur + alpha threshold, then composite the source atop it so glass stays sharp inside (or smooth-min the distance fields).
5. Iris: 6 blades around a hexagonal aperture; each blade is its two vertices, both edge extensions and the SHORT arc between them.
6. Wordmark squeeze: every letter moves toward the dot by the same factor and its drawn width follows (narrow a variable font's wdth axis, e.g. Archivo, and scale the rest) so letters stay touching.
7. Footage: re-encode all-intra (`ffmpeg -g 1`), load as a blob URL, await `seeked` before drawing each frame.
8. Sound: a downloaded Mixkit or CC0 SFX for every event, never synthesized, each placed by its measured peak. Song starts on a downbeat. Loudnorm to -14 LUFS.
9. Render with Playwright: 4 subframes per frame blended (ffmpeg tmix or in-page accumulation), 60 fps, H.264 + AAC.
10. QA: check one frame per beat; scan for single-frame pops (frame-difference spikes 3x their neighbours, confirmed by PSNR against the neighbouring pairs); fix and re-render only the affected span.

## Done when
Improve by inspecting rendered screenshots, never by re-rolling the whole film. Take screenshots at 0 s, 2 s, 5 s, 10 s, every beat, and the last frame, and check each one:
- No overlaps: no text box overlaps another text box or the product, and nothing sits under the Instagram UI zones (top 220 px and bottom 380 px of a 1080x1920 frame; scale for other sizes). Check with element bounding boxes in Playwright, not by eye only.
- No bad wraps: no headline wraps unintentionally, no single word alone on a line, no clipped or cut-off text, in every language used.
- Muted test passes: the 0 s and 2 s frames explain the hook without sound.
- Claims: every on-screen claim is listed in `claims.md` with its source.
- Loop: the last frame matches the first.
Only deliver when all five pass; report any you could not fully meet.

## Gotchas
- `backdrop-filter: url()` misreads displacement maps in Chromium: clone the scene instead.
- A flood must overscale past the corners and take about 0.3 s, or half the screen changes in one frame.
- A child with `visibility: visible` shows through a hidden parent: use `inherit`.
- Text that swaps inside a morphing shape needs its own mask.
- `python -m http.server` cannot range-seek video: use the blob URL.
- Devanagari needs a font with full conjunct support; test the actual words in a still before building.
- When two drawing paths hand over (glass shape to solid shape), draw the outline identically in both, or it visibly snaps on the switch frame.
- On Windows, `new URL(import.meta.url).pathname` gives `/C:/...`; use `fileURLToPath`.

## Reusable engine
After the first approved film, save the generic parts (spring math, glass filter, goo, iris, wordmark squeeze, cursor + camera, footage loader, render and QA scripts) into `engine/` inside this skill's folder. Later films for any brand reuse `engine/` and only write new scenes. Improve the engine when a film needs something new. `examples/skill-ad/` is a complete working film to start from.

## Deliver
- `films/<brand-slug>/<date>-<product>/film.html` (editable), `soundtrack.wav`, `<product>-<vibe>-<WxH>.mp4`, `claims.md`.
- Append to `history/<brand-slug>.json`: date, product, vibe, arc, mechanic, palette, song, transitions used.
- Tell the user in 2-3 lines where the MP4 is and anything to check (claims, phone number, price).
