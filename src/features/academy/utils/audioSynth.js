let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

// Check if audio is muted in localStorage (default is muted: true)
export const isAudioMuted = () => {
  const saved = localStorage.getItem('qcf_audio_muted');
  return saved === null ? true : saved === 'true';
};

export const setAudioMuted = (muted) => {
  localStorage.setItem('qcf_audio_muted', muted ? 'true' : 'false');
};

const playTone = ({ freq, type = 'sine', duration = 0.1, gainStart = 0.1, delay = 0 }) => {
  if (isAudioMuted()) return;

  // Check prefers-reduced-motion as a proxy for minimal sound
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finalVolume = prefersReduced ? gainStart * 0.4 : gainStart;
  const finalDuration = prefersReduced ? duration * 0.6 : duration;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime + delay);
    // Exponential decay envelope
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + finalDuration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + finalDuration);
  } catch (e) {
    console.warn('Web Audio synthesis failed:', e);
  }
};

export const playTerminalBoot = () => {
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, index) => {
    playTone({
      freq,
      type: 'triangle',
      duration: 0.15,
      gainStart: 0.05,
      delay: index * 0.08 // Staggered notes
    });
  });
};

export const playMissionComplete = () => {
  // High double chime
  playTone({
    freq: 880.00, // A5
    type: 'sine',
    duration: 0.15,
    gainStart: 0.1,
    delay: 0
  });
  playTone({
    freq: 1318.51, // E6
    type: 'sine',
    duration: 0.4,
    gainStart: 0.08,
    delay: 0.12
  });
};

export const playRankUp = () => {
  // Grand ascending synth chord
  const chord = [130.81, 196.00, 261.63, 329.63, 392.00, 523.25]; // C3, G3, C4, E4, G4, C5
  chord.forEach((freq, index) => {
    playTone({
      freq,
      type: 'sine',
      duration: 0.8,
      gainStart: 0.06,
      delay: index * 0.08
    });
  });
  // Extra high chime at the end
  playTone({
    freq: 1046.50, // C6
    type: 'sine',
    duration: 0.6,
    gainStart: 0.05,
    delay: 0.5
  });
};
