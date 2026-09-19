/* =========================================================
   Clarinet fingering data — extracted from fingering-diagram-v2.
   Exposes a global NOTES object (loaded via <script src="fingering-data.js">
   before the main script, so it works with plain <script> tags, no
   bundler/build step needed).
   ========================================================= */
const NOTES = {
  'E3':  [
    { code: 'T 123E|123',  keys: ['thumb','lh1','lh2','lh3','lhE','rh1','rh2','rh3'], label: 'use with RH-pinky or no-pinky fingerings' },
    { code: 'T 123|123E',  keys: ['thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhE'], label: 'use with LH-pinky or no-pinky fingerings' },
    { code: 'T 123E|123F', keys: ['thumb','lh1','lh2','lh3','lhE','rh1','rh2','rh3','rhF'], label: 'use before F3 or C5' },
  ],
  'F3':  [
    { code: 'T 123|123F', keys: ['thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhF'], label: 'use with LH-pinky fingerings' },
    { code: 'T 123F|123', keys: ['thumb','lh1','lh2','lh3','lhF','rh1','rh2','rh3'], label: 'use with RH-pinky fingerings' },
  ],
  'F#3': [
    { code: 'T 123F#|123',  keys: ['thumb','lh1','lh2','lh3','lhFSharp','rh1','rh2','rh3'], label: 'use with RH-pinky fingerings' },
    { code: 'T 123|123F#',  keys: ['thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhFSharp'], label: 'use with LH-pinky fingerings' },
    { code: 'T 123F#|123F', keys: ['thumb','lh1','lh2','lh3','lhFSharp','rh1','rh2','rh3','rhF'], label: 'use before F3 or C5' },
  ],
  'G3':  [ { code: 'T 123|123', keys: ['thumb','lh1','lh2','lh3','rh1','rh2','rh3'], label: 'basic' } ],
  'G#3': [ { code: 'T 123|123G#', keys: ['thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhGSharp'], label: 'basic' } ],
  'A3':  [ { code: 'T 123|12-', keys: ['thumb','lh1','lh2','lh3','rh1','rh2'], label: 'basic' } ],
  'Bb3': [ { code: 'T 123|1--', keys: ['thumb','lh1','lh2','lh3','rh1'], label: 'basic - confirmed as the only fingering in both the basic and alternate charts' } ],
  'B3':  [
    { code: 'T 123|-2-', keys: ['thumb','lh1','lh2','lh3','rh2'], label: 'basic' },
    { code: 'T 123|1-B-', keys: ['thumb','lh1','lh2','lh3','rh1','bottomSliver'], label: 'chromatic, use with Bb3 or F4' },
  ],
  'C4':  [ { code: 'T 123|---', keys: ['thumb','lh1','lh2','lh3'], label: 'basic' } ],
  'C#4': [ { code: 'T 123C#|---', keys: ['thumb','lh1','lh2','lh3','lhCSharp'], label: 'basic' } ],
  'D4':  [ { code: 'T 12-|---', keys: ['thumb','lh1','lh2'], label: 'basic' } ],
  'Eb4': [
    { code: 'T 12-|4---',  keys: ['thumb','lh1','lh2','side4'], label: 'basic' },
    { code: 'T 12Eb-|---', keys: ['thumb','lh1','lh2','topSliver'], label: 'chromatic/trill, use with D4 and A5' },
    { code: 'T 1--|1--',   keys: ['thumb','lh1','rh1'], label: 'sharp - use with RH1 fingerings' },
  ],
  'E4':  [ { code: 'T 1--|---', keys: ['thumb','lh1'], label: 'basic' } ],
  'F4':  [ { code: 'T ---|---', keys: ['thumb'], label: 'basic' } ],
  'F#4': [
    { code: '1--|---',     keys: ['lh1'], label: 'basic (thumb off)' },
    { code: 'T ---|34---', keys: ['thumb','side3','side4'], label: 'chromatic, use with F4' },
  ],
  'G4':  [ { code: '---|---', keys: [], label: 'basic (open G - no keys at all)' } ],
  'G#4': [ { code: 'G#---|---', keys: ['throatAb'], label: 'basic' } ],
  'A4':  [ 
    { code: 'A---|---', keys: ['throatA'], label: 'basic' },
    { code: 'A-23|-23F', keys: ['throatA','lh2','lh3','rh2','rh3','rhF'], label: 'Resonant, makes it flatter' },
  ],
  'Bb4': [
    { code: 'R A---|---', keys: ['register','throatA'], label: 'basic' },
    { code: 'A---|2---',  keys: ['throatA','side2'], label: 'trill fingering with A4' },
  ],
  'B4':  [
    { code: 'RT 123E|123',  keys: ['register','thumb','lh1','lh2','lh3','lhE','rh1','rh2','rh3'], label: 'use with RH-pinky or no-pinky fingerings' },
    { code: 'RT 123|123E',  keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhE'], label: 'use with LH-pinky or no-pinky fingerings' },
    { code: 'RT 123E|123F', keys: ['register','thumb','lh1','lh2','lh3','lhE','rh1','rh2','rh3','rhF'], label: 'use before C5' },
  ],
  'C5':  [
    { code: 'RT 123|123F', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhF'], label: 'use with LH-pinky fingerings' },
    { code: 'RT 123F|123', keys: ['register','thumb','lh1','lh2','lh3','lhF','rh1','rh2','rh3'], label: 'use with RH-pinky fingerings' },
  ],
  'C#5': [
    { code: 'RT 123F#|123',  keys: ['register','thumb','lh1','lh2','lh3','lhFSharp','rh1','rh2','rh3'], label: 'use with RH-pinky fingerings' },
    { code: 'RT 123|123F#',  keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhFSharp'], label: 'use with LH-pinky fingerings' },
    { code: 'RT 123F#|123F', keys: ['register','thumb','lh1','lh2','lh3','lhFSharp','rh1','rh2','rh3','rhF'], label: 'use before C5 range repeats' },
  ],
  'D5':  [ { code: 'RT 123|123', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','rh3'], label: 'basic' } ],
  'Eb5': [ { code: 'RT 123|123G#', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','rh3','rhGSharp'], label: 'basic' } ],
  'E5':  [ { code: 'RT 123|12-', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2'], label: 'basic' } ],
  'F5':  [ { code: 'RT 123|1--', keys: ['register','thumb','lh1','lh2','lh3','rh1'], label: 'basic' } ],
  'F#5': [
    { code: 'RT 123|-2-', keys: ['register','thumb','lh1','lh2','lh3','rh2'], label: 'basic' },
    { code: 'RT 123|1-B-', keys: ['register','thumb','lh1','lh2','lh3','rh1','bottomSliver'], label: 'chromatic, use with Bb4 or F5' },
    { code: 'RT 123|--3', keys: ['register','thumb','lh1','lh2','lh3','rh3'], label: 'use with D5' },
  ],
  'G5':  [ { code: 'RT 123|---', keys: ['register','thumb','lh1','lh2','lh3'], label: 'basic' } ],
  'G#5': [
    { code: 'RT 123C#|---', keys: ['register','thumb','lh1','lh2','lh3','lhFSharp'], label: 'basic' },
    { code: 'RT 12-|12-',   keys: ['register','thumb','lh1','lh2','rh1','rh2'], label: 'use with fingerings involving the right hand fingers' },
  ],
  'A5':  [ { code: 'RT 12-|---', keys: ['register','thumb','lh1','lh2'], label: 'basic' } ],
  'Bb5': [
    { code: 'RT 12-|4---',  keys: ['register','thumb','lh1','lh2','side4'], label: 'basic' },
    { code: 'RT 12Eb-|---', keys: ['register','thumb','lh1','lh2','topSliver'], label: 'chromatic/trill, use with D4 and A5' },
    { code: 'RT 1--|1--',   keys: ['register','thumb','lh1','rh1'], label: 'use with fingerings involving RH1' },
    { code: 'RT 1--|-2-',   keys: ['register','thumb','lh1','rh2'], label: 'sharp - use for facility with fingerings involving RH2' },
  ],
  'B5':  [ { code: 'RT 1--|---', keys: ['register','thumb','lh1'], label: 'basic' } ],
  'C6':  [
    { code: 'RT ---|---', keys: ['register','thumb'], label: 'basic - confirmed directly in source (previously marked inferred; that caveat no longer applies)' },
    { code: 'RT --3|4123', keys: ['register','thumb','lh3','side4','rh1','rh2','rh3'], label: 'useful for pp attacks and upward skips from D5' },
    { code: 'RT ---|123', keys: ['register','thumb','rh1','rh2','rh3'], label: 'suitable for large interval skips (e.g. with D5) and pp' },
    { code: 'RT 12Eb-|34---', keys: ['register','thumb','lh1','lh2','topSliver','side3','side4'], label: 'slightly sharp - good for ff, useful with Bb5' },
  ],
  'C#6': [ { code: 'RT -23|12-', keys: ['register','thumb','lh2','lh3','rh1','rh2'], label: 'basic' } ],
  'D6':  [ { code: 'RT -23|1--G#', keys: ['register','thumb','lh2','lh3','rh1','rhGSharp'], label: 'basic' } ],
  'Eb6': [ { code: 'RT -23|1-B-G#', keys: ['register','thumb','lh2','lh3','rh1','bottomSliver','rhGSharp'], label: 'basic' } ],
  'E6':  [ { code: 'RT -23|---G#', keys: ['register','thumb','lh2','lh3','rhGSharp'], label: 'basic' } ],
  'F6':  [ { code: 'RT -23C#|---G#', keys: ['register','thumb','lh2','lh3','lhFSharp','rhGSharp'], label: 'basic' } ],
  'F#6': [ { code: 'RT -2-|---G#', keys: ['register','thumb','lh2','rhGSharp'], label: 'basic' } ],
  'G6':  [ { code: 'RT -2-|12-G#', keys: ['register','thumb','lh2','rh1','rh2','rhGSharp'], label: 'basic' } ],
  'G#6': [ { code: 'RT -23F#|1-3', keys: ['register','thumb','lh2','lh3','lhFSharp','rh1','rh3'],
    label: 'first-listed of several documented options - upper altissimo has no single "basic" fingering, this register is genuinely instrument/player-dependent' } ],
  'A6':  [ { code: 'RT -23|---F', keys: ['register','thumb','lh2','lh3','rhF'],
    label: 'first-listed of several documented options - see note above' } ],
  'Bb6': [ { code: 'RT G#-23C#|---G#', keys: ['register','thumb','leftSideGSharp','lh2','lh3','lhFSharp','rhGSharp'],
    label: 'first-listed of several documented options - see note above' } ],
  'B6':  [ { code: 'RT G#12-|12-', keys: ['register','thumb','leftSideGSharp','lh1','lh2','rh1','rh2'],
    label: 'first-listed of several documented options - see note above' } ],
  'C7':  [ { code: 'RT G#1--|1--F#', keys: ['register','thumb','leftSideGSharp','lh1','rh1','rhFSharp'],
    label: 'first-listed of several documented options - see note above' } ],
};
