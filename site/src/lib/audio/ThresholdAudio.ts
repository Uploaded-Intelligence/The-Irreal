import * as Tone from 'tone';

/**
 * ThresholdAudio
 *
 * Generative audio for the Threshold crossing ritual.
 * - Sub-bass drone (40Hz base, rises through stages)
 * - Filter opens with mouse velocity
 * - Long reverb for spatial depth
 */
class ThresholdAudioEngine {
  private initialized = false;
  private started = false;

  // Audio nodes
  private drone: Tone.Oscillator | null = null;
  private filter: Tone.Filter | null = null;
  private reverb: Tone.Reverb | null = null;
  private gain: Tone.Gain | null = null;

  // Stage frequencies (Hz)
  private readonly stageFrequencies = {
    detection: 0,      // Silent
    void: 40,          // Sub-bass, felt more than heard
    attunement: 55,    // Rising
    crystallization: 80,
    portals: 110,      // A2, warm
    crossing: 110,
  };

  async init(): Promise<void> {
    if (this.initialized) return;

    // Create audio chain: Oscillator → Filter → Reverb → Gain → Destination
    this.drone = new Tone.Oscillator({
      type: 'sine',
      frequency: 40,
    });

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 200,
      rolloff: -24,
    });

    this.reverb = new Tone.Reverb({
      decay: 8,
      wet: 0.6,
    });
    await this.reverb.generate();

    this.gain = new Tone.Gain(0);

    // Chain
    this.drone.connect(this.filter);
    this.filter.connect(this.reverb);
    this.reverb.connect(this.gain);
    this.gain.toDestination();

    this.initialized = true;
  }

  async start(): Promise<void> {
    if (!this.initialized) await this.init();
    if (this.started) return;

    await Tone.start();
    this.drone?.start();
    this.started = true;
  }

  stop(): void {
    this.drone?.stop();
    this.started = false;
  }

  setStage(stage: keyof typeof this.stageFrequencies): void {
    if (!this.drone || !this.gain) return;

    const targetFreq = this.stageFrequencies[stage];
    const targetGain = stage === 'detection' ? 0 : 0.3;

    // Smooth ramp over 1 second
    this.drone.frequency.rampTo(targetFreq, 1);
    this.gain.gain.rampTo(targetGain, 1);
  }

  setMouseVelocity(velocity: number): void {
    if (!this.filter) return;

    // Map velocity (0-1) to filter cutoff (200-2000 Hz)
    const cutoff = 200 + velocity * 1800;
    this.filter.frequency.rampTo(cutoff, 0.1);
  }

  setVolume(volume: number): void {
    if (!this.gain) return;
    this.gain.gain.rampTo(volume * 0.3, 0.5);
  }

  mute(): void {
    this.gain?.gain.rampTo(0, 0.5);
  }

  unmute(): void {
    this.gain?.gain.rampTo(0.3, 0.5);
  }

  dispose(): void {
    this.drone?.dispose();
    this.filter?.dispose();
    this.reverb?.dispose();
    this.gain?.dispose();
    this.initialized = false;
    this.started = false;
  }
}

// Singleton
export const thresholdAudio = new ThresholdAudioEngine();
