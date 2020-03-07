import utils from '../utils';
import { Texture, Sprite } from 'pixi.js';
/**
 * 对面对象的缓冲池
 */
export class GroundSpritesPool {
    constructor() {
        this.startParts = [];
        this.normalParts = [];
        this.trapParts = [];
        this.endParts = [];
        //桥
        this.bridgeParts = [];

        //悬浮岛
        this.suspendIslands = [];

        //装饰物
        this.decorateItems = [];
        this.baseTexture = Texture.from('tilemap');

        this.createStartLandPart();
        this.createBridgePart();
        this.createDecorateItems();
        this.createEndLandPart();
        this.createNormalLandPart();
        this.createSuspendIsland();
        this.createTrapLandPart();
    }
    /**
     * 创建基础地面开始片段
     *
     * @memberof GroundSpritesPool
     */
    createStartLandPart() {
        this.addStartLandPart(10);
    }
    getStartLandPart() {
        return this.startParts.shift();
    }
    returnStartLandPart(part) {
        return this.startParts.push(part);
    }
    /**
     * 创建基础地面
     */
    createNormalLandPart() {
        this.addNormalLandPart(20);
        this.shuffle(this.normalParts);
    }
    getNormalLandPart() {
        return this.normalParts.shift();
    }
    returnNormalLandPart(part) {
        return this.normalParts.push(part);
    }
    /**
     * 创建基础地面结束判断
     */
    createEndLandPart() {
        this.addEndLandPart(10);
    }
    getEndLandPart() {
        return this.endParts.shift();
    }
    returnEndLandPart(part) {
        return this.endParts.push(part);
    }
    /**
     * 创建基础地形的陷阱
     */
    createTrapLandPart() {
        this.addTrapLandPart(16);
    }

    getTrapLandPart() {
        return this.trapParts.shift();
    }
    returnTrapLandPart(part) {
        return this.trapParts.push(part);
    }
    /**
     * 创建基础地形的陷阱
     */
    createSuspendIsland() {
        this.addSuspendIsland(20);
        this.shuffle(this.suspendIslands);
    }

    getSuspendIsland() {
        return this.suspendIslands.shift();
    }
    returnSuspendIsland(part) {
        return this.suspendIslands.push(part);
    }

    createDecorateItems() {
        this.addDecorateItems(5);
        this.shuffle(this.decorateItems);
    }

    getDecorateItem() {
        return this.decorateItems.shift();
    }
    returnDecorateItem(part) {
        return this.decorateItems.push(part);
    }

    /**
     * 创建桥的地形
     */
    createBridgePart() {
        this.addBridgePart(24);
    }
    getBridgePart() {
        return this.bridgeParts.shift();
    }
    returnBridgePart(part) {
        return this.bridgeParts.push(part);
    }

    addDecorateItems(count) {
        for (let i = 0; i < count; i++) {
            let item1 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 0, 0, 16 * 5, 16 * 7)), {
                unitX: 5,
                unitY: 7,
                isGrand: false,
                isTrap: false,
                offsetY: 0,
                isDecorate: true,
                minUnitX: 1,
            });
            let item2 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 10, 16 * 2, 16 * 4, 16 * 5)), {
                unitX: 4,
                unitY: 5,
                isGrand: false,
                isTrap: false,
                offsetY: 0,
                isDecorate: true,
                minUnitX: 1,
            });
            let item3 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 4, 16 * 6, 16 * 4, 16)), {
                unitX: 4,
                unitY: 1,
                isGrand: false,
                isTrap: false,
                offsetY: 0,
                isDecorate: true,
                minUnitX: 1,
            });
            let item4 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 14, 16 * 6, 16 * 3, 16)), {
                unitX: 3,
                unitY: 1,
                isGrand: false,
                isTrap: false,
                offsetY: 0,
                isDecorate: true,
                minUnitX: 1,
            });
            this.decorateItems.push(item1, item2, item3, item4);
        }
    }
    addSuspendIsland(count) {
        for (let i = 0; i < count; i++) {
            let item1 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 18, 16 * 5, 16 * 5, 16 * 4)), {
                unitX: 5,
                unitY: 4,
                isGrand: true,
                isTrap: false,
                offsetY: -3 * 16,
                minUnitX: 1,
            });
            let item2 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 18, 160, 16 * 5, 16 * 5)), {
                unitX: 5,
                unitY: 5,
                isGrand: true,
                isTrap: false,
                offsetY: -2 * 16,
                minUnitX: 1,
            });
            let item3 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 24, 160, 16 * 5, 16 * 5)), {
                unitX: 5,
                unitY: 5,
                isGrand: true,
                isTrap: false,
                offsetY: -2 * 16,
                minUnitX: 1,
            });
            this.suspendIslands.push(item1, item2, item3);
        }
    }
    addBridgePart(count) {
        for (let i = 0; i < count; i++) {
            let item1 = new TileItem(new Sprite(utils.su.frame(this.baseTexture, 16 * 16, 160, 16, 16)), {
                unitX: 1,
                unitY: 1,
                isGrand: true,
                isTrap: false,
                offsetY: -3 * 16,
                minUnitX: 3,
            });
            this.bridgeParts.push(item1);
        }
    }
    addNormalLandPart(count) {
        for (let i = 0; i < count; i++) {
            for (let j = 1; j < 6; j++) {
                let part = new Sprite(utils.su.frame(this.baseTexture, 16 * j, 160, 16, 16 * 4));
                let item1 = new TileItem(part, {
                    unitX: 1,
                    unitY: 5,
                    isGrand: true,
                    isTrap: false,
                    offsetY: 0,
                    minUnitX: 4,
                });
                this.normalParts.push(item1);
            }
        }
    }
    addStartLandPart(count) {
        for (let i = 0; i < count; i++) {
            let part = new Sprite(utils.su.frame(this.baseTexture, 0, 160, 16, 16 * 4));
            let item1 = new TileItem(part, {
                unitX: 1,
                unitY: 5,
                isGrand: true,
                isTrap: false,
                offsetY: 0,
                minUnitX: 1,
            });
            this.startParts.push(item1);
        }
    }
    addEndLandPart(count) {
        for (let i = 0; i < count; i++) {
            let part = new Sprite(utils.su.frame(this.baseTexture, 8 * 16, 160, 16, 16 * 4));
            let item1 = new TileItem(part, {
                unitX: 1,
                unitY: 5,
                isGrand: true,
                isTrap: false,
                offsetY: 0,
                minUnitX: 1,
            });
            this.endParts.push(item1);
        }
    }
    addTrapLandPart(count) {
        for (let i = 0; i < count; i++) {
            let part = new Sprite(utils.su.frame(this.baseTexture, 7 * 16, 160, 16, 16 * 4));
            let item1 = new TileItem(part, {
                unitX: 1,
                unitY: 5,
                isGrand: true,
                isTrap: true,
                offsetY: 0,
                minUnitX: 3,
            });
            this.trapParts.push(item1);
        }
    }
    //打乱数组
    shuffle(arr) {
        let len = arr.length;
        let shuffles = len * 3;
        for (let i = 0; i < shuffles; i++) {
            let arrSlice = arr.pop();
            let pos = Math.floor(Math.random() * (len - 1));
            arr.splice(pos, 0, arrSlice);
        }
    }
}

class TileItem {
    constructor(sprite, { unitX, unitY, isGrand = true, isTrap = false, offsetY = 0, isDecorate = false, minUnitX = 1 }) {
        this.sprite = sprite;
        this.unit = 16; //单位尺寸
        this.unitX = unitX;
        this.unitY = unitY;
        this.isGrand = isGrand; //是否为地面
        this.isTrap = isTrap; //是否为陷阱
        this.offsetX = 0;
        this.offsetY = offsetY; //轴偏移量

        this.width = this.unit * this.unitX;
        this.height = this.unit * this.unitY;

        this.isDecorate = isDecorate;

        this.minUnitX = minUnitX;
    }
}
