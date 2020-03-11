import { TiledLevel } from './tiled-level';

export default class TileUtilities {
    constructor() {}

    loadTiledMap(jsonTiledMap) {
        let tiledMap = jsonTiledMap.data;
        let world = new TiledLevel();

        world.tileHeight = tiledMap.tileheight;
        world.tileWidth = tiledMap.tilewidth;

        // 计算当前关卡的宽度和高度
        world.worldWidth = tiledMap.width * tiledMap.tilewidth;
        world.worldHeight = tiledMap.height * tiledMap.tileheight;

        // Get a reference to the world's height and width in
        // tiles, in case you need to know this later (you will!)
        world.widthInTiles = tiledMap.width;
        world.heightInTiles = tiledMap.height;

        // Create an `objects` array to store references to any
        // named objects in the map. Named objects all have
        // a `name` property that was assigned in Tiled Editor
        //world.objects = [];
        //world.tilesets = [];

        //获取
        tiledMap.tilesets.forEach(tileset => {
            world.tilesets.push(tileset);
        });

        tiledMap.layers.forEach(tiledLayer => {
            // Make a group for this layer and copy
            // all of the layer properties onto it.
            let layerGroup = { data: [] };
            // const layerGroup = new this.Container();

            Object.keys(tiledLayer).forEach(key => {
                // Add all the layer's properties to the group, except the
                // width and height (because the group will work those our for
                // itself based on its content).
                if (key !== 'width' && key !== 'height' && key != 'data') {
                    layerGroup[key] = tiledLayer[key];
                }
            });

            // Set the width and height of the layer to
            // the `world`'s width and height
            // layerGroup.width = world.width;
            // layerGroup.height = world.height;

            // Translate `opacity` to `alpha`
            layerGroup.alpha = tiledLayer.opacity;

            // Push the group into the world's `objects` array
            // So you can access it later
            //world.objects.push(layerGroup);

            // Is this current layer a `tilelayer`?
            if (tiledLayer.type === 'tilelayer') {
                // Loop through the `data` array of this layer
                tiledLayer.data.forEach((gid, index) => {
                    let mapX, mapY, tilesetX, tilesetY, mapColumn, mapRow, tilesetColumn, tilesetRow;

                    // If the grid id number (`gid`) isn't zero, create a sprite
                    if (gid !== 0) {
                        let tileset = world.getTilesetByGid(gid);
                        //console.log(tileset);
                        let spacing = tileset.spacing;
                        let numberOfTilesetColumns = tileset.columns;
                        // Figure out the map column and row number that we're on, and then
                        // calculate the grid cell's x and y pixel position.
                        mapColumn = index % world.widthInTiles;
                        mapRow = Math.floor(index / world.widthInTiles);
                        mapX = mapColumn * tileset.tilewidth;
                        mapY = mapRow * tileset.tileheight;

                        // Figure out the column and row number that the tileset
                        // image is on, and then use those values to calculate
                        // the x and y pixel position of the image on the tileset
                        tilesetColumn = (gid - tileset.firstgid) % numberOfTilesetColumns;
                        tilesetRow = Math.floor((gid - tileset.firstgid) / numberOfTilesetColumns);
                        tilesetX = tilesetColumn * tileset.tilewidth;
                        tilesetY = tilesetRow * tileset.tileheight;

                        // Compensate for any optional spacing (padding) around the tiles if
                        // there is any. This bit of code accumlates the spacing offsets from the
                        // left side of the tileset and adds them to the current tile's position
                        if (spacing > 0) {
                            tilesetX += spacing + spacing * ((gid - tileset.firstgid) % numberOfTilesetColumns);
                            tilesetY += spacing + spacing * Math.floor((gid - tileset.firstgid) / numberOfTilesetColumns);
                        }

                        let spriteData = {
                            index: index,
                            gid: gid,
                            x: mapX,
                            y: mapY,
                            tilesetX,
                            tilesetY,
                            tileset,
                            width: world.tilewidth,
                            height: world.tileheight,
                        };

                        layerGroup.data.push(spriteData);
                    }
                });
            }

            // Is this layer an `objectgroup`?
            if (tiledLayer.type === 'objectgroup') {
                tiledLayer.objects.forEach(object => {
                    // We're just going to capture the object's properties
                    // so that we can decide what to do with it later

                    // Get a reference to the layer group the object is in
                    //object.group = layerGroup;

                    // Because this is an object layer, it doesn't contain any
                    // sprites, just data object. That means it won't be able to
                    // calucalte its own height and width. To help it out, give
                    // the `layerGroup` the same `width` and `height` as the `world`
                    // layerGroup.width = world.width;
                    // layerGroup.height = world.height;
                    if (object.properties) {
                        object.properties.forEach(p => {
                            if (!object.hasOwnProperty(p.name)) {
                                object[p.name] = p.value;
                            }
                        });
                    }
                    // Push the object into the world's `objects` array
                    world.objects.push(object);
                });
            }

            world.groups.push(layerGroup);
        });

        return world;
    }
}
