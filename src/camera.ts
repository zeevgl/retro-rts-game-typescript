import { Game } from "./game";

const scrollSpeed = 15;
const hoverOnEdgeTime = 200;

export class Camera {
  private isScrolling: boolean = true;
  private scrollDirectionVertical: number = 0;
  private scrollDirectionHorizontal: number = 0;
  private hoverOnEdgeTick: number = 0;

  constructor(private game: Game, public x = 0, public y = 0) {}

  update(deltaTime: number, _timestamp: number) {
    if (this.isScrolling) {
      if (this.hoverOnEdgeTick < hoverOnEdgeTime) {
        this.hoverOnEdgeTick += deltaTime;
      } else {
        this.x += this.scrollDirectionHorizontal * scrollSpeed;
        this.y += this.scrollDirectionVertical * scrollSpeed;

        this.validateCameraEdges();
      }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.translate(-this.x, -this.y);
  }

  scrollStop() {
    this.isScrolling = false;
    this.scrollDirectionHorizontal = 0;
    this.scrollDirectionVertical = 0;
  }

  scrollRight() {
    this.isScrolling = true;
    this.scrollDirectionHorizontal = 1;
  }

  scrollLeft() {
    this.isScrolling = true;
    this.scrollDirectionHorizontal = -1;
  }

  scrollUp() {
    this.isScrolling = true;
    this.scrollDirectionVertical = -1;
  }

  scrollDown() {
    this.isScrolling = true;
    this.scrollDirectionVertical = 1;
  }

  validateCameraEdges() {
    const { hud, gameMap } = this.game;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + hud.viewport.width > gameMap.mapWidth) {
      this.x = gameMap.mapWidth - hud.viewport.width;
    }

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + hud.viewport.height > gameMap.mapHeight) {
      this.y = gameMap.mapHeight - hud.viewport.height;
    }
  }

  scrollCamera(x: number, y: number) {
    const { hud } = this.game;
    const margin = 25;
    let isOnEdge = false;
    this.scrollStop();

    if (
      x >= this.x + hud.viewport.width - margin &&
      x <= this.x + hud.viewport.width
    ) {
      this.scrollRight();
      isOnEdge = true;
    } else if (x <= this.x + margin && x >= this.x) {
      this.scrollLeft();
      isOnEdge = true;
    }

    if (
      y >= this.y + hud.viewport.height - margin &&
      y <= this.y + hud.viewport.height
    ) {
      this.scrollDown();
      isOnEdge = true;
    } else if (y <= this.y + margin && y >= this.y) {
      this.scrollUp();
      isOnEdge = true;
    }

    if (!isOnEdge) {
      this.hoverOnEdgeTick = 0;
    }

    return isOnEdge;
  }

  adjustPointToCamera(x: number, y: number) {
    return {
      x: x - this.x,
      y: y - this.y,
    };
  }

  moveCameraTo(x, y) {
    this.x = x;
    this.y = y;

    //should be centered
    this.x -= this.game.hud.viewport.width / 2;
    this.y -= this.game.hud.viewport.height / 2;

    this.validateCameraEdges();
  }
}
