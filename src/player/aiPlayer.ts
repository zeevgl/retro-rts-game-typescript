import { Player } from "./player";
import { Game } from "../game";

export enum AiStates {
  IDLE = "IDLE",
  SEARCHING = "SEARCHING",
  ATTACK = "ATTACK",
  MOVING = "MOVING",
  DEFEND = "DEFEND",
}

export class AiPlayer extends Player {
  public state: AiStates = AiStates.IDLE;
  constructor(name: string, color: string, startingPoint: any, game: Game) {
    super(name, color, startingPoint, game);
  }

  update(deltaTime: number, timestamp: number) {
    super.update(deltaTime, timestamp);
    //search for enemy units
    //if ()
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}
