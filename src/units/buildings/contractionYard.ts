import { UnitClasses, UnitGroups, UnitStates } from "../unitTypesDefinition";
import { IUnit, Unit } from "../unit";
import {getSpritePositions} from '../../utils/sprite';

const animationFrames = {
  [UnitStates.SPAWN]: {
    // start: 17,
    // length: 15,
    start: 0,
    length: 32,
    frameDuration: 80,
    next: UnitStates.IDLE,
  },
  [UnitStates.IDLE]: {
    start: 32,
    length: 0,
    frameDuration: 80,
  },
};

const maxHealth = 1000;
const name = "ContractionYard";
const width = 200;
const height = 200;
const visionRange = 150;
const unitClass = UnitClasses.BUILDING;
const buildTime = 10000;
const cost = 1000;

export class ContractionYard extends Unit {
  private sprite: any;
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
      visionRange,
      unitClass,
      buildTime,
      group: UnitGroups.buildings,
      cost,
    });

    this.initSprites();
    this.initAnimations(animationFrames, this.sprite);
  }

  initSprites() {
    const { sprite } = getSpritePositions(
      389,
      258,
      this.height,
      8,
      11,
      "./assets/units/construction_yard.png"
    );

    this.sprite = sprite;
  }

  drawUnit(ctx: CanvasRenderingContext2D) {
    this.sprite.draw(
      ctx,
      this.activeAnimation!.getActiveFrame(),
      this.x,
      this.y
    );
  }
}
