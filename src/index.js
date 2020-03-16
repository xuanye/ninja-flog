//import { extend } from './extensions/graphics';
import { utils } from 'pixi.js';
import App from './app';
import VConsole from 'vconsole';

let designWidth = 1334 / 2;
let designHeight = 750 / 2;

let screenWidth = utils.isMobile.any ? window.innerWidth : designWidth;
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

//new VConsole();
