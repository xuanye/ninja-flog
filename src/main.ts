import { utils } from 'pixi.js';
import { App } from './app';

const designWidth = 667;
const designHeight = 375;

const screenWidth = utils.isMobile.any ? window.innerWidth : designWidth;
const screenHeight = utils.isMobile.any ? window.innerHeight : designHeight;

const app = new App({
  width: designWidth,
  height: designHeight,
  screenWidth,
  screenHeight,
  designWidth,
  designHeight,
  backgroundColor: 0x3f7cb6,
  antialias: true,
});
