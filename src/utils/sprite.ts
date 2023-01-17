import { DEBUG_MODE } from "../config";

export class Sprite {
  public sizeH: number;
  constructor(
    private img: HTMLImageElement,
    public width: number,
    public height: number,
    public positions: SpritePosition[],
    public sizeW: number,
    sizeH?: number | null
  ) {
    this.sizeH = sizeH || sizeW;
  }

  draw(ctx: CanvasRenderingContext2D, position: number, x: number, y: number) {
    const pos = this.positions[position];
    if (pos) {
      ctx.drawImage(
        this.img,
        pos.x,
        pos.y,
        pos.width,
        pos.height,
        x,
        y,
        this.sizeW,
        this.sizeH
      );

      DEBUG_MODE && ctx.strokeRect(x, y, this.sizeW, this.sizeH);
    }
  }
}

export function drawAllSpritePositions(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  itemSize: number,
  cols: number,
  rows: number
) {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      sprite.draw(ctx, y * rows + x, x * itemSize, y * itemSize);
    }
  }
}

/*
used for even spread sprites
return {
  positions: [[],[]],
  sprite: Sprite

}
*/
export function getSpritePositions(
  singelItemWidth: number,
  singelItemHeight: number,
  singleItemSizeWidth: number,
  cols: number,
  rows: number,
  filePath: string,
  singleItemSizeHeight: number | null = null
) {
  const positions: SpritePosition[] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      positions.push({
        x: i * singelItemWidth,
        y: j * singelItemHeight,
        width: singelItemWidth,
        height: singelItemHeight,
      });
    }
  }

  const img = new Image();
  img.src = filePath;

  const sprite = new Sprite(
    img,
    singelItemWidth,
    singelItemHeight,
    positions,
    singleItemSizeWidth,
    singleItemSizeHeight
  );

  return {
    positions,
    sprite,
  };
}

export function getSpriteByPositions(
  singleItemSize: number,
  positions: SpritePosition[],
  filePath: string
) {
  const img = new Image();
  img.src = filePath;

  const sprite = new Sprite(img, 0, 0, positions, singleItemSize);

  return {
    positions,
    sprite,
  };
}

export interface SpritePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
