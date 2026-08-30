/* clarinet-engine.js
 * Audio capture, pitch detection, note tracking, and music/transposition
 * logic for the Clarinet Pitch Trainer. No DOM references, no rendering -
 * this module should be usable from Node for testing exactly as it is in
 * the browser. Everything it exposes hangs off window.ClarinetEngine.
 */
(function (global) {
'use strict';

/* =========================================================
   MUSIC ENGINE — note naming and configurable transposition.
   Nothing above this layer knows what a clarinet is; nothing
   in here knows about staff notation.
   ========================================================= */
const NOTE_NAMES = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const NATURAL_NAMES = ['C','D','E','F','G','A','B'];

// Common transpositions: written = concert + offsetSemitones.
const INSTRUMENTS = {
  concert: { label: 'Concert pitch (no transposition)', offsetSemitones: 0 },
  bb:      { label: 'B♭ Clarinet',      offsetSemitones: 2 },
  ebAlto:  { label: 'E♭ Alto Saxophone', offsetSemitones: 9 },
};

function freqToMidi(freq){ return 69 + 12 * Math.log2(freq / 440); }
function midiToFreq(midi){ return 440 * Math.pow(2, (midi - 69) / 12); }

function midiToNoteName(midiRounded){
  const name = NOTE_NAMES[((midiRounded % 12) + 12) % 12];
  const octave = Math.floor(midiRounded / 12) - 1;
  return { name, octave, label: name + octave };
}

function noteNameToMidi(name, octave){
  const idx = NOTE_NAMES.indexOf(name);
  return (octave + 1) * 12 + idx;
}

function concertMidiToWrittenMidi(concertMidi, offsetSemitones){
  return concertMidi + offsetSemitones;
}
function writtenMidiToConcertMidi(writtenMidi, offsetSemitones){
  return writtenMidi - offsetSemitones;
}

// All natural notes (no sharps/flats) between two "Name+Octave" labels,
// inclusive, ascending. Swaps the bounds if given out of order.
function naturalRange(fromLabel, toLabel){
  let fromMidi = labelToMidi(fromLabel);
  let toMidi = labelToMidi(toLabel);
  if (fromMidi > toMidi){ const t = fromMidi; fromMidi = toMidi; toMidi = t; }
  const out = [];
  for (let m = fromMidi; m <= toMidi; m++){
    const n = midiToNoteName(m);
    if (NATURAL_NAMES.includes(n.name)) out.push(n);
  }
  return out;
}
// Same, but includes sharps (every chromatic step in the range). Bounds are
// still given as natural-note labels (the range pickers only ever show
// naturals) - this just changes what falls between them.
function chromaticRange(fromLabel, toLabel){
  let fromMidi = labelToMidi(fromLabel);
  let toMidi = labelToMidi(toLabel);
  if (fromMidi > toMidi){ const t = fromMidi; fromMidi = toMidi; toMidi = t; }
  const out = [];
  for (let m = fromMidi; m <= toMidi; m++) out.push(midiToNoteName(m));
  return out;
}
function labelToMidi(label){
  const match = /^([A-G])(-?\d+)$/.exec(label);
  if (!match) throw new Error('Bad note label: ' + label);
  return noteNameToMidi(match[1], parseInt(match[2], 10));
}
// "C♯", 4  ->  "c#/4"  (VexFlow's key-string format). Kept here rather than
// in the page layer so the accidental glyphs used for on-screen labels and
// the ASCII symbols VexFlow expects only ever need to agree in one place.
function noteNameToVexKey(name, octave){
  const letter = name[0].toLowerCase();
  const accidental = name.includes('♯') ? '#' : (name.includes('♭') ? 'b' : '');
  return letter + accidental + '/' + octave;
}

/* =========================================================
   PITCH DETECTOR — YIN, bounded to a practical clarinet
   frequency range, with an optional sub-harmonic correction
   (off by default - see Phase 1 notes on why).
   ========================================================= */
const FREQ_MIN = 100;
const FREQ_MAX = 1600;
const YIN_THRESHOLD = 0.15;
const SUBHARMONIC_ENERGY_RATIO = 0.12;

function goertzelMagnitude(buffer, sampleRate, freq){
  const N = buffer.length;
  const k = Math.round(N * freq / sampleRate);
  const w = 2 * Math.PI * k / N;
  const cosine = Math.cos(w), coeff = 2 * cosine, sine = Math.sin(w);
  let q0 = 0, q1 = 0, q2 = 0;
  for (let i = 0; i < N; i++){ q0 = coeff * q1 - q2 + buffer[i]; q2 = q1; q1 = q0; }
  const real = q1 - q2 * cosine, imag = q2 * sine;
  return Math.sqrt(real * real + imag * imag);
}

function yinDetect(buffer, sampleRate, subharmonicEnabled){
  const W = Math.floor(buffer.length / 2);
  const yinBuf = new Float32Array(W);

  for (let tau = 1; tau < W; tau++){
    let sum = 0;
    for (let i = 0; i < W; i++){
      const d = buffer[i] - buffer[i + tau];
      sum += d * d;
    }
    yinBuf[tau] = sum;
  }
  yinBuf[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < W; tau++){
    runningSum += yinBuf[tau];
    yinBuf[tau] = runningSum === 0 ? 1 : yinBuf[tau] * tau / runningSum;
  }

  const tauMin = Math.max(2, Math.floor(sampleRate / FREQ_MAX));
  const tauMax = Math.min(W - 1, Math.ceil(sampleRate / FREQ_MIN));

  let tau0 = -1;
  for (let tau = tauMin; tau <= tauMax; tau++){
    if (yinBuf[tau] < YIN_THRESHOLD){
      while (tau + 1 <= tauMax && yinBuf[tau + 1] < yinBuf[tau]) tau++;
      tau0 = tau;
      break;
    }
  }
  let lowConfidenceFallback = false;
  if (tau0 === -1){
    let minVal = Infinity, minTau = -1;
    for (let tau = tauMin; tau <= tauMax; tau++){
      if (yinBuf[tau] < minVal){ minVal = yinBuf[tau]; minTau = tau; }
    }
    tau0 = minTau;
    lowConfidenceFallback = true;
  }
  if (tau0 === -1) return null;

  let bestTau = tau0, corrected = false;
  if (subharmonicEnabled){
    const f0 = sampleRate / tau0;
    const magF0 = goertzelMagnitude(buffer, sampleRate, f0);
    for (const mult of [2, 3]){
      const t = tau0 * mult;
      if (t > tauMax) continue;
      const magCandidate = goertzelMagnitude(buffer, sampleRate, f0 / mult);
      if (magCandidate > SUBHARMONIC_ENERGY_RATIO * magF0){
        bestTau = t;
        corrected = true;
      }
    }
  }

  let betterTau = bestTau;
  if (bestTau > 0 && bestTau < W - 1){
    const s0 = yinBuf[bestTau - 1], s1 = yinBuf[bestTau], s2 = yinBuf[bestTau + 1];
    const denom = (2 * s1 - s2 - s0);
    if (denom !== 0){
      const adj = (s2 - s0) / (2 * denom);
      if (isFinite(adj) && Math.abs(adj) < 1) betterTau = bestTau + adj;
    }
  }

  const frequency = sampleRate / betterTau;
  const aperiodicity = yinBuf[bestTau];
  let confidence = Math.max(0, 1 - aperiodicity);
  if (lowConfidenceFallback) confidence *= 0.4;

  return { frequency, confidence, corrected, rawFrequency: sampleRate / tau0 };
}

function rms(buffer){
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}
const SILENCE_RMS = 0.008;

/* =========================================================
   WEIGHTED PRACTICE — favor notes with lower accuracy or
   worse intonation, using the same per-note stats the
   practice report reads. Pure functions: no DOM, no state.
   ========================================================= */
// A note with no attempts yet gets a fixed moderate weight - enough that it
// still turns up regularly, but without dominating over notes with a
// demonstrated problem.
const UNSEEN_NOTE_WEIGHT = 1.5;

function computeNoteWeight(stat){
  if (!stat || !stat.attempts) return UNSEEN_NOTE_WEIGHT;
  const accuracyFraction = stat.correct / stat.attempts;
  const avgAbsCents = stat.centsCount ? (stat.centsAbsSum / stat.centsCount) : 0;
  const weight = (1 - accuracyFraction) * 3 + Math.min(avgAbsCents / 50, 2);
  return Math.max(0.3, weight); // floor - even a perfect note still appears sometimes
}

function weightedPick(items, weights, rngFn){
  rngFn = rngFn || Math.random;
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return items[Math.floor(rngFn() * items.length)];
  let r = rngFn() * total;
  for (let i = 0; i < items.length; i++){
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/* =========================================================
   PITCH TRACKER — smooths detector noise into discrete note
   events. Knows nothing about instruments.
   ========================================================= */
function createTracker(config){
  const state = {
    state: 'SILENCE', currentMidi: null, stableCount: 0,
    stableStart: null, silenceStart: null,
  };
  function reset(){
    state.state = 'SILENCE'; state.currentMidi = null; state.stableCount = 0;
    state.stableStart = null; state.silenceStart = null;
  }
  function process(pitchResult, tMs){
    if (!pitchResult || pitchResult.confidence < config.minConfidence){
      if (state.state !== 'SILENCE'){
        if (state.silenceStart === null) state.silenceStart = tMs;
        if (tMs - state.silenceStart > config.releaseTimeoutMs){
          const wasHeld = (state.state === 'ACCEPTED' || state.state === 'HOLDING');
          reset();
          return wasHeld ? { type: 'RELEASE' } : { type: 'STATE' };
        }
      }
      return { type: 'STATE' };
    }
    state.silenceStart = null;
    const midi = Math.round(pitchResult.midi);

    if (state.state === 'SILENCE'){
      state.state = 'POSSIBLE'; state.currentMidi = midi;
      state.stableCount = 1; state.stableStart = tMs;
      return { type: 'STATE' };
    }
    if (state.state === 'POSSIBLE' || state.state === 'STABLE'){
      if (midi === state.currentMidi){
        state.stableCount++;
        if (state.stableCount >= config.requiredStableFrames){
          state.state = 'ACCEPTED';
          return { type: 'ACCEPTED', midi, latency: tMs - state.stableStart };
        } else {
          state.state = 'STABLE';
        }
      } else {
        state.currentMidi = midi; state.stableCount = 1;
        state.stableStart = tMs; state.state = 'POSSIBLE';
      }
      return { type: 'STATE' };
    }
    if (state.state === 'ACCEPTED' || state.state === 'HOLDING'){
      // Once a note is accepted, only real silence (handled above, via the
      // confidence/RMS gate) can end it. A sustained pitch deviation here -
      // decay wobble, reed noise as the note tails off, a slow release - is
      // deliberately NOT treated as "a new note started": requiring an
      // actual gap between notes (as tonguing naturally produces) is what
      // stops the tail of one note from being scored as a second, unplayed
      // attempt. The tradeoff: a genuinely slurred/legato transition straight
      // from one note to another, with no audible gap, won't be detected
      // either - only articulated, one-at-a-time playing will.
      if (midi === state.currentMidi) state.state = 'HOLDING';
      return { type: 'STATE' };
    }
    return { type: 'STATE' };
  }
  return { process, reset, getState: () => state.state, getMidi: () => state.currentMidi };
}

/* =========================================================
   AUDIO ENGINE — mic, AudioContext, AudioWorklet, ring buffer
   + hop-based analysis scheduling. Knows nothing about pitch.
   Exposed as a factory so index.html owns the instance and can
   wire callbacks without this module touching the DOM.
   ========================================================= */
const WORKLET_SRC = `
class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && input[0].length) {
      this.port.postMessage(input[0].slice(0));
    }
    return true;
  }
}
registerProcessor('capture-processor', CaptureProcessor);
`;

function createAudioEngine(onAnalysisFrame){
  let audioCtx = null, micStream = null, workletNode = null;
  let ring = null, ringSize = 0, ringWriteIdx = 0, samplesWritten = 0, samplesSinceAnalysis = 0;
  let analysisWindow = 2048, hopSize = Math.floor(analysisWindow / 4);
  let calibrating = false, calibPeak = 0, calibSamples = 0, calibDoneCb = null;
  let lastAnalysisFrame = null;
  let suppressAnalysisUntilMs = 0;

  function extractLastN(n){
    const out = new Float32Array(n);
    let idx = (ringWriteIdx - n + ringSize) % ringSize;
    for (let i = 0; i < n; i++){ out[i] = ring[idx]; idx = (idx + 1) % ringSize; }
    return out;
  }

  function onBlock(block){
    if (calibrating){
      for (let i = 0; i < block.length; i++){
        const a = Math.abs(block[i]);
        if (a > calibPeak) calibPeak = a;
      }
      calibSamples += block.length;
      if (calibSamples >= audioCtx.sampleRate * 2){
        calibrating = false;
        if (calibDoneCb) calibDoneCb(calibPeak);
      }
    }
    for (let i = 0; i < block.length; i++){
      ring[ringWriteIdx] = block[i];
      ringWriteIdx = (ringWriteIdx + 1) % ringSize;
    }
    samplesWritten += block.length;
    samplesSinceAnalysis += block.length;
    if (samplesWritten >= analysisWindow && samplesSinceAnalysis >= hopSize){
      samplesSinceAnalysis = 0;
      const frame = extractLastN(analysisWindow);
      lastAnalysisFrame = frame;
      // Suppress analysis during, and briefly after, reference-tone playback
      // (aural mode). Without this, tone leakage into the mic - inevitable
      // on speakers, possible even on some headphone setups - could register
      // as a "detected" note the person never actually played.
      if (performance.now() < suppressAnalysisUntilMs) return;
      onAnalysisFrame(frame, audioCtx.sampleRate);
    }
  }

  async function start(){
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });
    audioCtx = new AudioContext();
    const blob = new Blob([WORKLET_SRC], { type: 'application/javascript' });
    try {
      await audioCtx.audioWorklet.addModule(URL.createObjectURL(blob));
    } catch (workletErr){
      await audioCtx.close();
      audioCtx = null;
      const e = new Error(
        'Could not load the audio worklet. If you opened this file directly ' +
        '(a file:// URL), that\'s the cause: browsers block loading a worklet ' +
        'module from a local file. Serve it over http:// instead - e.g. ' +
        '"python -m http.server" in this folder, then open http://localhost:8000/.'
      );
      e.name = 'WorkletLoadError';
      throw e;
    }
    ringSize = 16384;
    ring = new Float32Array(ringSize);
    ringWriteIdx = 0; samplesWritten = 0; samplesSinceAnalysis = 0;

    const source = audioCtx.createMediaStreamSource(micStream);
    workletNode = new AudioWorkletNode(audioCtx, 'capture-processor');
    workletNode.port.onmessage = (e) => onBlock(e.data);
    source.connect(workletNode);
    return { sampleRate: audioCtx.sampleRate };
  }

  function stop(){
    if (workletNode){ workletNode.port.onmessage = null; workletNode.disconnect(); }
    if (micStream){ micStream.getTracks().forEach(t => t.stop()); }
    if (audioCtx){ audioCtx.close(); }
    audioCtx = null; micStream = null; workletNode = null;
  }

  function setAnalysisWindow(n){
    analysisWindow = n;
    hopSize = Math.floor(n / 4);
    samplesWritten = 0; samplesSinceAnalysis = 0;
  }

  function calibrate(onDone){
    calibrating = true; calibPeak = 0; calibSamples = 0; calibDoneCb = onDone;
  }

  // Plays a short reference tone (aural mode) through the same AudioContext
  // used for capture, and blocks analysis for its duration plus a guard tail
  // so the playback can't be mistaken for something the person played.
  function playTone(freqHz, durationMs){
    if (!audioCtx) return false;
    const guardMs = 250;
    suppressAnalysisUntilMs = performance.now() + durationMs + guardMs;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freqHz;
    const now = audioCtx.currentTime;
    const dur = durationMs / 1000;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.setValueAtTime(0.2, Math.max(now + 0.02, now + dur - 0.05));
    gain.gain.linearRampToValueAtTime(0, now + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    return true;
  }

  return {
    start, stop, setAnalysisWindow, calibrate, playTone,
    getSampleRate: () => audioCtx ? audioCtx.sampleRate : null,
    getAnalysisWindow: () => analysisWindow,
    getHopSize: () => hopSize,
    getLastAnalysisFrame: () => lastAnalysisFrame,
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */
global.ClarinetEngine = {
  // music
  NOTE_NAMES, NATURAL_NAMES, INSTRUMENTS,
  freqToMidi, midiToFreq, midiToNoteName, noteNameToMidi,
  concertMidiToWrittenMidi, writtenMidiToConcertMidi, naturalRange, chromaticRange,
  noteNameToVexKey,
  // pitch
  yinDetect, rms, SILENCE_RMS,
  // weighting
  computeNoteWeight, weightedPick,
  // tracker
  createTracker,
  // audio
  createAudioEngine,
};

})(typeof window !== 'undefined' ? window : globalThis);
