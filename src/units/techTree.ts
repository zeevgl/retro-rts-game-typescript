import {Player} from '../player/player';
import {Unit} from './unit';
import {UnitGroups} from './unitTypesDefinition';
import {ContractionYard} from './buildings/contractionYard';
import {Refinery} from './buildings/refinery';
import {Barracks} from './buildings/barracks';
import {Infantry} from './units/infantry';
import {Rocketeer} from './units/rocketeer';
import {Harvester} from './units/harvester';

export interface ITechTreeItem {
  unit: Unit,
  class: any,
  isVisible: boolean,
  isUnlocked: () => boolean,
  exists?: boolean,

}

export class TechTree {
  private buildings: ITechTreeItem[];
  private units: ITechTreeItem[];
  constructor(private player: Player) {
    this.init();
  }

  init() {
    this.buildings = [
      {
        unit: new ContractionYard({ x: 0, y: 0, color: "gray" }),
        class: ContractionYard,
        isVisible: false,
        isUnlocked: () => false,
        exists: true,
      },
      {
        unit: new Refinery({ x: 0, y: 0, color: "gray" }),
        class: Refinery,
        isVisible: true,
        isUnlocked: () => this.checkDependencies([ContractionYard]),
        exists: false,
      },
      {
        unit: new Barracks({ x: 0, y: 0, color: "gray" }),
        class: Barracks,
        isVisible: true,
        isUnlocked: () => this.checkDependencies([ContractionYard]),
        exists: false,
      },
    ];

    this.units = [
      {
        unit: new Infantry({ x: 0, y: 0, color: "gray" }),
        class: Infantry,
        isVisible: true,
        isUnlocked: () => this.checkDependencies([Barracks]),
      },
      {
        unit: new Rocketeer({ x: 0, y: 0, color: "gray" }),
        class: Rocketeer,
        isVisible: true,
        isUnlocked: () => this.checkDependencies([Barracks]),
      },
      {
        unit: new Harvester({ x: 0, y: 0, color: "gray" }),
        class: Harvester,
        isVisible: true,
        isUnlocked: () => this.checkDependencies([Refinery]),
      },
    ];
  }

  checkDependencies(dependencies: any) {
    return dependencies.every((dependency: any) => {
      return this.buildings.some((building) => {
        return building.unit instanceof dependency && building.exists;
      });
    });
  }

  getVisibleUnits() {
    return this.units.filter((unit) => unit.isVisible);
  }

  getVisibleFightingUnits() {
    return this.units.filter(
      (unit) => unit.isVisible && unit.unit.group === UnitGroups.fighter
    );
  }

  getVisibleBuildings() {
    return this.buildings.filter((building) => building.isVisible);
  }

  getHarvester() {
    return this.units.find((unit) => unit.unit instanceof Harvester);
  }

  updateTechTree(unit: Unit) {
    if (unit.isABuilding()) {
      this.buildings.forEach((building) => {
        if (unit instanceof building.class) {
          building.exists = true;
        }
      });
    }
  }
}
