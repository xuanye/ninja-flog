import { Character } from './character';
import { Texture } from 'pixi.js';

export class NinjaFlog extends Character {
    constructor(resources) {
        //console.log('NinjaFlog -> constructor -> resources', resources);

        super({
            baseTexture: 'ninja-frog_image',
            statesFrame: {
                idle: [14, 24], //空闲状态
                run: [26, 37], //跑起来
                jump: [25], //跳跃
                doubleJump: [0, 5], //空中翻滚
                fall: [6], //下坠，
                hit: [7, 13], //被撞击了
                walkJump: [38, 42], //我都不知道干嘛
            },
            frameWidth: 32,
            frameHeight: 32,
        });

        this.initStateName = 'idle';
        this.playState(this.initStateName);
    }
}
