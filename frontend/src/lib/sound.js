// Synthesized Sound Effects using Web Audio API
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (!this.enabled || !this.ctx) return;
    try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    } catch(e) {
        console.error("Audio play failed", e);
    }
  }

  playClick() {
    this.init();
    // High blip
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playMiss() {
    this.init();
    // Low thud
    this.playTone(150, 'triangle', 0.3, 0.1);
  }

  playHurt() {
    this.init();
    // Metallic clank
    this.playTone(400, 'square', 0.2, 0.05);
    setTimeout(() => this.playTone(300, 'square', 0.2, 0.05), 50);
  }

  playBoom() {
    this.init();
    // Explosion-like noise (approximated with low saw)
    this.playTone(100, 'sawtooth', 0.5, 0.2);
    this.playTone(50, 'square', 0.8, 0.2);
  }

  playWin() {
    this.init();
    // Victory arpeggio
    this.playTone(440, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(554, 'sine', 0.2, 0.1), 100);
    setTimeout(() => this.playTone(659, 'sine', 0.4, 0.1), 200);
  }

  playLose() {
    this.init();
    // Sad descend
    this.playTone(400, 'triangle', 0.3, 0.1);
    setTimeout(() => this.playTone(300, 'triangle', 0.3, 0.1), 200);
    setTimeout(() => this.playTone(200, 'triangle', 0.5, 0.1), 400);
  }
}

export const soundManager = new SoundManager();
