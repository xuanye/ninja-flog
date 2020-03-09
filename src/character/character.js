import { AnimatedSprite } from 'pixi.js';
import utils from '../utils';
import { CharacterDirections, CharacterMode } from '../constants';

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
        console.log('playState -> name', name);
        if (name && this.modeFrames[name]) {
            this.playAnimation(this.modeFrames[name]);
        }
    }

    update(delta, gameState) {
        let { character } = gameState;

        if (!character) {
            return;
        }
        if (this.direction != character.direction) {
            this.direction = character.direction;
            this.scale.x = character.direction ? 1 * character.direction : 1;
        }

        if (this.mode != character.mode) {
            this.mode = character.mode;
            this.playState(this.mode);
        }

        this.x += character.vx;
        this.y += character.vy;

        character.x = this.x;
        character.y = this.y;
    }
}
