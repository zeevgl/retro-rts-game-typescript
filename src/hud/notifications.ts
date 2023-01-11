import { Game } from "../game";
import { Viewport } from "./hud";
import {drawText} from '../utils/canvas';
import {Message} from './messages';

export class Notifications {
  private readonly width: number;
  private readonly height: number;
  private readonly x: number;
  private readonly y: number;

  private messages: string[] = [];
  private messageTimeout = 3000;
  private tick = 0;

  private messageFlashingTick = 0;
  private messageFlashingSpped = 500;
  private messageFlash = false;

  constructor(private game: Game, private viewport: Viewport) {
    this.width = this.viewport.width * 0.9;
    this.height = 100;
    this.x = this.viewport.x + this.viewport.width * 0.05;
    this.y = this.viewport.y + 35;
  }

  update(deltaTime: number, _timestamp: number) {
    if (this.messages.length > 0) {
      if (this.tick > this.messageTimeout) {
        this.messages.splice(0, 1);
        this.tick = 0;
      } else {
        this.tick += deltaTime;
      }

      if (this.messageFlashingTick > this.messageFlashingSpped) {
        this.messageFlashingTick = 0;
        this.messageFlash = !this.messageFlash;
      } else {
        this.messageFlashingTick += deltaTime;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.messages.length > 0 && this.messageFlash) {
      const message = this.messages[0];
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      drawText(
        ctx,
        message,
        this.x + this.width / 2,
        this.y + this.height / 2,
        "black",
        "center",
        "20px Arial"
      );
      ctx.restore();
    }
  }

  notifyText(text: string) {
    this.messageFlash = true;
    this.messages = [text];
    this.tick = 0;
    this.messageFlashingTick = 0;
  }

  notify(messageObject: Message) {
    this.messageFlash = true;
    this.messages = [messageObject.text];
    this.tick = 0;
    this.messageFlashingTick = 0;
  }

  notifyToQueue(messageObject: Message) {
    this.messageFlash = true;
    this.messages.push(messageObject.text);
  }
}
