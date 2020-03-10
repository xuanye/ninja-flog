import { Rectangle, Texture, Graphics, Point } from 'pixi.js';
import { Scene } from '../core/pitaya';
import { Background, Keyboard, CollisionManager } from '../components';

import Tiled from '../core/tiled';

import { NinjaFlog } from '../character';

import 'pixi-tilemap';
import { ObjectType, GameInitState, World } from '../constants';

export class PlayScene extends Scene {
    init() {
        super.init(); //调用父方法用于初始化场景状态
        this.gameState = GameInitState;
        this.gameState.world.screenWidth = this.state.width;
        this.gameState.world.screenHeight = this.state.height;

        this.keyboard = new Keyboard(this.gameState);
        this.sync(this.keyboard); //第一个同步就是键盘操作

        this.csm = new CollisionManager();
        this.sync(this.csm); //第二个计算运动碰撞检测

        let duration = World.JumpDuration;
        //计算重力加速度 g =2*h / (t ^2)
        this.gameState.world.gravity = (2 * World.MaxJumpThreshold * World.Unit) / (((duration / 2) * duration) / 2);
        console.log('PlayScene -> init -> 2 * World.MaxJumpThreshold * World.Unit', 2 * World.MaxJumpThreshold * World.Unit);
        // 计算最大跳跃初始速度 v = gt ; 往上所以是负数
        this.gameState.world.maxJumpSpeed = (-this.gameState.world.gravity * duration) / 2;
        //计算最小跳跃初始速度 v = gt = sqrt(2gh);
        this.gameState.world.minJumpSpeed = -Math.sqrt(2 * this.gameState.world.gravity * World.MinJumpThreshold * World.Unit);
        console.log('PlayScene -> init -> this.gameState.world', this.gameState.world);
    }
    resume() {
        super.resume();
        this.keyboard.resume();
        this.csm.resume();
    }
    pause() {
        super.pause();
        this.keyboard.pause();
        this.csm.pause();
    }
    create() {
        this.background = new Background({
            width: this.state.width,
            height: this.state.height,
        });
        this.background.addTo(this);
        super.sync(this.background);

        let tiled = new Tiled();
        let world = tiled.loadTiledMap(this._game.loader.resources['level1']);

        //设置场景的高度和宽度
        this.gameState.world.width = world.worldWidth;
        this.gameState.world.height = world.worldHeight;

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

        //console.log('PlayScene -> create -> world.objects', world.objects);
        world.objects.forEach(o => {
            // console.log('PlayScene -> create -> o.type == ObjectType.Character', o.type == ObjectType.Character);
            if (o.type == ObjectType.Character) {
                this.gameState.character.x = o.x;
                this.gameState.character.y = o.y;

                //角色的位置
                let flog = new NinjaFlog(this.gameState);
                this.gameState.character.sprite = flog;
                super.sync(flog);
                this.addChild(flog);

                /*
                        let g = new Graphics();
                        g.lineStyle(1, 0x555555);
                        g.drawRect(this.gameState.character.x + 50, this.gameState.character.y - 20, 50, 50);
                        this.addChild(g);
        */
            } else if (o.type == ObjectType.CollisionObject) {
                //碰撞物主要是地面
                this.csm.addObjects(o);

                /* 
                let g = new Graphics();

                g.lineStyle(1, 0xffffff);
                g.beginFill(0x66ff33);
                if (o.ellipse) {
                    g.drawEllipse(o.x, o.y, o.width, o.height);
                } else if (o.polygon) {
                    g.drawPolygon(o.polygon.map(p => new Point(p.x, p.y)));
                    g.x = o.x;
                    g.y = o.y;
                } else {
                    g.drawRect(o.x, o.y, o.width, o.height);
                }
                g.endFill();
                console.log('PlayScene -> create -> g', o.id);
                this.addChild(g);*/
                //this.csm.test(this.gameState, o);
            }
        });
    }
    update(delta) {
        super.update(delta, this.gameState);
        //更新镜头的位置
        this.groundTiles.pivot.x += this.gameState.world.pivotOffsetX;
        this.gameState.world.pivotX = this.groundTiles.pivot.x;
    }
}
