import { AnimatedSprite } from 'pixi.js';
import utils from '../utils';

export class Character extends AnimatedSprite {
    constructor({ baseTexture, statesFrame, frameWidth, frameHeight }) {
        let frames = utils.su.filmstrip(baseTexture, frameWidth, frameHeight);
        super(frames);
        this.vX = 0;
        this.vY = 0;

        this.states = statesFrame;
        utils.su.addStatePlayer(this);
    }
    playState(state) {
        if (this.states[state]) {
            this.playAnimation(this.states[state]);
        }
    }
    idle() {
        this.playAnimation(this.states['idle']);
    }
    run() {
        this.playAnimation(this.states['run']);
    }
    jump() {
        this.playAnimation(this.states['jump']);
    }
    doubleJump() {
        this.playAnimation(this.states['doubleJump']);
    }
    fall() {
        this.playAnimation(this.states['fall']);
    }
    hit() {
        this.playAnimation(this.states['hit']);
    }
    walkJump() {
        this.playAnimation(this.states['walkJump']);
    }
    update(delta) {}
}

export let CharactorMode = {
    idle: 0, //空闲状态
    run: 1, //跑起来
    jump: 2, //跳跃
    doubleJump: 3, //空中翻滚
    fall: 4, //下坠，
    hit: 5, //被撞击了
    walkJump: 6, //我都不知道干嘛
};

export let CharacterDirections = {
    left: 1, //向左
    right: 2, //向右
};
