import {
  AttackDamage,
  UnitClasses,
  UnitGroups,
  UnitStates,
} from "../unitTypesDefinition";
import { IUnit, Unit } from "../unit";
import { Barracks } from "../buildings/barracks";
import { Rocket } from "../../projectile/rocket";
import {getSpritePositions, Sprite} from "../../utils/sprite";

const animationFrames = {
  [UnitStates.SPAWN]: {
    start: 0,
    length: 0,
    next: UnitStates.IDLE,
  },
  [UnitStates.IDLE]: {
    start: 0,
    length: 0,
  },
  [UnitStates.MOVING]: {
    start: 1,
    length: 4,
    loop: true,
  },
  [UnitStates.MOVING_TO_ATTACK]: {
    start: 1,
    length: 4,
    loop: true,
  },
  [UnitStates.ATTACK]: {
    start: 5,
    length: 5,
    loop: false,
  },
};

const maxHealth = 100;
const name = "Rocketeer";
const width = 45;
const height = 100;
const attackDamage: AttackDamage = {
  [UnitClasses.LIGHT]: 6,
  [UnitClasses.MEDIUM]: 25,
  [UnitClasses.HEAVY]: 25,
  [UnitClasses.BUILDING]: 150,
};
const visionRange = 300;
const attackRange = 250;
const attackCooldown = 2500;
const unitClass = UnitClasses.LIGHT;
const speed = 1.5;
const buildTime = 600;
const cost = 300;

export class Rocketeer extends Unit {
  private sprite!: Sprite;

  constructor({ player, x, y, color }: IUnit) {
    super({
      player,
      name,
      x,
      y,
      width,
      height,
      color,
      maxHealth,
      attackDamage,
      visionRange,
      attackRange,
      attackCooldown,
      unitClass,
      speed,
      buildTime,
      buildAt: Barracks,
      projectileClass: Rocket,
      group: UnitGroups.fighter,
      cost,
    });
    this.initSprites();
    this.initAnimations(animationFrames, this.sprite);
  }

  initSprites() {
    const { sprite } = getSpritePositions(
      185,
      147,
      this.height,
      8,
      11,
      "./assets/units/rockets3.png"
    );

    this.sprite = sprite;
  }

  drawUnit(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const positionCol = this.degreeToPosition(this.degree);
    this.sprite.draw(
      ctx,
      positionCol + 8 * this.activeAnimation!.getActiveFrame(),
      this.x,
      this.y
    );
    ctx.restore();
  }

  degreeToPosition(degree: number) {
    const frames = 8;
    const slice = 360 / frames;

    const col = Math.floor(degree / slice);
    if (col === 0) {
      return 2;
    } else if (col <= 2) {
      return 2 - col;
    } else {
      return 9 - col;
    }
  }
}
