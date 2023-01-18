
export enum MapObjects {
  SPICE = "SPICE",
  TERRAIN = "TERRAIN",
}

export interface MapObject {
  tilesets: any[];
  height: number;
  width: number;
  layers: MapLayer[];
}

export enum LayerTypes {
  TILE_LAYER = "tilelayer",
  OBJECT_GROUP = "objectgroup",
}

export interface MapLayer {
  data?: number[];
  objects?: LayerObject[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: LayerTypes;
  visible: true;
  width: 80;
  x: 0;
  y: 0;
}

export interface LayerObject {
  class: string;
  height: number;
  id: number;
  name: string;
  rotation: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface Objects {
  playerPositions: MapLayer | null;
  spiceFields: MapLayer | null;
}

export interface Tiles {
  ground: MapLayer | null;
}
