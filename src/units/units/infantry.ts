import {
  AttackDamage,
  UnitClasses,
  UnitGroups,
  UnitStates,
} from "../unitTypesDefinition";
import { IUnit, Unit } from "../unit";
import { Barracks } from "../buildings/barracks";
import {getSpritePositions, Sprite} from "../../utils/sprite";

const animationFrames = {
  [UnitStates.SPAWN]: {
    start: 0,
    length: 0,
    loop: false,
  },
  [UnitStates.IDLE]: {
    start: 0,
    length: 0,
  },
  [UnitStates.MOVING]: {
    start: 1,
    length: 5,
    loop: true,
  },
  [UnitStates.MOVING_TO_ATTACK]: {
    start: 1,
    length: 5,
    loop: true,
  },
  [UnitStates.ATTACK]: {
    start: 7,
    length: 4,
  },
  [UnitStates.DYING]: {
    //L:23-2  R:25-2
    start: 23,
    length: 1,
    frameDuration: 1000,
    loop: true,
  },
  [UnitStates.SQUASHED]: {
    start: 27,
    length: 0,
  },
  [UnitStates.DYING]: {
    //L:23-2  R:25-2
    start: 23,
    length: 1,
    frameDuration: 80,
  },
  [UnitStates.SQUASHED]: {
    start: 27,
    length: 0,
  },
};

const maxHealth = 100;
const name = "infantry";
const width = 35;
const height = 75;
const attackDamage: AttackDamage = {
  [UnitClasses.LIGHT]: 8,
  [UnitClasses.MEDIUM]: 7,
  [UnitClasses.HEAVY]: 1,
  [UnitClasses.BUILDING]: 6,
};
const visionRange = 300;
const attackRange = 200;
const attackCooldown = 500;
const unitClass = UnitClasses.LIGHT;
const speed = 2;
const buildTime = 500;
const cost = 200;

export class Infantry extends Unit {
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
      group: UnitGroups.fighter,
      cost,
    });
    this.initSprites();
    this.initAnimations(animationFrames, this.sprite);
  }

  initSprites() {
    const {  sprite } = getSpritePositions(
      30,
      24,
      this.height,
      8,
      29,
      "./assets/units/trooper.png"
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

    const col = Math.round(degree / slice);
    const colAdjusted = col - 2;

    if (colAdjusted < 0) {
      return col + 6;
    } else if (colAdjusted > 0) {
      return colAdjusted;
    } else {
      return 0;
    }
  }
}
