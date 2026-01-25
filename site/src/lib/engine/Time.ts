import { EventEmitter } from './EventEmitter';

export class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  ticker?: number;

  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    // Start loop automatically? Or manual?
    // Bruno starts in constructor
    window.requestAnimationFrame(() => this.tick());
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    if (this.delta > 60) {
      this.delta = 60;
    }

    this.trigger('tick');

    window.requestAnimationFrame(() => this.tick());
  }
}
