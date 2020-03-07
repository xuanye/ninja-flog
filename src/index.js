import * as PIXI from 'pixi.js';
import { extend } from './extensions/graphics';

//扩展绘图功能
extend(PIXI.Graphics);

import App from './app';

let designWidth = 667;
let designHeight = 375;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

global.PIXI = window.PIXI = PIXI;

let app = new App({
    width: screenWidth,
    height: screenHeight,
    screenWidth,
    screenHeight,
    designWidth,
    designHeight,
    antialias: true,
});

//app.__resize();
