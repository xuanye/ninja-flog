import { AnimatedSprite } from 'pixi.js';
import utils from '../utils';
import { CharacterMode } from '../constants';

export class Character extends AnimatedSprite {
    constructor({ baseTexture, modeFrames, frameWidth, frameHeight, initState }) {
        let frames = utils.su.filmstrip(baseTexture, frameWidth, frameHeight);
        super(frames);
        this.modeFrames = modeFrames;
        this.init(initState.character);
    }
    init(initState) {
        Object.keys(initState).forEach(key => {
            this[key] = initState[key];
        });
        this.modeNames = [];
        Object.keys(CharacterMode).forEach(name => {
            this.modeNames.push(name);
        });
        //设置精灵的的原点位置为中心
        this.anchor.set(0.5, 0.5);

        utils.su.addStatePlayer(this);
        this.playState(initState.mode);
    }

    playState(state) {
        let name = this.modeNames[state];
        //console.log('playState -> name', name);
        if (name && this.modeFrames[name]) {
            this.playAnimation(this.modeFrames[name]);
        }
    }

    update(delta, gameState) {
        let { character, collision, world } = gameState;

        if (!character || !collision) {
            return;
        }
        let vx = 0;
        let vy = 0;
        if (collision.collision) {
            //console.log('update -> (collision.collision', collision);

            vx = character.vx - collision.x;
            vy = character.vy - collision.y;

            vx = vx > 0 ? Math.ceil(vx) : Math.floor(vx);
            vy = vy > 0 ? Math.ceil(vy) : Math.floor(vy);

            //console.log('->', ',碰撞Y=', collision.y, '预定加速度=', character.vy, ',计算后Y=', vy);

            if (vx != 0) {
                //console.log('update -> vx', vx);
                //this.x += vx;
            }
            if (vy != 0) {
                //console.log('update ->vy', vy);
                //this.y += vy;
            }
        } else {
            //console.log('===>', character.vx, character.vy);
            vx = character.vx;
            vy = character.vy;
            //this.x += character.vx;
            // this.y += character.vy;
        }
        this.y += vy;
        if (vx > 0) {
            if (this.x + vx > 200) {
                world.pivotOffsetX = this.x + vx - 200;
                //场景尽头
                if (world.pivotX + world.pivotOffsetX + world.screenWidth > world.width) {
                    world.pivotOffsetX = world.width - world.screenWidth - world.pivotX;
                    //console.log('update -> world.pivotX,world.pivotOffsetX', world.pivotX, world.pivotOffsetX);
                }
                this.x += vx - world.pivotOffsetX;
            } else {
                this.x += vx;
            }
        } else if (vx < 0) {
            if (this.x + vx < 200) {
                world.pivotOffsetX = vx;
                if (world.pivotOffsetX + world.pivotX <= 0) {
                    world.pivotOffsetX = 0 - world.pivotX;
                    this.x += vx - world.pivotOffsetX;
                }
            } else {
                this.x += vx;
            }
        } else {
            world.pivotOffsetX = 0;
        }

        if (this.x + this.width >= world.screenWidth) {
            this.x = world.screenWidth - this.width;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.direction != character.direction) {
            this.direction = character.direction;
            this.scale.x = character.direction ? 1 * character.direction : 1;
        }

        if (this.mode != character.mode) {
            this.mode = character.mode;
            this.playState(this.mode);
        }

        character.x = this.x;
        character.y = this.y;
    }
}
