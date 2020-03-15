import { Rectangle, Texture, utils } from 'pixi.js';
import { Scene } from '../core/pitaya';
import { Background, Keyboard, CollisionManager, TiledMap, ScoreBoard, TouchBoard, ResultBoard } from '../components';
import Tiled from '../core/tiled';
import { NinjaFlog } from '../character';

import { AwardManager } from '../props';

import { ObjectType, GameInitState, World, Levels, EventNames, CharacterDirections, CharacterMode } from '../constants';
import { EnemyManager } from '../enemy/enemy-manager';

export class PlayScene extends Scene {
    init() {
        super.init(); //调用父方法用于初始化场景状态
        this.gameState = GameInitState;
        this.gameState.world.screenWidth = this.state.width;
        this.gameState.world.screenHeight = this.state.height;

        if (utils.isMobile.any) {
            //&& process.env.NODE_ENV == 'production'
            this.touchBoard = new TouchBoard(this);
            this.sync(this.touchBoard); //第一个同步就是触碰操作
        } else {
            this.keyboard = new Keyboard();
            this.sync(this.keyboard); //第一个同步就是键盘操作
        }

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

        //计算基准地面Y坐标
        this.gameState.world.baseGroundY = this.gameState.world.screenHeight - World.groundHeight * World.Unit;

        this.subscribe(EventNames.HeroDead, this.onHeroDie.bind(this));
        this.subscribe(EventNames.Restart, this.onRestart.bind(this));
    }

    create() {
        this.createBackground();

        //加载和解析地图信息
        let tiled = new Tiled();
        let world = tiled.loadTiledMap(this._game.loader.resources[Levels.Level1]);

        //设置场景的高度和宽度
        this.gameState.world.width = world.worldWidth;
        this.gameState.world.height = world.worldHeight;
        this.gameState.world.startY = this.gameState.world.screenHeight - this.gameState.world.height;
        this.createMap(world);

        //创建角色和碰撞题
        world.objects.forEach(o => {
            o.y += this.gameState.world.startY;
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

        this.score = new ScoreBoard({
            width: this.state.width,
            height: this.state.height,
        });
        this.score.x = this.state.width - 100;
        this.score.y = 10;
        this.addChild(this.score);
        //console.log(this._game.renderer.plugins.tilemap);
        this.resultBoard = new ResultBoard({
            width: this.state.width,
            height: this.state.height,
            gameState: this.gameState,
        });
        this.resultBoard.x = this.state.width / 2 - this.resultBoard.width / 2;
        this.resultBoard.y = this.state.height / 2 - this.resultBoard.height / 2;
        this.addChild(this.resultBoard);
    }
    createCharacter(character) {
        ///console.log('PlayScene -> createCharacter -> character', character);
        this.gameState.character.x = character.x;
        this.gameState.character.y = character.y;
        this.gameState.character.startX = character.x;
        this.gameState.character.startY = character.y;

        //角色的位置
        this.character = new NinjaFlog(this.gameState);
        this.gameState.character.sprite = this.character;
        super.sync(this.character);
        this.addChild(this.character);
    }
    createMap(world) {
        let textures = [];
        world.tilesets.forEach(tileset => {
            textures.push(Texture.from(tileset.name));
        });

        //textures.push(Texture.from('award_apple'));
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
        this.groundTiles.y = this.gameState.world.startY;
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
            width: Math.max(this.state.screenWidth, this.state.screenHeight),
            height: Math.min(this.state.screenWidth, this.state.screenHeight),
            designWidth: this.state.designWidth,
            designHeight: this.state.designHeight,
        });
        this.background.addTo(this);
        super.sync(this.background);
    }
    onRestart() {
        this.pause();
        //console.log('on restart');
        this.gameState.world.pivotOffsetX = 0;
        this.gameState.world.pivotX = 0;
        this.gameState.collision.x = 0;
        this.gameState.collision.y = 0;
        this.gameState.collision.collision = false;

        this.gameState.character.isDead = false;
        //console.log('PlayScene -> onRestart ->   this.gameState.character', this.gameState.character);
        this.gameState.character.x = this.gameState.character.startX;
        this.gameState.character.y = this.gameState.character.startY;
        this.gameState.character.vx = 0;
        this.gameState.character.vy = 0;
        this.gameState.character.direction = CharacterDirections.Right;
        this.gameState.character.health = 1;
        this.gameState.character.invincible = false;
        this.groundTiles.pivot.x = 0;
        this.character.x = this.gameState.character.x;
        this.character.y = this.gameState.character.y;
        this.character.visible = true;
        this.character.playState(CharacterMode.Idle);
        this.am.reset();
        this.resume();
    }
    /**
     * 当英雄死亡的时候
     * @param {*} gameState
     */
    onHeroDie(gameState) {
        //显示
        this.setChildIndex(this.resultBoard, this.children.length - 1);
        this.resultBoard.show();
    }
    update(delta) {
        super.update(delta, this.gameState);
    }
    /**
     * 自动调用的方法
     */
    onResize(options) {
        let width = Math.max(options.width, options.height);
        let height = Math.min(options.width, options.height);
        this.background.onResize(options);
        this.score.x = width - 100;
        this.resultBoard.x = width / 2 - this.resultBoard.width / 2;
        this.resultBoard.y = height / 2 - this.resultBoard.height / 2;
    }
}
