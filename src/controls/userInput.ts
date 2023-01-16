import { Game } from "../game";
import { calcDistance } from "../utils/pointsCalc";
import { MouseHandler, MousePosition } from "./mouse";

export enum UserInputStates {
  IDLE = "IDLE",
  PLACE_BUILDING = "PLACE_BUILDING",
}

interface IDragging {
  active: boolean;
  moved: boolean;
  x: number;
  y: number;
  x2: number;
  y2: number;
}

export class UserInput {
  private dragging: IDragging = {
    active: false,
    moved: false,
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
  };

  private state: UserInputStates = UserInputStates.IDLE;
  private mouseHandler: MouseHandler;

  constructor(private game: Game) {
    this.mouseHandler = new MouseHandler(game);
    this.targetXY = null;
    this.initMouseHandlers();
  }

  initMouseHandlers() {
    this.mouseHandler.handlers.onMouseLeftClicked =
      this.onMouseLeftClicked.bind(this);
    this.mouseHandler.handlers.onMouseRightClicked =
      this.onMouseRightClicked.bind(this);
    this.mouseHandler.handlers.onMouseMove = this.onMouseMove.bind(this);

    this.mouseHandler.handlers.onMouseDown = this.onMouseDown.bind(this);
    this.mouseHandler.handlers.onMouseUp = this.onMouseUp.bind(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.targetXY !== null) {
      ctx.beginPath();
      ctx.arc(this.targetXY.x, this.targetXY.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#000000";
      ctx.stroke();
    }

    if (this.state === UserInputStates.PLACE_BUILDING) {
      const newUnit =
        this.game.humanPlayer.productionManager.buildingProduction.item.unit;
      newUnit.color = "gray";
      newUnit.x = this.mouseHandler.position.x;
      newUnit.y = this.mouseHandler.position.y;
      newUnit.draw(ctx);
    }

    this.drawSelectionBox(ctx);
  }

  drawSelectionBox(ctx: CanvasRenderingContext2D) {
    if (this.dragging.active) {
      ctx.beginPath();
      ctx.rect(
        this.dragging.x,
        this.dragging.y,
        this.dragging.x2 - this.dragging.x,
        this.dragging.y2 - this.dragging.y
      );
      ctx.strokeStyle = "lightgreen";
      ctx.stroke();
    }
  }

  onMouseLeftClicked({ x, y }: MousePosition) {
    debugger
    if (this.dragging.moved) {
      this.dragging.moved = false;
      return;
    }

    const actionMenuItem = this.game.hud.actionMenu.getItemAtXy({ x, y });
    const positionFromMiniMap = this.game.hud.miniMap.getPositionFromMiniMap(
      x,
      y
    );
    if (actionMenuItem) {
      this.handleActionMenuItem(actionMenuItem);
    } else if (positionFromMiniMap) {
      this.game.camera.moveCameraTo(
        positionFromMiniMap.x,
        positionFromMiniMap.y
      );
    } else if (this.state === UserInputStates.PLACE_BUILDING) {
      this.game.humanPlayer.productionManager.placeBuilding(x, y);
      this.state = UserInputStates.IDLE;
    } else {
      const units = this.game.humanPlayer.attemptToClickUnitAtPoint(x, y);
      if (units.length) {
        console.log("unit clicked");
      }
    }
  }

  onMouseRightClicked({ x, y }: MousePosition) {
    if (this.game.humanPlayer.selectedUnits.length) {
      this.whatWasClicked(x, y);
    }
  }

  whatWasClicked(x: number, y: number) {
    //is it an enemy unit?
    const unitClicked = this.getEnemyUnitInPoint(x, y);
    if (unitClicked) {
      this.game.humanPlayer.attack(unitClicked);
    } else {
      //TODO: maybe move "getWhatIsOnPosition" into player?
      const destinationObject = this.game.gameMap.level.getWhatIsOnPosition(
        x,
        y
      );
      this.game.humanPlayer.moveSelectedUnitsToPosition(
        x,
        y,
        destinationObject
      );

      //is it a terrain?
      //move to position
      this.targetXY = {
        x,
        y,
      };
      window.setTimeout(() => {
        this.targetXY = null;
      }, 150);
    }
    //is it a friendly unit?
    //is it a building?
    //is it a resource?
    //is it a resource?
    //is it a terrain?
  }

  getEnemyUnitInPoint(x: number, y: number) {
    const aiPlayers = this.game.aiPlayers;
    for (let i = 0; i < aiPlayers.length; i++) {
      const unit = aiPlayers[i].getUnitsInPoint(x, y);
      if (unit.length) {
        return unit[0];
      }
    }

    return null;
  }

  onMouseMove({ x, y }: MousePosition) {
    this.handleMouseDrag(x, y);

    if (this.game.camera.scrollCamera(x, y)) {
      this.mouseHandler.setMouseScroll();
    } else if (this.game.humanPlayer.getUnitsInPoint(x, y).length) {
      this.mouseHandler.setMouseSelect();
    } else if (this.getEnemyUnitInPoint(x, y)) {
      this.mouseHandler.setMouseAttack();
    } else {
      this.mouseHandler.setMouseDefault();
    }
  }

  handleActionMenuItem(actionMenuItem) {
    if (!actionMenuItem.isUnlocked()) {
      this.game.hud.notifications.notify(Messages.unavailable);
      return;
    }

    if (actionMenuItem.unit.isABuilding()) {
      if (
        this.game.humanPlayer.productionManager.isBuildingReadyToBePlace(
          actionMenuItem
        )
      ) {
        this.state = UserInputStates.PLACE_BUILDING;
      } else {
        const message =
          this.game.humanPlayer.productionManager.startBuilding(actionMenuItem);
        if (message) {
          this.game.hud.notifications.notify(message);
        }
      }
    } else {
      const message =
        this.game.humanPlayer.productionManager.startUnit(actionMenuItem);
      if (message) {
        this.game.hud.notifications.notify(message);
      }
    }
  }

  handleMouseDrag(x: number, y: number) {
    if (this.dragging.active) {
      if (
        !this.dragging.moved &&
        calcDistance(x, y, this.dragging.x, this.dragging.y) > 10
      ) {
        this.dragging.moved = true;
      }

      this.dragging.x2 = x;
      this.dragging.y2 = y;
    }
  }

  onMouseDown({ x, y }: MousePosition) {
    if (this.game.hud.isInsideViewport(x, y, 0, 0)) {
      this.dragging.active = true;
      this.dragging.moved = false;
      this.dragging.x = x;
      this.dragging.y = y;
      this.dragging.x2 = x;
      this.dragging.y2 = y;
    }
  }

  onMouseUp() {
    this.dragging.active = false;
    if (this.dragging.moved) {
      const x1 = Math.min(this.dragging.x, this.dragging.x2);
      const x2 = Math.max(this.dragging.x, this.dragging.x2);
      const y1 = Math.min(this.dragging.y, this.dragging.y2);
      const y2 = Math.max(this.dragging.y, this.dragging.y2);

      this.game.humanPlayer.attemptToSelectUnitsAtRange(x1, y1, x2, y2);
    }
  }
}
