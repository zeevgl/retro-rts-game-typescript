import { Game } from "../game";
import { drawText } from "../utils/canvas";
import { DEBUG_MODE } from "../config";
import { MiniMap } from "./miniMap";

const hudWidthPercent = 0.33;
const miniMapHeight = 0.4;
const maxWidth = 450;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Viewport extends Box {}
export interface HudWrapperDimensions extends Box {}

export class Hud {
  public viewport: Viewport;
  public miniMap: MiniMap;

  private hudWidth: number = 0;
  private hudHeight: number = 0;
  private hudX: number = 0;
  private hudY: number = 0;
  private innerHudWidth: number = 0;
  private innerHudHeight: number = 0;
  private innerHudX: number = 0;
  private innerHudY: number = 0;

  constructor(public game: Game) {
    this.initDimensions();

    this.viewport = {
      x: 0,
      y: 0,
      width: this.game.gameWidth - this.hudWidth,
      height: this.game.gameHeight,
    };

    this.miniMap = new MiniMap(
      this.game,
      {
        width: this.innerHudWidth,
        height: this.innerHudHeight * miniMapHeight,
        x: this.innerHudX,
        y: this.innerHudY,
      },
      this.viewport
    );

    this.actionMenu = new ActionMenu(
      this.game,
      {
        width: this.innerHudWidth,
        height: this.innerHudHeight - this.miniMap.height,
        x: this.innerHudX,
        y: this.miniMap.y + this.miniMap.height + 10,
      },
      this.viewport
    );

    this.notifications = new Notifications(this.game, this.viewport);
  }

  initDimensions() {
    //outer hud rectangle
    this.hudWidth = Math.min(this.game.gameWidth * hudWidthPercent, maxWidth);
    this.hudHeight = this.game.gameHeight;
    this.hudX = this.game.gameWidth - this.hudWidth;
    this.hudY = this.game.gameHeight - this.hudHeight;

    //inner hud rectangle
    this.innerHudWidth = this.hudWidth * 0.9;
    this.innerHudHeight = this.hudHeight * 0.96;
    this.innerHudX = this.hudX + this.hudWidth * 0.045;
    this.innerHudY = this.hudY + this.hudHeight * 0.015;
  }

  update(deltaTime: number, timestamp: number) {
    this.actionMenu.update(deltaTime, timestamp);
    this.notifications.update(deltaTime, timestamp);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.game.camera.x, this.game.camera.y);
    ctx.fillStyle = "grey";
    ctx.fillRect(this.hudX, this.hudY, this.hudWidth, this.hudHeight);

    this.miniMap.draw(ctx);
    this.drawViewport(ctx);
    this.actionMenu.draw(ctx);
    this.drawResources(ctx);
    this.notifications.draw(ctx);
    ctx.restore();
  }

  drawViewport(context: CanvasRenderingContext2D) {
    if (DEBUG_MODE) {
      context.beginPath();
      context.rect(
        this.viewport.x,
        this.viewport.y,
        this.viewport.width,
        this.viewport.height
      );
      context.strokeStyle = "red";
      context.stroke();
    }
  }

  drawResources(ctx: CanvasRenderingContext2D) {
    drawText(
      ctx,
      `Money: ${this.game.humanPlayer.resources.money}`,
      this.hudX - 100,
      20,
      "white",
      "center",
      "20px Arial"
    );
  }

  isInsideViewport(
    originalX: number,
    originalY: number,
    width: number,
    height: number
  ) {
    const { x, y } = this.game.camera.adjustPointToCamera(originalX, originalY);
    return (
      x + width > this.viewport.x &&
      x < this.viewport.x + this.viewport.width &&
      y + height > this.viewport.y &&
      y < this.viewport.y + this.viewport.height
    );
  }
}
