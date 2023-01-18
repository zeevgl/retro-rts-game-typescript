import { UnitClasses, UnitGroups, UnitStates } from "../unitTypesDefinition";
import { IUnit, Unit } from "../unit";
import { getSpritePositions, Sprite } from "../../utils/sprite";

const animationFrames = {
  [UnitStates.SPAWN]: {
    start: 0,
    length: 18,
    loop: false,
    frameDuration: 80,
    next: UnitStates.IDLE,
  },
  [UnitStates.IDLE]: {
    start: 20,
    length: 9,
    frameDuration: 80,
    loop: true,
  },
};

const maxHealth = 400;
const name = "Barracks";
const width = 150;
const height = 150;
const visionRange = 100;
const unitClass = UnitClasses.BUILDING;
const buildTime = 900;
const cost = 600;

export class Barracks extends Unit {
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
      257,
      211,
      this.height,
      10,
      4,
      "./assets/units/barracks.png"
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
