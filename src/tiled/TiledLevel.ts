export class TiledLevel {
  tileHeight = 32;
  tileWidth = 32;
  worldWidth = 0;
  worldHeight = 0;
  widthInTiles = 0;
  heightInTiles = 0;
  objects: any[];
  tilesets: any[];
  groups: any[];
  constructor() {
    this.heightInTiles = 0; // tiledMap.height;

    // Create an `objects` array to store references to any
    // named objects in the map. Named objects all have
    // a `name` property that was assigned in Tiled  Editor
    this.objects = [];
    this.tilesets = []; // 瓦片图信息
    this.groups = []; // 所有地图的转换信息
  }
  getTilesetByGid(gid: number) {
    let tileset;
    for (let i = 0, l = this.tilesets.length; i < l - 1; i++) {
      if (gid >= this.tilesets[i].firstgid && gid < this.tilesets[i + 1].firstgid) {
        tileset = this.tilesets[i];
        tileset.index = i;
        return tileset;
      }
    }
    tileset = this.tilesets[this.tilesets.length - 1];
    tileset.index = this.tilesets.length - 1;
    return tileset;
  }
}
