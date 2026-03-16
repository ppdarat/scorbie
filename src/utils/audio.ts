// Simple audio synthesizer using Web Audio API to avoid needing external sound files

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const playScoreSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playWinSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    // Play a little fanfare
    const notes = [
      { freq: 440, time: 0, duration: 0.15 },
      { freq: 554.37, time: 0.15, duration: 0.15 },
      { freq: 659.25, time: 0.3, duration: 0.15 },
      { freq: 880, time: 0.45, duration: 0.4 }
    ];
    
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + note.time + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + note.time + note.duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.duration);
    });
  } catch (e) {
    console.error("Audio play failed", e);
  }
};