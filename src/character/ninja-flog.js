import { Character } from './character';

export class NinjaFlog extends Character {
    constructor(initState) {
        //console.log('NinjaFlog -> constructor -> resources', resources);

        super({
            baseTexture: 'ninja-frog_image',
            modeFrames: {
                Idle: [14, 24], //空闲状态
                Run: [26, 37], //跑起来
                Jump: [25], //跳跃
                DoubleJump: [0, 5], //空中翻滚
                Fall: [13], //下坠，
                Hit: [6, 12], //被撞击了
                WalkJump: [38, 42], //我都不知道干嘛
            },
            frameWidth: 32, //每一帧的宽度
            frameHeight: 32, //每一帧的高度
            initState, //初始状态
        });
    }
}
