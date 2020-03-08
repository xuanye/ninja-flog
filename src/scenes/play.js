import { Scene } from '../pitaya';
import { Background } from '../components';

import Tiled from '../core/tiled';
import { Rectangle, Texture } from 'pixi.js';
import { NinjaFlog } from '../character';

import 'pixi-tilemap';
export class PlayScene extends Scene {
    create() {
        this.background = new Background({
            width: this.state.width,
            height: this.state.height,
        });
        this.background.addTo(this);

        let tiled = new Tiled();
        let world = tiled.loadTiledMap(this._game.loader.resources['level1']);

        let textures = [];

        this.groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, Texture.from('tileset'));
        world.tilesets.forEach(tileset => {
            textures.push(Texture.from(tileset.name));
        });

        let rect = new Rectangle(0, 0, world.tileWidth, world.tileHeight);
        world.groups.forEach(group => {
            group.data.forEach(d => {
                rect.x = d.tilesetX;
                rect.y = d.tilesetY;
                let t = new Texture(textures[d.tileset.index], rect);
                this.groundTiles.addFrame(t, d.x, d.y);
            });
        });
        this.addChild(this.groundTiles);

        this.groundTiles.children.forEach(c => {
            console.log(c);
        });
        world.objects.forEach(o => {
            if (o.type == 'character') {
                //角色的位置
                let flog = new NinjaFlog(this.loader.resources);
                flog.x = o.x;
                flog.y = o.y;
                //flog.pivot.set(0, 0);
                //flog.rotation = -Math.PI / 2;
                this.addChild(flog);
            }
        });
    }
    update(delta) {
        //背景移动
        this.background.update(delta);

        //this.groundTiles.pivot.x += 0.2;
    }
}
