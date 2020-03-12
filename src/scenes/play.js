import { Rectangle, Texture } from 'pixi.js';
import { Scene } from '../core/pitaya';
import { Background, Keyboard, CollisionManager, TiledMap } from '../components';
import Tiled from '../core/tiled';
import { NinjaFlog } from '../character';

import { AwardManager } from '../props';

import { ObjectType, GameInitState, World, Levels } from '../constants';
import { EnemyManager } from '../enemy/enemy-manager';

export class PlayScene extends Scene {
    init() {
        super.init(); //调用父方法用于初始化场景状态
        this.gameState = GameInitState;
        this.gameState.world.screenWidth = this.state.width;
        this.gameState.world.screenHeight = this.state.height;

        this.keyboard = new Keyboard();
        this.sync(this.keyboard); //第一个同步就是键盘操作

        this.csm = new CollisionManager();
        this.sync(this.csm); //第二个计算运动碰撞检测

        this.am = new AwardManager(this);
        this.sync(this.am); //同步道具

        this.em = new EnemyManager(this);
        this.sync(this.em);

        let duration = World.JumpDuration;
        //计算重力加速度 g =2*h / (t ^2)
        this.gameState.world.gravity = (2 * World.MaxJumpThreshold * World.Unit) / (((duration / 2) * duration) / 2);

        // 计算最大跳跃初始速度 v = gt ; 往上所以是负数
        this.gameState.world.maxJumpSpeed = (-this.gameState.world.gravity * duration) / 2;
        //计算最小跳跃初始速度 v = gt = sqrt(2gh); 小跳还没做哦
        this.gameState.world.minJumpSpeed = -Math.sqrt(2 * this.gameState.world.gravity * World.MinJumpThreshold * World.Unit);

        //计算二段跳的初始速度v = gt = sqrt(2gh);
        this.gameState.world.doubleJumpSpeed = -Math.sqrt(2 * this.gameState.world.gravity * World.DoubleJumpThreshold * World.Unit);
    }

    create() {
        this.createBackground();

        //加载和解析地图信息
        let tiled = new Tiled();
        let world = tiled.loadTiledMap(this._game.loader.resources[Levels.Level2]);

        //设置场景的高度和宽度
        this.gameState.world.width = world.worldWidth;
        this.gameState.world.height = world.worldHeight;

        this.createMap(world);

        //创建角色和碰撞题
        world.objects.forEach(o => {
            // console.log('PlayScene -> create -> o.type == ObjectType.Character', o.type == ObjectType.Character);
            if (o.type == ObjectType.Character) {
                this.createCharacter(o);
            } else if (o.type == ObjectType.CollisionObject) {
                //碰撞物主要是地面
                this.csm.addObjects(o);
            } else if (o.type == ObjectType.AwardObject) {
                this.createAward(o);
            } else if (o.type == ObjectType.EnemyObject) {
                this.createEnemy(o);
            }
        });

        //console.log(this._game.renderer.plugins.tilemap);
    }
    createCharacter(character) {
        this.gameState.character.x = character.x;
        this.gameState.character.y = character.y;

        //角色的位置
        let flog = new NinjaFlog(this.gameState);
        this.gameState.character.sprite = flog;
        super.sync(flog);
        this.addChild(flog);
    }
    createMap(world) {
        let textures = [];
        world.tilesets.forEach(tileset => {
            textures.push(Texture.from(tileset.name));
        });
        textures.push(Texture.from('award_apple'));
        this.groundTiles = new TiledMap(0, textures);
        let rect = new Rectangle(0, 0, world.tileWidth, world.tileHeight);
        world.groups.forEach(group => {
            group.data.forEach(d => {
                rect.x = d.tilesetX;
                rect.y = d.tilesetY;
                let t = new Texture(textures[d.tileset.index], rect);
                this.groundTiles.addFrame(t, d.x, d.y);
            });
        });
        this.sync(this.groundTiles);
        this.addChild(this.groundTiles);
    }
    createAward(awardObject) {
        this.am.createAward(awardObject);
    }
    createEnemy(enemyObject) {
        this.em.createEnemy(enemyObject);
    }
    createBackground() {
        this.background = new Background({
            width: this.state.width,
            height: this.state.height,
        });
        this.background.addTo(this);
        super.sync(this.background);
    }
    update(delta) {
        super.update(delta, this.gameState);
    }
}
