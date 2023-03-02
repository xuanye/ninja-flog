import { Texture } from 'pixi.js';
import { Scene } from '@/pitaya';
import type { CharacterTypeName } from '@/constants';
import { Levels, ObjectType } from '@/constants';
import { Background } from '@/displayObjects';
import { TileUtilities } from '@/tiled';
import type { TiledLevel, TiledObject } from '@/tiled';
import type { ControllerBoard } from '@/components';
import { CollisionManager, TiledMap, KeyboardController } from '@/components';
import type { Character } from '@/displayObjects/characters';
import { characterFactory } from '@/displayObjects/characters';
import { gameStateService } from '@/services/gameStateService';
import type { CharacterObjectType } from '@/displayObjects/characters/types';
import { AwardManager } from '@/displayObjects/props/AwardManager';
import type { AwardObjectType } from '@/displayObjects/props/types';
// import { CollisionDebugPanel } from '@/components/CollisionDebugPanel';

export class PlayScene extends Scene {
  static sceneName = 'play';

  groundTiles?: TiledMap;
  character?: Character;
  controller?: ControllerBoard;
  map?: TiledLevel;
  collisionManager?: CollisionManager;
  awardManager?: AwardManager;
  initState() {
    super.initState(); // 调用父方法用于初始化场景状态
  }

  preload(): void {
    // 加载和解析地图信息
    this.map = TileUtilities.loadTiledMap(this.loader.resources[Levels.Level1]);

    gameStateService.setWorldSize({
      screenWidth: this.state.realWidth,
      screenHeight: this.state.realHeight,
      width: this.map.worldWidth,
      height: this.map.worldHeight,
    });

    gameStateService.initWorld();
  }
  create() {
    this.createBackground();

    const opt = {
      screenWidth: this.state.realWidth,
      screenHeight: this.state.realHeight,
    };
    // 控制器
    this.controller = new KeyboardController(opt);

    this.sync(this.controller);

    // 碰撞物体管理
    this.collisionManager = new CollisionManager(opt);
    this.sync(this.collisionManager); // 第二个计算运动碰撞检测

    // 奖励道具管理器
    this.awardManager = new AwardManager(this);
    this.sync(this.awardManager); // 同步道具

    if (this.map) {
      this.createMap(this.map);
      this.createCollisions(this.map);

      /*
      const debugPanel = new CollisionDebugPanel(opt);
      debugPanel.createCollisions(this.map);
      this.sync(debugPanel);
      this.addChild(debugPanel);
      */
    }

    if (this.controller) {
      this.controller.create();
      this.addChild(this.controller);
    }
  }
  /***
   * 创建地图
   */
  createMap(map: TiledLevel) {
    const textures: Texture[] = [];
    map.tilesets.forEach((tileset: { name: string }) => {
      textures.push(Texture.from(tileset.name));
    });

    this.groundTiles = new TiledMap();
    this.groundTiles.tileMap(map, textures);

    this.groundTiles.y = gameStateService.state.world.startY;
    this.sync(this.groundTiles);
    this.addChild(this.groundTiles);
  }
  createCollisions(map: TiledLevel) {
    map.objects.forEach((o: TiledObject) => {
      o.y += gameStateService.state.world.startY;

      const type = o.class || o.type || '';

      if (type === ObjectType.Character) {
        this.createCharacter(o as CharacterObjectType);
      } else if (type === ObjectType.CollisionObject) {
        const co = o as any;
        // 碰撞物主要是地面
        this.collisionManager?.addObjects(co);
      } else if (type === ObjectType.AwardObject) {
        this.createAward(o as AwardObjectType);
      } else if (type === ObjectType.EnemyObject) {
        // this.createEnemy(o);
      }
    });
  }
  createCharacter(character: CharacterObjectType) {
    const characterType = character.characterType as CharacterTypeName;

    // 角色的位置
    this.character = characterFactory.create(characterType, {
      startX: character.x,
      startY: character.y,
      x: character.x,
      y: character.y,
      mode: 'Idle',
    });

    gameStateService.setCharacter(this.character);

    super.sync(this.character);
    this.addChild(this.character);
  }

  createAward(awardObject: AwardObjectType) {
    // console.log(this.awardManager)
    this.awardManager!.createAward(awardObject);
  }
  createEnemy() {}
  createBackground() {
    const background = new Background({
      width: this.state.realWidth,
      height: this.state.realHeight,
      designWidth: this.state.designWidth,
      designHeight: this.state.designHeight,
    });
    this.addChild(background);
    this.sync(background);
  }
}
