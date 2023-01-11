import { DEBUG_MODE } from "./config";
import { drawText } from "./utils/canvas";
import { Camera } from "./camera";
import { UserInput } from "./controls/userInput";
import { Hud } from "./hud/hud";

enum GameStates {
  PLAYING,
  PAUSED,
  MENU,
  GAME_OVER,
  WIN,
}

export class Game {
  private state: GameStates;
  private userInput: UserInput;
  public camera: Camera;
  public hud: Hud;

  constructor(
    public readonly gameWidth: number,
    public readonly gameHeight: number,
    public readonly canvas: HTMLCanvasElement
  ) {
    this.camera = new Camera(this);
    this.userInput = new UserInput(this);
    this.hud = new Hud(this);
    this.humanPlayer = new Player({
      name: "player 1",
      color: "#00ff00",
      startingPoint: { x: 50, y: 80 },
      game: this,
    });
    this.aiPlayers = [
      new AiPlayer({
        name: "player 2",
        color: "#ff0000",
        startingPoint: { x: 500, y: 400 },
        game: this,
      }),
    ];
    this.enemyAI = new EnemyAI(this);
    this.gameMap = new GameMap(this);

    [this.humanPlayer, ...this.aiPlayers].forEach((player) => {
      player.resources.addResources(3000);
    });

    this.state = GameStates.PLAYING;
  }

  update(deltaTime: number, timestamp: number) {
    if (this.state === GameStates.PLAYING) {
      [this.humanPlayer, ...this.aiPlayers].forEach((player) => {
        player.update(deltaTime, timestamp);
      });

      this.enemyAI.update(deltaTime, timestamp);
      this.hud.update(deltaTime, timestamp);
      this.camera.update(deltaTime, timestamp);
      this.checkWinLoose();
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();

    if (this.state === GameStates.PLAYING) {
      this.camera.draw(context);

      this.drawBackground(context);
      this.gameMap.draw(context);

      this.userInput.draw(context);

      [this.humanPlayer, ...this.aiPlayers].forEach((player) => {
        player.draw(context);
      });

      this.hud.draw(context);
    } else {
      this.renderWinLoose(context);
    }

    this.renderWinLoose(context);
    context.restore();
  }

  drawBackground(context: CanvasRenderingContext2D) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, this.gameWidth, this.gameHeight);

    DEBUG_MODE && this.drawRect(context);
  }

  drawRect(context: CanvasRenderingContext2D) {
    for (let i = 0; i < this.gameMap.mapWidth; i++) {
      context.fillStyle = i % 2 === 0 ? "#ff0000" : "#00ff00";
      context.fillRect(50 * i + i * 50, 0, 10, 800);
    }

    for (let i = 0; i < this.gameMap.mapHeight; i++) {
      context.fillStyle = i % 2 === 0 ? "yellow" : "black";
      context.fillRect(0, 50 * i + i * 50, 800, 10);
    }
  }

  checkWinLoose() {
    if (this.humanPlayer.units.length === 0) {
      this.state = GameStates.GAME_OVER;
    } else if (this.aiPlayers.every((player) => player.units.length === 0)) {
      this.state = GameStates.WIN;
    }
  }

  renderWinLoose(context: CanvasRenderingContext2D) {
    if (this.state === GameStates.GAME_OVER) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, this.gameWidth, this.gameHeight);
      drawText(
        context,
        "You loose",
        this.gameWidth / 2,
        this.gameHeight / 2,
        "black",
        "center",
        "50px Arial"
      );
    } else if (this.state === GameStates.WIN) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, this.gameWidth, this.gameHeight);
      drawText(
        context,
        "You WIN",
        this.gameWidth / 2,
        this.gameHeight / 2,
        "black",
        "center",
        "50px Arial"
      );
    }
  }
}
