import * as PIXI from 'pixi.js';

import SpriteUtilities from './helpers/sprite-utilities';
//import './helpers/charm';
import Bump from './helpers/bump';

export default {
    bump: new Bump(PIXI),
    su: new SpriteUtilities(PIXI),
    spriteFrame(base, rectArray) {
        let textureArray = [];
        for (let i = 0; i < rectArray.length; i++) {
            let t1 = new PIXI.Texture(base, new PIXI.Rectangle(rectArray[i][0], rectArray[i][1], rectArray[i][2], rectArray[i][3]));
            textureArray.push(t1);
        }
        return textureArray;
    },
    newId() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    getRandomInt(min = 0, max = 10000) {
        return min + Math.floor(Math.random() * Math.floor(max - min + 1));
    },
};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16);
}
