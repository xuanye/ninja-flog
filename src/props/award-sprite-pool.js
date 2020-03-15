import { AnimatedSprite } from 'pixi.js';
import utils from '../utils';
import { TextureNames, AwardNames, AwardSize } from '../constants';

export class AwardSpritePool {
    constructor() {
        this.pools = {};

        this.init();
    }

    init() {
        Object.keys(AwardNames).forEach(name => {
            this.pools[name] = [];
            this.prepareSprite(name, 20);
        });
        //console.log(this.pools);
    }
    prepareSprite(name, count) {
        for (let i = 0; i < count; i++) {
            this.pools[name].push(this.createProxy(name));
        }
    }
    createProxy(name) {
        if (typeof this.pools[name] == undefined) {
            throw new Error('奖励类型不存在', name);
        } else {
            return this.createSprite(name);
        }
    }
    createSprite(name) {
        //console.log('AwardSpritePool -> createSprite -> TextureNames.Award[name]', name, TextureNames.Award[name]);
        let frames = utils.su.filmstrip(TextureNames.Award[name], AwardSize.Width, AwardSize.Height);

        //创建动画精灵
        let pixie = new AnimatedSprite(frames);
        //设置动画精灵的速度
        pixie.animationSpeed = 0.1;
        return pixie;
    }
    get(name) {
        if (typeof this.pools[name] == undefined) {
            throw new Error('奖励类型不存在');
        }
        //console.log('借用');
        let sprite = this.pools[name].shift();
        if (!sprite) {
            return this.createProxy(name);
        }
        return sprite;
    }

    return(sprite, name) {
        if (typeof this.pools[name] == undefined) {
            throw new Error('奖励类型不存在');
        }
        //console.log(name, this.pools[name]);
        this.pools[name].push(sprite);
    }
}
