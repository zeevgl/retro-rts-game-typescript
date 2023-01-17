import {Sprite} from './sprite';

export class FrameAnimator {
  private readonly onComplete: (() => void) | null;
  private imageFrame: number;
  private isRunning: boolean;
  private totalDt: number;

  constructor(
    private sprite: typeof Sprite,
    private startIndex: number,
    private endIndex: number,
    private loop: boolean = false,
    private frameDuration: number = 80,
    { onComplete = null } = {}
  ) {
    this.onComplete = onComplete;

    this.imageFrame = 0;
    this.isRunning = false;
    this.totalDt = 0;
  }

  static fromAnimationFrame(
    sprite,
    { start, length, loop, frameDuration },
    options = undefined
  ) {
    return new this(
      sprite,
      start,
      start + length,
      loop,
      frameDuration,
      options
    );
  }

  update(dt, timestamp) {
    if (!this.isRunning) {
      return;
    }

    this.totalDt += dt;

    if (this.totalDt >= this.frameDuration) {
      if (this.imageFrame >= this.endIndex) {
        if (this.loop) {
          this.imageFrame = this.startIndex;
        } else {
          this.stop();
          this.onComplete?.();
        }
      } else {
        this.imageFrame++;
      }

      this.totalDt = 0;
    }
  }

  draw(canvas, x, y) {
    //use draw to render OR use getActiveFrame manually render
    this.sprite.draw(canvas, this.imageFrame, x, y);
  }

  getActiveFrame() {
    return this.imageFrame;
  }

  start() {
    this.imageFrame = this.startIndex;
    this.totalDt = 0;
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }
}
