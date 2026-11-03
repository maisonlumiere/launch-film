// soundtrack.wav: Mixkit #1001 "I Do!" (EDM house, 128 BPM) from its 26.25 s beat, drop on beat 24 + a recorded CC0 sound for every
// on-screen event, each placed so its measured peak lands on the event, then loudnorm to -14 LUFS.
//   node sound.mjs [--mux video.mp4]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const LIB = path.join(os.homedir(), '.claude/skills/sound-effects/sfx');
const B = 0.46875, NB = 64, DUR = NB * B, START = 26.25;
const S = {
  click: 'kit/click.ogg', tick: 'kit/tick.ogg', pop: 'kit/pop.ogg', popin: 'pop/fs-824189-pop-in-sfx.ogg', plop: 'pop/fs202230.ogg',
  goo: 'pop/fs-258269-mouth-pop.ogg', air: 'whoosh/fs393811.ogg', swoosh: 'whoosh/fs-169867-swoosh.ogg', swoosh2: 'transition/fs-786514-swoosh-v2.ogg',
  lift: 'whoosh/fs-264777-swoosh.ogg', whoosh: 'kit/whoosh.ogg', swipe: 'transition/fs-702773-swipe-wav.ogg', paper: 'transition/fs-850347-swipe-various.ogg',
  max: 'transition/kenney-interface-maximize-005.ogg', max2: 'transition/kenney-interface-maximize-006.ogg', scroll: 'transition/kenney-interface-scroll-001.ogg',
  roll: 'ui-blip/kenney-ui-rollover2.ogg', roll3: 'ui-blip/kenney-ui-rollover3.ogg', blip: 'ui-blip/kenney-digital-twotone1.ogg', blip2: 'ui-blip/kenney-digital-twotone2.ogg',
  pep: 'ui-blip/kenney-digital-pepsound2.ogg', three: 'ui-blip/kenney-digital-threetone1.ogg', pip: 'ding/fs-634690-lil-pip.ogg',
  ok: 'ding/kenney-interface-confirmation-001.ogg', ok2: 'ding/kenney-interface-confirmation-002.ogg', bell: 'ding/fs-571513-soft-notifications-bell-ding-d.ogg',
  select: 'click/kenney-interface-select-002.ogg', soft: 'impact/kenney-impact-impactsoft-heavy-000.ogg', impact: 'kit/impact.ogg', thud: 'impact/fs524817.ogg',
  riser: 'riser/fs-685256-riser-sound-effect-short-wav.ogg', reveal: 'typing/fs-511418-data-reveal-sound.ogg', typing: 'typing/fs-447909-keyboard-typing.ogg',
};
const ev = [
  [1, 'swoosh', -10], [3, 'popin', -7], [3.1, 'air', -13], [3.45, 'air', -13], [4, 'click', -5], [5.75, 'pop', -10], [6, 'click', -4], [6, 'blip', -13],
  [6.25, 'swoosh2', -10], [6.9, 'air', -13], ...Array.from({ length: 7 }, (_, j) => [7.3 + j * 0.2, 'tick', -17]), [9, 'click', -5], [9.02, 'pip', -9],
  [10, 'air', -10], ...Array.from({ length: 7 }, (_, j) => [10.2 + j * 0.16, 'tick', -18]), [11, 'click', -5], [11.02, 'pip', -9],
  [12, 'air', -10], ...Array.from({ length: 4 }, (_, j) => [12.2 + j * 0.2, 'tick', -16]), [13, 'click', -5], [13.02, 'pip', -9],
  [14, 'air', -10], [13.8, 'plop', -11], [13.98, 'plop', -12], [14.16, 'plop', -12], [14.5, 'select', -9], [14.6, 'swipe', -13], [15.45, 'soft', -7], [15.75, 'ok', -11],
  [16, 'swoosh2', -10], [17, 'paper', -12], [17.5, 'paper', -12], [19, 'roll', -12], [20, 'pop', -11], [21, 'roll3', -15], [22, 'click', -4],
  [24, 'riser', -9, 'end'], [24, 'impact', -3], [24, 'whoosh', -8],
  ...[24, 24.22, 24.44, 24.66].map((b) => [b, 'plop', -9]), [25.85, 'goo', -9], [26.6, 'max2', -10], ...Array.from({ length: 4 }, (_, j) => [27 + j * 0.2, 'tick', -15]),
  [28, 'click', -4], [28.25, 'roll3', -13], [28.45, 'pop', -10], [28.75, 'select', -9], [29, 'scroll', -14], [30, 'pep', -12], [31, 'pep', -12],
  [32, 'lift', -9], [33, 'popin', -8], [34, 'max', -10], [35, 'soft', -13], [35.3, 'whoosh', -9],
  [36, 'air', -12], [36.5, 'air', -12], [37, 'air', -12], ...Array.from({ length: 4 }, (_, j) => [37.4 + j * 0.18, 'tick', -16]),
  [38, 'click', -5], [38.02, 'blip2', -13], [39, 'click', -5], [39.02, 'blip2', -13], [40, 'click', -5], [40.02, 'max', -10],
  [41, 'swipe', -11], [41.5, 'reveal', -12], [42, 'air', -12], [42, 'roll', -14], [42.5, 'pop', -10], [43, 'pop', -10], [43.5, 'pop', -10],
  [45, 'swoosh2', -9], [45.6, 'click', -5], [45.62, 'ok2', -11], [46, 'air', -12], [46.4, 'air', -12], [46.5, 'ok2', -11], [47.2, 'air', -14],
  [47.5, 'click', -5], [47.52, 'ok2', -11], [48.5, 'three', -12], [50.5, 'ok2', -11], [51.1, 'bell', -8], [51.75, 'pop', -9],
  [52.25, 'whoosh', -6], [52.25, 'thud', -7], [52.75, 'air', -11], [53.25, 'air', -11], [55, 'swoosh2', -8], [55.6, 'air', -12], [56, 'air', -12],
  [58, 'click', -4], [58.1, 'pop', -9], [60, 'air', -13], [60.55, 'popin', -8], [61.2, 'swoosh', -9],
];

// measured peak of every sound we use
const peaks = {};
for (const k of new Set(ev.map((e) => e[1]))) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', path.join(LIB, S[k]), '-ac', '1', '-ar', '44100', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  const f = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4);
  let mi = 0; for (let i = 1; i < f.length; i++) if (Math.abs(f[i]) > Math.abs(f[mi])) mi = i;
  peaks[k] = { at: mi / 44100, len: f.length / 44100 };
}

const args = ['-v', 'error', '-y', '-ss', String(START), '-t', String(DUR), '-i', 'assets/song-1001.mp3'];
let fc = `[0]afade=t=in:d=0.02,afade=t=out:st=${(DUR - 0.35).toFixed(3)}:d=0.35,volume=-3dB[m];`;
const typing = [4.25 * B, 0.78];               // the command is typed over 1.5 beats
args.push('-i', path.join(LIB, S.typing));
fc += `[1]atrim=0.3:${0.3 + typing[1]},asetpts=PTS-STARTPTS,afade=t=out:st=${typing[1] - 0.08}:d=0.08,aresample=44100,adelay=${Math.round(typing[0] * 1000)}|${Math.round(typing[0] * 1000)},volume=-11dB[ty];`;
const labels = ['[m]', '[ty]'];
ev.forEach(([b, k, g, anchor], i) => {
  const p = peaks[k], at = anchor === 'end' ? p.len : p.at;
  const ms = Math.max(0, Math.round((b * B - at) * 1000));
  args.push('-i', path.join(LIB, S[k]));
  fc += `[${i + 2}]aresample=44100,adelay=${ms}|${ms},volume=${g}dB[s${i}];`;
  labels.push(`[s${i}]`);
});
fc += `${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[out]`;
args.push('-filter_complex', fc, '-map', '[out]', '-ar', '44100', '-ac', '2', 'soundtrack.wav');
let r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`soundtrack.wav: ${ev.length + 1} cues over ${DUR.toFixed(2)} s`);
fs.writeFileSync('cues.json', JSON.stringify(ev.map(([b, k, g]) => ({ beat: b, time: +(b * B).toFixed(3), sound: S[k], gainDb: g })), null, 1));
