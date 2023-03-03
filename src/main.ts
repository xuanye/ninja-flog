import { utils } from 'pixi.js';
import { App } from './App';

const designWidth = 667;
const designHeight = 375;

const screenWidth = utils.isMobile.any ? window.innerWidth : designWidth;
const screenHeight = utils.isMobile.any ? window.innerHeight : designHeight;

const options = {
  width: designWidth,
  height: designHeight,
  screenWidth,
  screenHeight,
  designWidth,
  designHeight,
  resolution: 1,
  backgroundColor: 0x3f7cb6,
  antialias: true,
};

const app = new App(options);

app.load();
