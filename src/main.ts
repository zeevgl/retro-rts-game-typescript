import "./style.css";
import {Game} from './game';

function initHTML() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <canvas
      id="gameScreen"
      width="1"
      height="1"
      style="border: 1px solid #d3d3d3"
    >
      Your browser does not support the HTML5 canvas tag.
    </canvas>
`;
}

function initGame() {
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;

  initHTML();

  const canvas: HTMLCanvasElement = document.getElementById("gameScreen") as HTMLCanvasElement;
  canvas.setAttribute("width", GAME_WIDTH.toString());
  canvas.setAttribute("height", GAME_HEIGHT.toString());
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  const game = new Game(GAME_WIDTH, GAME_HEIGHT, canvas);

  let lastTime = 0;

  function gameLoop(timestamp: number) {
    /*
      deltaTime - milliseconds since last frame
      deltaTime / 1000 - seconds since last frame
     */
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime, timestamp);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

initGame();
