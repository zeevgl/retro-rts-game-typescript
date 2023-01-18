import { DEBUG_MODE } from "../config";
import { calcDistance } from "../utils/pointsCalc";
import { getSpritePositions, Sprite } from "../utils/sprite";
import {
  LayerObject,
  MapObject,
  MapObjects,
  Objects,
  Tiles,
} from "./mapDefinitions";

export class Level {
  private tileSize: number = 32;
  private sprite!: Sprite;
  private tiles: Tiles;
  private objects: Objects = {
    playerPositions: null,
    spiceFields: null,
  };
  private tileSizeMultiplier: number;

  constructor(private map: MapObject, private readonly assetsFolder: string) {
    this.tiles = {
      ground: null,
    };

    const originalTileSize = this.map.tilesets[0].tilewidth;
    this.tileSizeMultiplier = this.tileSize / originalTileSize;
    this.initSprite();
    this.initLayers();
  }

  update(_deltaTime: number, _timestamp: number) {}

  draw(context: CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.getTile(this.tiles.ground?.data!, x, y);
        if (tile !== 0) {
          this.sprite.draw(
            context,
            tile - 1,
            x * this.tileSize,
            y * this.tileSize
          );
        }
      }
    }
    DEBUG_MODE && this.drawObjects(context);
  }

  private drawObjects(context: CanvasRenderingContext2D) {
    this.objects.spiceFields?.objects!.forEach((p: LayerObject) => {
      context.strokeRect(p.x, p.y, p.width, p.height);
    });

    this.objects.playerPositions?.objects!.forEach((p: LayerObject) => {
      context.strokeRect(p.x, p.y, p.width, p.height);
    });
  }

  private getTile(tiles: number[], col: number, row: number) {
    //int oneDindex = (row * length_of_row) + column; // Indexes
    const index = row * this.map.width + col;
    return tiles[index];
  }

  initSprite() {
    const tileset = this.map.tilesets[0];
    const { sprite } = getSpritePositions(
      tileset.tilewidth,
      tileset.tileheight,
      this.tileSize,
      tileset.columns,
      tileset.columns,
      `${this.assetsFolder}/${tileset.image}`
    );
    this.sprite = sprite;
  }

  initLayers() {
    this.tiles.ground = this.map.layers.find(
      (layer) => layer.name === "ground"
    )!;
    this.objects.playerPositions = this.map.layers.find(
      (layer) => layer.name === "players_positions"
    )!;
    this.objects.spiceFields = this.map.layers.find(
      (layer) => layer.name === "spice"
    )!;

    this.objects.playerPositions.objects = this.adjustObjectsTileSizeMultiplier(
      this.objects.playerPositions.objects!
    );
    this.objects.spiceFields.objects = this.adjustObjectsTileSizeMultiplier(
      this.objects.spiceFields.objects!
    );
  }

  adjustObjectsTileSizeMultiplier(objects: LayerObject[]) {
    return objects.map((object) => {
      return {
        ...object,
        x: object.x * this.tileSizeMultiplier,
        y: object.y * this.tileSizeMultiplier,
        width: object.width * this.tileSizeMultiplier,
        height: object.height * this.tileSizeMultiplier,
      };
    });
  }

  getWidth() {
    return this.map.width * this.tileSize;
  }

  getHeight() {
    return this.map.height * this.tileSize;
  }

  getHumanPlayerPosition() {
    const position = this.objects.playerPositions!.objects!.find(
      (p) => p.name === "player1"
    );

    return {
      x: position?.x,
      y: position?.y,
    };
  }

  getAiPlayersPositions() {
    return this.objects
      .playerPositions!.objects!.filter((p) => p.name !== "player1")
      .map((o) => ({
        x: o.x,
        y: o.y,
      }));
  }

  getWhatIsOnPosition(x: number, y: number) {
    for (let i = 0; i < this.objects.spiceFields!.objects!.length; i++) {
      const spice = this.objects.spiceFields!.objects![i];
      if (
        x >= spice.x &&
        x <= spice.x + spice.width &&
        y >= spice.y &&
        y <= spice.y + spice.height
      ) {
        return {
          type: MapObjects.SPICE,
          object: spice,
        };
      }
    }

    return {
      type: MapObjects.TERRAIN,
      object: null,
    };
  }

  getClosestSpiceFieldByPosition(x: number, y: number) {
    return this.objects.spiceFields!.objects!.reduce(
      (closest: any, spice: LayerObject) => {
        const distance = calcDistance(x, y, spice.x, spice.y);
        if (closest === null || distance < closest.distance) {
          return { spice, distance };
        }
        return closest;
      },
      { spice: null, distance: Number.MAX_VALUE }
    ).spice;
  }
}
