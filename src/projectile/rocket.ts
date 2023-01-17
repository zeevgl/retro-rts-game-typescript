import { Projectile } from "./projectile";
import { Unit } from "../units/unit";
import { getDegree180 } from "../utils/pointsCalc";
import { getSpritePositions } from "../utils/sprite";

const name = "rocket";
const width = 15;
const height = 32;
const color = "white";
const speed = 3;

export class Rocket extends Projectile {
  private trail: { x: number; y: number }[];
  private degree: number;
  private sprite: any;
  constructor(x: number, y: number, targetUnit: Unit, attackDamage: number) {
    super(
      name,
      x,
      y - 40,
      targetUnit,
      width,
      height,
      color,
      attackDamage,
      speed
    );

    this.trail = [];
    this.pushTrail();

    this.initSprites();
    this.degree =
      getDegree180(
        this.x,
        this.y,
        this.targetUnit.centerX,
        this.targetUnit.centerY
      ) + 90;
  }

  initSprites() {
    const { positions, sprite } = getSpritePositions(
      535,
      2294,
      this.width,
      1,
      1,
      "./assets/projectiles/missile.png",
      this.height
    );

    this.sprite = sprite;
  }

  update(deltaTime: number, timestamp: number) {
    super.update(deltaTime, timestamp);
    this.pushTrail();
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }

  drawProjectile(ctx: CanvasRenderingContext2D) {
    ctx.save();

    const cx = this.x + 0.5 * this.width;
    const cy = this.y + 0.5 * this.height;

    ctx.translate(cx, cy);
    ctx.rotate((Math.PI / 180) * this.degree);
    ctx.translate(-cx, -cy);

    this.sprite.draw(ctx, 0, this.x, this.y);
    ctx.restore();
    this.drawTrail(ctx);
  }

  drawTrail(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.trail.slice(-45).forEach((trail, index) => {
      if (index % 2 === 0) {
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, index * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
      }
    });
    ctx.restore();
  }

  pushTrail() {
    this.trail.push({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    });
  }
}
