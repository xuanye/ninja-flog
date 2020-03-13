//import { extend } from './extensions/graphics';
import { utils } from 'pixi.js';
import App from './app';
//import VConsole from 'vconsole';

let designWidth = 667;
let designHeight = 375;

let screenWidth = utils.isMobile.any ? window.innerWidth : designWidth;
console.log('utils.isMobile', utils.isMobile);
let screenHeight = utils.isMobile.any ? window.innerHeight : designHeight;

let app = new App({
    width: screenWidth,
    height: screenHeight,
    screenWidth,
    screenHeight,
    designWidth,
    designHeight,
    antialias: true,
});

//let vconsole = new VConsole();
//app.__resize();
