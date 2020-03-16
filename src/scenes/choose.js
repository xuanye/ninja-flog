import { Scene } from '../core/pitaya';
import { Background, TiledMap } from '../components';
import Tiled from '../core/tiled';
import { Rectangle, Texture, BitmapText } from 'pixi.js';
import { ObjectType, Levels, EventNames, GameInitState } from '../constants';
import Character from '../character/index';

export class ChooseScene extends Scene {
    init() {
        super.init(); //调用父方法用于初始化场景状态
        this.gameState = GameInitState;
        this.gameState.world.screenWidth = this.state.realWidth;
        this.gameState.world.screenHeight = this.state.realHeight;
    }

    create() {
        this.createBackground();

        //加载和解析地图信息
        let tiled = new Tiled();
        let chooseMapData = tiled.loadTiledMap(this._game.loader.resources[Levels.Choose]);

        this.gameState.world.width = chooseMapData.worldWidth;
        this.gameState.world.height = chooseMapData.worldHeight;

        this.gameState.world.startY = this.gameState.world.screenHeight - this.gameState.world.height;

        this.createMap(chooseMapData);

        //创建角色和碰撞题
        chooseMapData.objects.forEach(o => {
            o.y += this.gameState.world.startY;

            // console.log('PlayScene -> create -> o.type == ObjectType.Character', o.type == ObjectType.Character);
            if (o.type == ObjectType.Character) {
                this.createCharacter(o);
            }
        });
        this.createTip();
    }
    createTip() {
        const text = new BitmapText('Tap to Choose Character', { font: '30px Carter_One' });
        text.y = 50;
        text.x = this.state.realWidth / 2 - text.width / 2;
        this.addChild(text);
    }
    createCharacter(character) {
        ///console.log('PlayScene -> createCharacter -> character', character);
        this.gameState.character.x = character.x;
        this.gameState.character.y = character.y;
        this.gameState.character.startX = character.x;
        this.gameState.character.startY = character.y;

        let charSprite = Character.create(character.characterType, this.gameState);

        if (charSprite) {
            charSprite.interactive = true;
            charSprite.buttonMode = true;
            charSprite.on('pointerdown', e => {
                this.chooseCharacter(charSprite);
            });
            this.addChild(charSprite);
        }
    }
    createBackground() {
        this.background = new Background({
            width: this.state.realWidth,
            height: this.state.realHeight,
            designWidth: this.state.designWidth,
            designHeight: this.state.designHeight,
        });
        this.background.addTo(this);
        super.sync(this.background);
    }
    createMap(map) {
        let textures = [];
        map.tilesets.forEach(tileset => {
            textures.push(Texture.from(tileset.name));
        });

        //textures.push(Texture.from('award_apple'));
        this.groundTiles = new TiledMap(0, textures);
        let rect = new Rectangle(0, 0, map.tileWidth, map.tileHeight);
        map.groups.forEach(group => {
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
    chooseCharacter(character) {
        this.gameState.character.characterType = character.characterName;
        this.publish(EventNames.ChooseCharacter);
    }
    update(delta) {
        super.update(delta, this.gameState);
    }
}
