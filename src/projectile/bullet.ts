import { Projectile } from "./projectile";
import { Unit } from "../units/unit";

const name = "bullet";
const width = 5;
const height = 5;
const color = "black";
const speed = 8;

export class Bullet extends Projectile {
  constructor(x: number, y: number, targetUnit: Unit, attackDamage: number) {
    super(name, x, y, targetUnit, width, height, color, attackDamage, speed);
  }

  update(deltaTime, timestamp) {
    super.update(deltaTime, timestamp);
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}
