import { Game } from "../game";

export class Player {
  public readonly units: [];
  public readonly unitByGroups: []; //UnitGroups
  public readonly selectedUnits: [];

  constructor(
    private name: string,
    public color: string,
    public startingPoint: any,
    private game: Game
  ) {
    this.techTree = new TechTree(this);
    this.productionManager = new ProductionManager(this);
    this.resources = new Resources(this);
  }

  update(deltaTime: number, timestamp: number) {
    this.units.forEach((unit) => {
      unit.update(deltaTime, timestamp);
      this.updateUnitAi(unit);

      if (!unit.isAlive) {
        if (unit.isDecaying) {
          //TODO: add some decay animation & timer
          this.removeUnit(unit);
        } else {
          unit.isDecaying = true;
          this.selectedUnits.splice(this.selectedUnits.indexOf(unit), 1);
        }
      }
    });

    this.productionManager.update(deltaTime, timestamp);
    this.resources.update(deltaTime, timestamp);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.units.forEach((unit) => {
      if (
        this.game.hud.isInsideViewport(unit.x, unit.y, unit.width, unit.height)
      ) {
        unit.draw(ctx);
      }
    });
  }

  addUnit(unit) {
    this.units.push(unit);
    this.techTree.updateTechTree(unit);
    if (!this.unitByGroups[unit.group]) {
      this.unitByGroups[unit.group] = [];
    }
    this.unitByGroups[unit.group].push(unit);
  }

  removeUnit(unit) {
    this.units.splice(this.units.indexOf(unit), 1);
    this.unitByGroups[unit.group].splice(
      this.unitByGroups[unit.group].indexOf(unit),
      1
    );
  }

  attemptToClickUnitAtPoint(x: number, y: number) {
    this.deselectAllUnits();

    const unit = this.getUnitInPoint(x, y); //allow only 1 unit selected for now
    const selectedUnits = unit ? [unit] : [];

    selectedUnits.forEach((unit) => {
      unit.isSelected = true;
    });

    this.selectedUnits = selectedUnits;

    return selectedUnits;
  }

  attemptToSelectUnitsAtRange(x1: number, y1: number, x2: number, y2: number) {
    const rangeSelectableUnits = [
      ...(this.unitByGroups[UnitGroups.fighter] || []),
      ...(this.unitByGroups[UnitGroups.harvesters] || []),
    ];

    const unitsInRange = rangeSelectableUnits.filter((unit) => {
      return unit.isAlive && unit.isInsideRect(x1, y1, x2, y2);
    });

    if (unitsInRange.length) {
      unitsInRange.forEach((unit) => {
        unit.isSelected = true;
      });

      this.selectedUnits = unitsInRange;
    } else {
      this.deselectAllUnits();
    }
  }

  getUnitsInPoint(x: number, y: number) {
    return this.units.filter((unit) => {
      return unit.isAlive && unit.inPointInUnit(x, y);
    });
  }

  getUnitInPoint(x: number, y: number) {
    for (let i = 0; i < this.units.length; i++) {
      if (this.units[i].isAlive && this.units[i].inPointInUnit(x, y)) {
        return this.units[i];
      }
    }

    return null;
  }

  deselectAllUnits() {
    this.selectedUnits.forEach((unit) => {
      unit.isSelected = false;
    });

    this.selectedUnits = [];
  }

  moveSelectedUnitsToPosition(x, y, destinationObject = null) {
    if (this.selectedUnits.length) {
      this.selectedUnits.forEach((unit) => {
        unit.moveTo(x, y);

        if (unit instanceof Harvester) {
          if (destinationObject?.type === MapObjects.SPICE) {
            unit.setSpiceField(x, y, destinationObject.object);
          } else {
            unit.stopHarvest();
          }
        }
      });
    }
  }

  attack(enemyUnit) {
    if (enemyUnit) {
      this.selectedUnits.forEach((unit) => {
        unit.attack(enemyUnit);
      });
    }
  }

  updateUnitAi(unit) {
    //WIP...
    //player needs to know which player is the enemy
    //should this code even be in player object? maybe in game object? or in unit object?

    if (unit instanceof Harvester) {
      return; //for now. harvester AI is not implemented
    }

    let enemy = null;
    if (this.name === "player 1") {
      enemy = this.game.aiPlayers[0];
    } else if (this.name === "player 2") {
      enemy = this.game.humanPlayer;
    }

    if (enemy && unit.state === UnitStates.IDLE) {
      const closestEnemyUnit = getClosestUnitOfPlayer(unit, enemy, {
        ignoreVisionRange: false,
      });
      if (closestEnemyUnit) {
        //attack directly as unit not a player
        unit.attack(closestEnemyUnit.unit);
      }
    }
  }
}
