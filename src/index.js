//import { extend } from './extensions/graphics';
import { utils } from 'pixi.js';
import App from './app';
import VConsole from 'vconsole';

let designWidth = 667;
let designHeight = 375;

let screenWidth = utils.isMobile.any ? window.innerWidth : designWidth;
let screenHeight = utils.isMobile.any ? window.innerHeight : designHeight;

let app = new App({
    width: designWidth,
    height: designHeight,
    screenWidth,
    screenHeight,
    designWidth,
    designHeight,
    backgroundColor: 0x3f7cb6,
    antialias: true,
});

//new VConsole();
