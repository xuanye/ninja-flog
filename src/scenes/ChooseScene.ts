import type { ResizeOptions } from '@/pitaya';
import { Scene } from '@/pitaya';
import { Texture, BitmapText } from 'pixi.js';
import type { CharacterType, CharacterTypeName } from '@/constants';
import { Levels, ObjectType, EventNames } from '@/constants';
import { TileUtilities } from '@/tiled';
import type { TiledLevel, TiledObject } from '@/tiled';
import { TiledMap } from '@/components';
import { Background } from './components';

import { characterFactory } from '@/characters';
import { debug } from '@/services';
import { gameStateService } from '@/services/gameStateService';

interface ChooseSceneState {
  screenWidth: number;
  screenHeight: number;
  worldWidth: number;
  worldHeight: number;
  startY: number;
}
// type Character = typeof GameInitState.character;
export class ChooseScene extends Scene {
  static sceneName = 'choose';

  sceneState!: ChooseSceneState;
  groundTiles?: TiledMap;

  initState() {
    super.initState();

    this.sceneState = {
      screenWidth: this.state.realWidth,
      screenHeight: this.state.realHeight,
      worldWidth: this.state.realWidth,
      worldHeight: this.state.realHeight,
      startY: 0,
    };
  }

  create() {
    this.createBackground();

    // 加载和解析地图信息
    const chooseMapData = TileUtilities.loadTiledMap(this.loader.resources[Levels.Choose]);

    this.sceneState.worldWidth = chooseMapData.worldWidth;
    this.sceneState.worldHeight = chooseMapData.worldHeight;

    this.sceneState.startY = this.sceneState.screenHeight - this.sceneState.worldHeight;

    this.createMap(chooseMapData);

    this.createTip();

    // 创建角色和碰撞题
    chooseMapData.objects.forEach((o) => {
      o.y += this.sceneState.startY;
      // o.y -= 16;

      // console.log('PlayScene -> create -> o.type == ObjectType.Character', o.type == ObjectType.Character);

      if (o.type === ObjectType.Character || o.class === ObjectType.Character) {
        this.createCharacter(o);
      }
    });
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

    this.groundTiles.y = this.sceneState.startY;
    this.sync(this.groundTiles);
    this.addChild(this.groundTiles);
  }
  createCharacter(character: TiledObject) {
    const characterType = character.characterType as CharacterTypeName;
    const charSprite = characterFactory.create(characterType, {
      startX: character.x,
      startY: character.y,
      x: character.x,
      y: character.y,
      mode: 'Idle',
    });

    if (charSprite) {
      charSprite.interactive = true;
      charSprite.buttonMode = true;
      charSprite.on('pointerdown', () => {
        this.chooseCharacter(charSprite.characterName);
      });
      this.addChild(charSprite);
    }
  }
  chooseCharacter(characterName: string) {
    debug.log(`use character:${characterName} `);
    gameStateService.setCharacterType(characterName as CharacterType);
    this.publish(EventNames.ChooseCharacter);
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
  }
}
