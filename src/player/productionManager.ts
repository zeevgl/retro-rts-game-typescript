import { Player } from "./player";
import { Messages } from "../hud/messages";
import { ITechTreeItem } from "../units/techTree";
import { Unit } from "../units/unit";

export enum ProductionStates {
  IDLE = "IDLE",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
}

export interface IProductionItem {
  item: ITechTreeItem | null;
  tick: number;
  state: ProductionStates;
}

export class ProductionManager {
  public buildingProduction: IProductionItem;
  public unitProduction: IProductionItem;
  constructor(private player: Player) {
    this.resetBuildingProduction();
    this.resetUnitProduction();
  }

  resetBuildingProduction() {
    this.buildingProduction = {
      item: null,
      tick: 0,
      state: ProductionStates.IDLE,
    };
  }

  resetUnitProduction() {
    this.unitProduction = {
      item: null,
      tick: 0,
      state: ProductionStates.IDLE,
    };
  }

  update(deltaTime: number, timestamp: number) {
    if (this.isBuildingInProgress()) {
      this.buildingProduction.tick += deltaTime;
      if (
        this.buildingProduction.tick >
        this.buildingProduction.item!.unit.buildTime
      ) {
        this.buildingProduction.state = ProductionStates.READY;
      }
    } else if (this.isUnitInProgress()) {
      this.unitProduction.tick += deltaTime;
      if (this.unitProduction.tick > this.unitProduction.item!.unit.buildTime) {
        const building = this.getUnitsProductionBuilding(
          this.unitProduction.item!.unit
        );
        this.spawnUnitAtBuilding(this.unitProduction.item!.class, building);
      }
    }
  }

  startBuilding(item: ITechTreeItem) {
    if (!this.isBuildingInProgress()) {
      if (!this.player.resources.canAfford(item.unit.cost)) {
        console.log("not enough resources");
        return Messages.insufficientFunds;
      }

      this.buildingProduction = {
        item: item,
        tick: 0,
        state: ProductionStates.IN_PROGRESS,
      };

      this.player.resources.deductResources(item.unit.cost);
    } else {
      console.log("unable to comply building in progress");
      return Messages.buildingInProgress;
    }
  }

  startUnit(item: ITechTreeItem) {
    if (!this.isUnitInProgress()) {
      if (!this.player.resources.canAfford(item.unit.cost)) {
        console.log("not enough resources");
        return Messages.insufficientFunds;
      }

      this.unitProduction = {
        item: item,
        tick: 0,
        state: ProductionStates.IN_PROGRESS,
      };

      this.player.resources.deductResources(item.unit.cost);
    } else {
      console.log("unable to comply training in progress");
      return Messages.trainingInProgress;
    }
  }

  isBuildingInProgress() {
    return this.buildingProduction.state === ProductionStates.IN_PROGRESS;
  }

  isUnitInProgress() {
    return this.unitProduction.state === ProductionStates.IN_PROGRESS;
  }

  isItemInProgress(item: ITechTreeItem) {
    const isItemIsABuildingProgress =
      !item.unit.isABuilding() &&
      this.isUnitInProgress() &&
      item.unit.name === this.unitProduction.item!.unit.name;

    const isItemIsAnUnitProgress =
      item.unit.isABuilding() &&
      this.isBuildingInProgress() &&
      item.unit.name === this.buildingProduction.item!.unit.name;

    return isItemIsABuildingProgress || isItemIsAnUnitProgress;
  }

  getProgress(item: ITechTreeItem) {
    if (item.unit.isABuilding()) {
      return this.buildingProduction.tick / item.unit.buildTime;
    } else {
      return this.unitProduction.tick / item.unit.buildTime;
    }
  }

  isBuildingReadyToBePlace(item) {
    return (
      this.buildingProduction.state === ProductionStates.READY &&
      this.buildingProduction.item!.unit.isABuilding() &&
      this.buildingProduction.item!.unit.name === item.unit.name
    );
  }

  isAnyBuildingReadyToBePlace() {
    return (
      this.buildingProduction.state === ProductionStates.READY &&
      this.buildingProduction.item!.unit.isABuilding()
    );
  }

  getUnitsProductionBuilding(unit: Unit) {
    return this.player.units.find((u: Unit) => {
      if (u.isABuilding() && u instanceof unit.buildAt) {
        return u;
      }

      return null;
    });
  }

  spawnUnitAtBuilding(unitClass: any, building: Unit) {
    if (building) {
      const newUnit = new unitClass({
        player: this.player,
        x: building.centerX,
        y: building.centerY,
        color: this.player.color,
      });
      this.player.addUnit(newUnit);
      this.resetUnitProduction();

      const randomX = Math.random() * 300 - 50;
      const randomY = Math.random() * 100 + 150;
      newUnit.moveTo(newUnit.x + randomX, newUnit.y + randomY);
    }
  }

  placeBuilding(x: number, y: number) {
    const newUnit = new this.buildingProduction.item!.class({
      player: this.player,
      x,
      y,
      color: this.player.color,
    });
    this.player.addUnit(newUnit);
    //this.state = UserInputStates.IDLE;  //TODO: why do I we need this here?

    this.resetBuildingProduction();
  }
}
