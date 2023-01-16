import { Game } from "../game";
import { DEBUG_MODE } from "../config";
import { Level } from "./level";
import {ContractionYard} from '../units/buildings/contractionYard';

export class GameMap {
  public readonly mapWidth: number;
  public readonly mapHeight: number;
  public level: Level;

  constructor(private game: Game) {
    this.level = new Level(window.TileMaps.map2, "assets");

    this.mapWidth = this.level.getWidth();
    this.mapHeight = this.level.getHeight();

    this.initPlayers();
  }

  update(deltaTime: number, timestamp: number) {
    this.level.update(deltaTime, timestamp);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.level.draw(ctx);

    if (DEBUG_MODE) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, this.mapWidth, this.mapHeight);
      ctx.lineWidth = 30;
      ctx.strokeStyle = "purple";
      ctx.stroke();
      ctx.restore();
    }
  }

  initPlayers() {
    this.initHumanPlayer();
    this.initAiPlayer();
  }

  initHumanPlayer() {
    const { humanPlayer } = this.game;
    const { x, y } = this.level.getHumanPlayerPosition();

    humanPlayer.addUnit(
      new ContractionYard({
        player: humanPlayer,
        x,
        y,
        color: humanPlayer.color,
      })
    );

    // humanPlayer.addUnit(
    //   new Barracks({
    //     player: humanPlayer,
    //     x: x + 220,
    //     y: y + 10,
    //     color: humanPlayer.color,
    //   })
    // );
    // humanPlayer.addUnit(
    //   new Refinery({
    //     player: humanPlayer,
    //     x: x + 420,
    //     y: y + 30,
    //     color: humanPlayer.color,
    //   })
    // );
    //
    // humanPlayer.addUnit(
    //   new Infantry({
    //     player: humanPlayer,
    //     x: 160 + x,
    //     y: 280 + y,
    //     color: humanPlayer.color,
    //   })
    // );
    // humanPlayer.addUnit(
    //   new Rocketeer({
    //     player: humanPlayer,
    //     x: 160 + x + 80,
    //     y: 200 + y,
    //     color: humanPlayer.color,
    //   })
    // );
  }

  initAiPlayer() {
    const { aiPlayers } = this.game;
    const positions = this.level.getAiPlayersPositions();
    aiPlayers.forEach((player, index) => {
      player.addUnit(
        new ContractionYard({
          player: aiPlayers,
          x: positions[index].x,
          y: positions[index].y,
          color: player.color,
        })
      );

      // player.addUnit(
      //   new Barracks(
      //     aiPlayers,
      //     positions[index].x + 120,
      //     positions[index].y + 10,
      //     player.color
      //   )
      // );
      //
      // player.addUnit(
      //   new Rocketeer(
      //     aiPlayers,
      //     positions[index].x - 100,
      //     positions[index].y,
      //     player.color
      //   )
      // );
      // player.addUnit(
      //   new Rocketeer(
      //     aiPlayers,
      //     300,
      //     300,
      //     player.color
      //   )
      // );

      // player.addUnit(
      //   new Rocketeer(
      //     aiPlayers,
      //     300,
      //     300,
      //     player.color
      //   )
      // );

      // player.addUnit(
      //   new Rocketeer({ player: aiPlayers, x: 500, y: 500, color: player.color })
      // );
    });
  }
}
