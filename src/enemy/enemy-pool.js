import { AnimatedSprite } from 'pixi.js';
import utils from '../utils';
import { EnemyInfos } from '../constants';

export class EnemySpritePool {
    constructor() {
        this.pools = {};

        this.init();
    }

    init() {
        Object.keys(EnemyInfos).forEach(name => {
            this.pools[name] = [];
            this.prepareSprite(name, 2);
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
            throw new Error('怪物类型不存在', name);
        } else {
            return this.createSprite(name);
        }
    }
    createSprite(name) {
        let enemy = EnemyInfos[name];
        if (!enemy) {
            throw new Error('怪物类型不存在');
        }
        let frames = utils.su.filmstrip(enemy.texture, enemy.width, enemy.height);
        //创建动画精灵
        let pixie = new AnimatedSprite(frames);
        pixie._enemy_name = name;
        //设置动画精灵的速度
        pixie.animationSpeed = 0.3;
        utils.su.addStatePlayer(pixie);

        return pixie;
    }
    get(name) {
        if (typeof this.pools[name] == undefined) {
            throw new Error('怪物类型不存在');
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
            throw new Error('怪物类型不存在');
        }
        //console.log(name, this.pools[name]);
        this.pools[name].push(sprite);
    }
}
