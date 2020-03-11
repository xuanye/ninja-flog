import { Component } from '../core/pitaya';
import { GroundSpritesPool } from '../core/ground-sprites-pool';
import utils from '../utils';
/**
 * 游戏面板
 */
export class PlayBoard extends Component {
    init() {
        this.state = Object.assign({ width: 667, height: 375, needStart: false, needEnd: false, lastGrandType: 1 }, this.options);
        this.groundPools = new GroundSpritesPool();
        //当前在试图内的瓦片
        this.grandsSlices = [];
        this.lookupPools = [
            this.createNormalGround,
            this.createNormalGround,
            this.createNormalGround,
            this.createIsLandGround,
            this.createSpace,
        ];
    }
    create() {
        //创建游戏场景
        let startX = 0;
        let left = this.state.width;
        let distance = this.createNormalGround({ startX, partCount: 6, withDecorate: true, withTrap: false, withStart: false });
        startX += distance;
        left -= distance;
        /**/
        while (left > 0) {
            distance = this.createRandom(startX);
            startX += distance;
            //console.log('PlayBoard -> create -> startX', startX);
            left -= distance;
        }
    }
    createRandom(startX) {
        let distance = 0;
        let randomIndex = utils.randomInt(0, 100) % this.lookupPools.length;
        let proxy = this.lookupPools[randomIndex];
        if (typeof proxy == 'function') {
            console.log(proxy.name);
            let r = utils.randomInt(0, 100) % 2;
            distance = proxy.call(this, { startX: startX, partCount: utils.randomInt(4, 8), withDecorate: r == 0, withTrap: r == 1 });
        }
        return distance;
    }
    createStartGround(startX) {
        let tileArr = [];
        let tmp = this.groundPools.getStartLandPart();
        tileArr.push(tmp);
        this.grandsSlices.push(tmp);
        return this.drawTiles(tileArr, startX);
    }
    createEndGround(startX) {
        let tileArr = [];
        let tmp = this.groundPools.getEndLandPart();
        tileArr.push(tmp);
        this.grandsSlices.push(tmp);
        return this.drawTiles(tileArr, startX);
    }
    createSpace({ startX }) {
        let distance = 0;
        console.log('this.state.lastGrandType ', this.state.lastGrandType);
        if (this.state.lastGrandType == 1) {
            distance += this.createEndGround(startX);
        }
        this.state.lastGrandType = 3;
        return distance + 30;
    }
    createNormalGround({ startX, partCount, withDecorate = false, withTrap = false }) {
        let distance = 0;
        let tileArr = [];
        let tmp;
        let trapCount = 0;

        if (this.state.lastGrandType != 1) {
            distance += this.createStartGround(startX + distance);
        }

        this.state.lastGrandType = 1;
        for (let i = 0; i < partCount; i++) {
            if (i > 0 && partCount > 4 && withDecorate) {
                tmp = this.groundPools.getDecorateItem();
                tmp.offsetX = tmp.unit;
                if (!tmp) {
                    console.log('对象池空了');
                }
                tileArr.push(tmp);
                this.grandsSlices.push(tmp);
                withDecorate = false;
                console.log(tileArr);
            }
            if (i > 0 && withTrap && trapCount < 3 && i < partCount - 1) {
                trapCount++;
                tmp = this.groundPools.getTrapLandPart();
                if (!tmp) {
                    console.log('对象池空了');
                }
            } else {
                tmp = this.groundPools.getNormalLandPart();
                if (!tmp) {
                    console.log('对象池空了');
                }
            }

            tileArr.push(tmp);
            this.grandsSlices.push(tmp);
        }

        distance += this.drawTiles(tileArr, startX + distance);
        return distance;
    }
    createIsLandGround({ startX, withDecorate }) {
        let distance = 10;
        let tileArr = [];
        let tmp;

        if (this.state.lastGrandType == 1) {
            distance += this.createEndGround(startX);
        }

        this.state.lastGrandType = 2;
        if (withDecorate) {
            tmp = this.groundPools.getDecorateItem();
            tmp.offsetX = tmp.unit;
            tileArr.push(tmp);
            this.grandsSlices.push(tmp);
        }

        tmp = this.groundPools.getSuspendIsland();
        tileArr.push(tmp);
        console.log('createIsLandGround -> tileArr', tileArr);
        this.grandsSlices.push(tmp);

        distance += this.drawTiles(tileArr, startX + distance);
        return distance + 10;
    }

    drawTiles(tiles, startX) {
        let lastY = 0;
        let w = 0;
        console.log('startX', startX);
        tiles.forEach(tile => {
            let sprite = tile.sprite;
            sprite.x = startX + w + tile.offsetX;
            w += tile.isDecorate ? 0 : tile.width;

            if (tile.isDecorate) {
                sprite.y = lastY - tile.height;
            } else {
                sprite.y = this.state.height - sprite.height + tile.offsetY;
                lastY = sprite.y;
            }

            this.addChild(sprite);
        });

        return w;
    }
    update() {}
}
