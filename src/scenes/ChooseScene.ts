import type { ResizeOptions } from '@/pitaya';
import { Scene } from '@/pitaya';
import { Texture, BitmapText } from 'pixi.js';
import type { GameState } from '@/constants';
import { GameInitState, Levels, Character } from '@/constants';
import { TileUtilities } from '@/tiled';
import type { TiledLevel } from '@/tiled';
import { TiledMap } from '@/components';
import { Background } from './components/Background';

// type Character = typeof GameInitState.character;
export class ChooseScene extends Scene {
  static sceneName = 'choose';

  gameState!: GameState;
  groundTiles?: TiledMap;

  initState() {
    super.initState();

    this.gameState = { ...GameInitState };

    this.gameState.world.screenWidth = this.state.realWidth;
    this.gameState.world.screenHeight = this.state.realHeight;
  }

  create() {
    this.createBackground();

    // 加载和解析地图信息
    const tiled = new TileUtilities();
    const chooseMapData = tiled.loadTiledMap(this.loader.resources[Levels.Choose]);

    this.gameState.world.width = chooseMapData.worldWidth;
    this.gameState.world.height = chooseMapData.worldHeight;

    this.gameState.world.startY = this.gameState!.world.screenHeight - this.gameState!.world.height;

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

  /***
   * 创建地图
   */
  createMap(map: TiledLevel) {
    const textures: Texture[] = [];
    map.tilesets.forEach((tileset: { name: string }) => {
      textures.push(Texture.from(tileset.name));
    });

    this.groundTiles = new TiledMap();

    map.groups.forEach((group: any) => {
      group.data.forEach(
        (d: {
          x: number;
          y: number;
          tileset: { index: number };
          tilesetX: number;
          tilesetY: number;
        }) => {
          this.groundTiles?.tile(textures[d.tileset.index], d.x, d.y, {
            u: d.tilesetX,
            v: d.tilesetY,
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
  createCharacter(character: Character) {
    /// console.log('PlayScene -> createCharacter -> character', character);
    this.gameState.character.x = character.x;
    this.gameState.character.y = character.y;
    this.gameState.character.startX = character.x;
    this.gameState.character.startY = character.y;

    let charSprite = Character.create(character.characterType, this.gameState);

    if (charSprite) {
      charSprite.interactive = true;
      charSprite.buttonMode = true;
      charSprite.on('pointerdown', () => {
        this.chooseCharacter(charSprite);
      });
      this.addChild(charSprite);
    }
  }

  update(_delta: number) {
    // super.update(delta, this.gameState);
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
