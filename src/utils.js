import * as PIXI from 'pixi.js';

import SpriteUtilities from './helpers/sprite-utilities';

export default {
    //tu: new TiledUtils(PIXI),
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
    randomFloat(min, max) {
        return min + Math.random() * (max - min);
    },
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isWechat() {
        //判断是否是微信
        var ua = navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
    },
};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16);
}
