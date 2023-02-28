import type { IApplication, ResizeOptions } from '@/pitaya';
import { Scene } from '@/pitaya';
import { Rectangle, Texture, BitmapText } from 'pixi.js';
import { EventNames, GameInitState, Levels, ObjectType } from '@/constants';
import { TileUtilities } from '@/tiled';
import type { TiledLevel } from '@/tiled';
import { TiledMap } from '@/components';
import { debug } from '@/services/debug';

type GameState = typeof GameInitState;
type Character = typeof GameInitState.character;
export class ChooseScene extends Scene {
  static sceneName = 'choose';

  public gameState!: GameState;
  public groundTiles?: TiledMap;

  constructor(app: IApplication) {
    super(app);
    debug.log('实例化ChooseScene');
  }

  init() {
    super.init(); // 调用父方法用于初始化场景状态
    this.gameState = { ...GameInitState };
    this.gameState.world.screenWidth = this.state.realWidth;
    this.gameState.world.screenHeight = this.state.realHeight;
    debug.log('初始化ChooseScene', this.gameState);
  }

  create() {
    this.createBackground();
    console.log('🚀 ~ ChooseScene ~ create ~ this:', this);

    // 加载和解析地图信息
    const tiled = new TileUtilities();
    const chooseMapData = tiled.loadTiledMap(this.loader.resources[Levels.Choose]);

    this.gameState.world.width = chooseMapData.worldWidth;
    this.gameState.world.height = chooseMapData.worldHeight;

    this.gameState.world.startY = this.gameState.world.screenHeight - this.gameState.world.height;

    this.createMap(chooseMapData);

    this.createTip();
  }
  createTip() {
    const text = new BitmapText('Tap to Choose Character', {
      fontName: 'Carter_One',
      fontSize: 14,
    });
    text.y = 50;
    text.x = this.state.realWidth / 2 - text.width / 2;
    this.addChild(text);
  }

  createBackground() {}
  createMap(map: TiledLevel) {
    const textures: Texture[] = [];
    map.tilesets.forEach((tileset: { name: string }) => {
      textures.push(Texture.from(tileset.name));
    });

    this.groundTiles = new TiledMap();
    let rect = new Rectangle(0, 0, map.tileWidth, map.tileHeight);
    map.groups.forEach((group: any) => {
      group.data.forEach(
        (d: { tileset: { index: number }; tilesetX: number; tilesetY: number }) => {
          this.groundTiles?.tile(textures[d.tileset.index], d.tilesetX, d.tilesetY, {
            tileWidth: map.tileWidth,
            tileHeight: map.tileHeight,
          });
        }
      );
    });
    this.groundTiles.y = this.gameState.world.startY;
    this.sync(this.groundTiles);
    this.addChild(this.groundTiles);
  }

  update(delta: number) {
    super.update(delta, this.gameState);
  }
  /**
   * 自动调用的方法
   */
  onResize(options: ResizeOptions) {
    this.state.realWidth = options.realWidth;
    this.state.realHeight = options.realHeight;

    // this.background.onResize(options);

    this.gameState.world.screenWidth = this.state.realWidth;
    this.gameState.world.screenHeight = this.state.realHeight;

    // 这里实际上如果手机屏幕发生大小变化，背景和地图会有错位，要每个元素修正？
    this.gameState.world.startY = this.gameState.world.screenHeight - this.gameState.world.height;
  }
}
