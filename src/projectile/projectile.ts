import { Unit } from "../units/unit";
import { ProjectileStates } from "./projectileState";
import { calcDistance, calcMoves, IMoves } from "../utils/pointsCalc";
import {checkCollisionBetweenProjectileAndUnit} from '../utils/collision';
import {AttackDamage} from '../units/unitTypesDefinition';

export class Projectile {
  private readonly targetUnitLocked: Unit;
  private state: ProjectileStates;
  private moves: IMoves;
  constructor(
    private name: string,
    protected x: number,
    protected y: number,
    protected targetUnit: Unit,
    protected width: number,
    protected height: number,
    private color: string,
    private attackDamage: AttackDamage,
    private speed: number
  ) {
    this.targetUnitLocked = { ...targetUnit };
    this.state = ProjectileStates.FLYING;

    const distance = calcDistance(
      this.x,
      this.y,
      this.targetUnit.centerX,
      this.targetUnit.centerY
    );
    this.moves = calcMoves(
      this.speed,
      distance,
      this.x,
      this.y,
      this.targetUnit.centerX,
      this.targetUnit.centerY
    );
  }

  update(deltaTime, timestamp) {
    if (this.state === ProjectileStates.FLYING) {
      this.x += this.moves.xunits;
      this.y += this.moves.yunits;
      this.checkHitTarget();
    } else if (this.state === ProjectileStates.EXPLODING) {
      this.state = ProjectileStates.INACTIVE;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    switch (this.state) {
      case ProjectileStates.FLYING:
        this.drawProjectile(ctx);
        break;
      case ProjectileStates.EXPLODING:
        //this.drawExplosion(ctx);
        break;
    }
    ctx.restore();
  }

  drawProjectile(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  drawExplosion(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const randomPaddingX = Math.floor(Math.random() * 10) - 10;
    const randomPaddingY = Math.floor(Math.random() * 10) - 10;
    ctx.arc(
      this.x + randomPaddingX,
      this.y + randomPaddingY,
      30,
      0,
      2 * Math.PI
    );

    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  checkHitTarget() {
    if (checkCollisionBetweenProjectileAndUnit(this, this.targetUnit)) {
      this.state = ProjectileStates.EXPLODING;
      this.targetUnit.health -= this.attackDamage[this.targetUnit.unitClass];
      if (this.targetUnit.health <= 0) {
        //TODO: this should be in unit class
        this.targetUnit.isAlive = false;
        this.targetUnit.isSelected = false;
      }
      return true;
    } else if (
      checkCollisionBetweenProjectileAndUnit(this, this.targetUnitLocked)
    ) {
      this.state = ProjectileStates.EXPLODING;
      return true;
    }

    return false;
  }

  get isActive() {
    return this.state !== ProjectileStates.INACTIVE;
  }
}
