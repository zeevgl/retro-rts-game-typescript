import { UnitClasses, UnitGroups } from "../unitTypesDefinition";
import { IUnit, Unit } from "../unit";
import {getSpritePositions, Sprite} from "../../utils/sprite";
import {getClosestUnitOfPlayer} from '../../utils/pointsCalc';
import {Refinery} from '../buildings/refinery';

export enum HarvesterState {
  OnRoutToField = "OnRoutToField",
  Harvesting = "Harvesting",
  Returning = "Returning",
  Dumping = "Dumping",
  DumpingWait = "DumpingWait",
  Idle = "Idle",
}

const maxHealth = 1000;
const name = "Harvester";
const width = 120;
const height = 120;
const visionRange = 250;
const attackRange = 0;
const unitClass = UnitClasses.HEAVY;
const speed = 1.1;
const buildTime = 1000;
const cost = 1000;

export interface SpiceField {
  x: number;
  y: number;
  object: any;
}

export class Harvester extends Unit {
  private harvestingState: HarvesterState = HarvesterState.Idle;
  private spiceField: any = null;

  private capacity: number = 1000;
  private harvestSpeed: number = 250;
  private dumpSpeed: number = 3000;
  private dumpSpeedTick: number = 0;
  private spice: number = 0;
  private refinery: any = null;
  private sprite!: Sprite;
  private angle: number = 0;

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
      attackRange,
      unitClass,
      speed,
      buildTime,
      buildAt: Refinery,
      group: UnitGroups.harvesters,
      cost,
    });

    this.initSprites();
  }

  initSprites() {
    const { sprite } = getSpritePositions(
      55,
      55,
      this.height,
      8,
      4,
      "./assets/units/harvester2.png"
    );

    this.sprite = sprite;
  }

  update(deltaTime: number, timestamp: number) {
    super.update(deltaTime, timestamp);
    this.harvest(deltaTime, timestamp);
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }

  drawUnit(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const position = this.degreeToPosition(this.degree);
    this.sprite.draw(ctx, position, this.x, this.y);

    ctx.restore();
  }

  drawUnitRotate(ctx: CanvasRenderingContext2D) {
    //this uses canvas rotate to draw. currently not in use
    ctx.save();

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.translate(cx, cy);
    ctx.rotate(this.angle);
    ctx.translate(-cx, -cy);

    if (
      (this.angle >= 7.8 && this.angle <= 10) ||
      (this.angle >= 3 && this.angle <= 4.6)
    ) {
      ctx.scale(1, -1);
      this.sprite.draw(ctx, 8, this.x, -this.y - this.height);
    } else {
      this.sprite.draw(ctx, 8, this.x, this.y);
    }

    ctx.restore();
  }

  moveTo(x: number, y: number) {
    super.moveTo(x, y);
  }

  setSpiceField(x: number, y: number, object: any) {
    this.spiceField = { x, y, object };
    this.harvestingState = HarvesterState.OnRoutToField;
  }

  stopHarvest() {
    this.spiceField = null;
    this.harvestingState = HarvesterState.Idle;
  }

  returnToSpiceField() {
    this.moveTo(this.spiceField.x, this.spiceField.y);
  }

  harvest(deltaTime: number, _timestamp: number) {
    //TODO:Zeev: this function is TOO LONG
    switch (this.harvestingState) {
      case HarvesterState.OnRoutToField:
        if (this.isInSpiceField()) {
          this.harvestingState = HarvesterState.Harvesting;
        }
        break;
      case HarvesterState.Harvesting:
        if (this.spice < this.capacity) {
          this.spice += this.harvestSpeed / deltaTime;
        } else if (this.spice >= this.capacity) {
          this.harvestingState = HarvesterState.Returning;
          const closestUnit = getClosestUnitOfPlayer(this, this.player, {
            unitTypeClass: Refinery,
          });
          if (closestUnit?.unit) {
            this.refinery = closestUnit.unit;
          }
          if (this.refinery) {
            this.moveTo(this.refinery.centerX, this.refinery.centerY);
          } else {
            this.harvestingState = HarvesterState.Idle;
          }
        }
        break;
      case HarvesterState.Returning:
        if (this.isInRefinery()) {
          this.harvestingState = HarvesterState.Dumping;
        }
        break;
      case HarvesterState.Dumping:
        this.player.resources.addResources(this.spice);
        this.spice = 0;
        this.harvestingState = HarvesterState.DumpingWait;
        break;
      case HarvesterState.DumpingWait:
        this.dumpSpeedTick += deltaTime;
        if (this.dumpSpeedTick >= this.dumpSpeed) {
          this.dumpSpeedTick = 0;
          this.harvestingState = HarvesterState.OnRoutToField;
          this.returnToSpiceField();
        }
        break;
      case HarvesterState.Idle:
        break;
    }
  }

  isInSpiceField() {
    return (
      this.spiceField &&
      this.x < this.spiceField.x + this.spiceField.object.width &&
      this.x + this.width > this.spiceField.x &&
      this.y < this.spiceField.y + this.spiceField.object.height &&
      this.y + this.height > this.spiceField.y
    );
  }

  isInRefinery() {
    return (
      this.refinery &&
      this.x < this.refinery.x + this.refinery.width &&
      this.x + this.width > this.refinery.x &&
      this.y < this.refinery.y + this.refinery.height &&
      this.y + this.height > this.refinery.y
    );
  }
}
