//import { extend } from './extensions/graphics';
import App from './app';

let designWidth = 667;
let designHeight = 375;

let screenWidth = 667; //window.innerWidth;
let screenHeight = 375; //window.innerHeight;

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
