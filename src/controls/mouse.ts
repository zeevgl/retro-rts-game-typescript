import { Game } from "../game";

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;

export interface MousePosition {
  x: number;
  y: number;
}

export interface MouseHandlers {
  onMouseLeftClicked?: (position: MousePosition) => void;
  onMouseRightClicked?: (position: MousePosition) => void;
  onMouseMove?: (position: MousePosition) => void;
  onMouseDown?: (position: MousePosition) => void;
  onMouseUp?: (position: MousePosition) => void;
}

export class MouseHandler {
  public position: MousePosition;
  public handlers: MouseHandlers = {};
  constructor(private game: Game) {
    this.position = { x: 0, y: 0 };

    this.game.canvas.addEventListener("click", this.onClick.bind(this));
    this.game.canvas.addEventListener("contextmenu", this.onClick.bind(this));
    this.game.canvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    this.game.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.game.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));

    this.setMouseDefault();
  }

  draw(_context: CanvasRenderingContext2D) {}

  getXY(event: MouseEvent) {
    const rect = this.game.canvas.getBoundingClientRect();
    const x = this.game.camera.x + event.clientX - rect.left;
    const y = this.game.camera.y + event.clientY - rect.top;
    return { x, y };
  }

  setMouseAttack() {
    this.game.canvas.style.cursor = "crosshair";
  }

  setMouseSelect() {
    this.game.canvas.style.cursor = "grab";
  }

  setMouseDefault() {
    this.game.canvas.style.cursor = "default";
  }

  setMouseScroll() {
    this.game.canvas.style.cursor = "all-scroll";
  }

  onClick(event: MouseEvent) {
    event.preventDefault();
    const { x, y } = this.getXY(event);
    if (event.button === LEFT_BUTTON) {
      this.handlers.onMouseLeftClicked?.({ x, y });
    } else if (event.button === RIGHT_BUTTON) {
      this.handlers.onMouseRightClicked?.({ x, y });
    }
  }

  handleMouseMove(event: MouseEvent) {
    const { x, y } = this.getXY(event);
    this.position = {
      x,
      y,
    };
    this.handlers.onMouseMove?.({ x, y });
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (event.button === LEFT_BUTTON) {
      const { x, y } = this.getXY(event);
      this.handlers.onMouseDown?.({ x, y });
    }
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    if (event.button === LEFT_BUTTON) {
      const { x, y } = this.getXY(event);
      this.handlers.onMouseUp?.({ x, y });
    }
  }
}
