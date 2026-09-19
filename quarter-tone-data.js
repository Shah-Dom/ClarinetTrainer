/* =========================================================
   QUARTER_TONES — one entry per quarter-tone between each pair
   of adjacent semitones from E3 to G6 (same range as NOTES).

   Naming: '<letter>+<octave>' = that natural note raised a quarter
   tone; '<letter>-<octave>' = that natural note lowered a quarter
   tone. Every quarter tone is named off whichever of its two
   flanking pitches is a natural (no # or b) — e.g. the quarter
   tone between G#3 and A3 is named 'A-3', not 'G#+3'.

   These object keys keep the plain +/- for lookups; the app UI
   swaps them for the Unicode quarter-tone glyphs (U+1D132 sori /
   quarter-sharp, U+1D133 koron / quarter-flat) only for display.

   Verified fingerings sourced/checked by Rex. Everything else is
   an unverified placeholder — same shape the app already uses for
   "no data yet" — update in place as each one gets confirmed.
   ========================================================= */
const QUARTER_TONES = {
  'E+3': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'F+3': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'G-3': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'G+3': [ { code: 'T 123E|123G#', keys: ['thumb','lh1','lh2','lh3','lhE','rh1','rh2','rh3','rhGSharp'], label: '' } ],
  'A-3': [
    { code: 'T 123|12-E', keys: ['thumb','lh1','lh2','lh3','rh1','rh2','rhE'], label: '' },
    { code: 'T 123E|12-', keys: ['thumb','lh1','lh2','lh3','lhE','rh1','rh2'], label: '' },
  ],
  'A+3': [ { code: 'T 123|1-3', keys: ['thumb','lh1','lh2','lh3','rh1','rh3'], label: '' } ],
  'B-3': [
    { code: 'T 123E|-23F#', keys: ['thumb','lh1','lh2','lh3','lhE','rh2','rh3','rhFSharp'], label: '' },
    { code: 'T 123F#|-23E', keys: ['thumb','lh1','lh2','lh3','lhFSharp','rh2','rh3','rhE'], label: '' },
  ],
  'B+3': [ { code: 'T 123|-2B-', keys: ['thumb','lh1','lh2','lh3','rh2','bottomSliver'], label: '' } ],

  'C+4': [ { code: 'T 123C#|-23', keys: ['thumb','lh1','lh2','lh3','lhCSharp','rh2','rh3'], label: '' } ],
  'D-4': [ { code: 'T 12-|12-', keys: ['thumb','lh1','lh2','rh1','rh2'], label: '' } ],
  'D+4': [ { code: 'T 123C#|4---', keys: ['thumb','lh1','lh2','lh3','lhCSharp','side4'], label: '' } ],
  // NOTE: E-4 = quarter-flat of E4 (between Eb4 and E4). Not the same pitch as E+4 below.
  'E-4': [
    { code: 'T 12Eb-|4---', keys: ['thumb','lh1','lh2','topSliver','side4'], label: '' },
    { code: 'T 1-Eb-|12-', keys: ['thumb','lh1','topSliver','rh1','rh2'], label: '' },
  ],
  // NOTE: E+4 (quarter-sharp of E4) is enharmonically the same pitch as "F-4" (quarter-flat
  // of F4) - there is no separate 'F-4' key, this is the one and only entry for that pitch.
  'E+4': [
    { code: 'T ---|123F', keys: ['thumb','rh1','rh2','rh3','rhF'], label: '' },
    { code: 'T ---F|123', keys: ['thumb','lhF','rh1','rh2','rh3'], label: '' },
  ],
  'F+4': [
    { code: 'T 1--|34---', keys: ['thumb','lh1','side3','side4'], label: '' },
    { code: 'T -2-|34---', keys: ['thumb','lh2','side3','side4'], label: '' },
  ],
  'G-4': [ { code: ' -23|123', keys: ['lh2','lh3','rh1','rh2','rh3'], label: '' } ],
  'G+4': [
    { code: ' G#12-|12-', keys: ['throatAb','lh1','lh2','rh1','rh2'], label: '' },
    { code: 'T G#---|34---', keys: ['thumb','throatAb','side3','side4'], label: '' },
  ],
  'A-4': [
    { code: ' A123|123', keys: ['throatA','lh1','lh2','lh3','rh1','rh2','rh3'], label: '' },
    { code: 'T A12-|34---', keys: ['thumb','throatA','lh1','lh2','side3','side4'], label: '' },
  ],
  'A+4': [
    { code: ' G#---|2---', keys: ['throatAb','side2'], label: '' },
    { code: 'T A12-|2---', keys: ['thumb','throatA','lh1','lh2','side2'], label: '' },
    { code: 'RT A12-|---', keys: ['register','thumb','throatA','lh1','lh2'], label: '' },
  ],
  'B-4': [ { code: 'RT A1--|2---', keys: ['register','thumb','throatA','lh1','side2'], label: '' } ],
  // NOTE: B+4 (quarter-sharp of B4) is enharmonically the same pitch as "C-5" (quarter-flat
  // of C5) - there is no separate 'C-5' key, this is the one and only entry for that pitch.
  'B+4': [
    { code: 'T 123|1123E', keys: ['thumb','lh1','lh2','lh3','side1','rh1','rh2','rh3','rhE'], label: 'Awkward fingering for 1st side key' },
    { code: 'T 123E|1123', keys: ['thumb','lh1','lh2','lh3','lhE','side1','rh1','rh2','rh3'], label: 'Awkward fingering for 1st side key' },
  ],

  'C+5': [ { code: 'RT A1--|12---', keys: ['register','thumb','throatA','lh1','side1','side2'], label: '' } ],
  'D-5': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'D+5': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'E-5': [
    { code: 'RT 123|12-E', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','rhE'], label: '' },
    { code: 'RT 123E|12-', keys: ['register','thumb','lh1','lh2','lh3','lhE','rh1','rh2'], label: '' },
  ],
  'E+5': [ { code: 'RT 123|1-3', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh3'], label: '' } ],
  'F+5': [
    { code: 'RT 123|12B-E', keys: ['register','thumb','lh1','lh2','lh3','rh1','rh2','bottomSliver','rhE'], label: '' },
    { code: 'RT 123E|12B-', keys: ['register','thumb','lh1','lh2','lh3','lhE','rh1','rh2','bottomSliver'], label: '' },
  ],
  'G-5': [ { code: 'RT 123|-2B-', keys: ['register','thumb','lh1','lh2','lh3','rh2','bottomSliver'], label: '' } ],
  'G+5': [ { code: 'RT 123C#|-2-', keys: ['register','thumb','lh1','lh2','lh3','lhCSharp','rh2'], label: '' } ],
  'A-5': [ { code: 'RT 12-|-23', keys: ['register','thumb','lh1','lh2','rh2','rh3'], label: '' } ],
  'A+5': [
    { code: 'RT 12-C#|---', keys: ['register','thumb','lh1','lh2','lhCSharp'], label: '' },
    { code: 'RT 123C#|4---', keys: ['register','thumb','lh1','lh2','lh3','lhCSharp','side4'], label: '' },
  ],
  'B-5': [
    { code: 'RT 1-3|---', keys: ['register','thumb','lh1','lh3'], label: '' },
    { code: 'RT 12Eb-|4---', keys: ['register','thumb','lh1','lh2','topSliver','side4'], label: '' },
  ],
  'B+5': [
    { code: 'RT 1-Eb-|---', keys: ['register','thumb','lh1','topSliver'], label: '' },
    { code: 'RT A---|1---', keys: ['register','thumb','throatA','side1'], label: '' },
  ],

  'C+6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'D-6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'D+6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'E-6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'E+6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'F+6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
  'G-6': [ { code: '---|---', keys: [], label: 'Not yet defined' } ],
};
