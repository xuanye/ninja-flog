export class TiledLevel {
    constructor() {
        this.tileHeight = 32;
        this.tileWidth = 32;

        // 计算当前关卡的宽度和高度
        this.worldWidth = 0; //tiledMap.width * tiledMap.tilewidth;
        this.worldHeight = 0; //tiledMap.height * tiledMap.tileheight;

        // Get a reference to the world's height and width in
        // tiles, in case you need to know this later (you will!)
        this.widthInTiles = 0; //tiledMap.width;
        this.heightInTiles = 0; //tiledMap.height;

        // Create an `objects` array to store references to any
        // named objects in the map. Named objects all have
        // a `name` property that was assigned in Tiled  Editor
        this.objects = [];
        this.tilesets = []; //瓦片图信息
        this.groups = []; //所有地图的转换信息
    }
    getTilesetByGid(gid) {
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
