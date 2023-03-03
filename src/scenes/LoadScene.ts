import { BitmapText, AnimatedSprite } from 'pixi.js';
import type { Loader } from 'pixi.js';
import type { ResizeOptions } from '@/pitaya';
import { Scene } from '@/pitaya';

import { EventNames, Assets } from '@/constants';
import { debug } from '@/modules/debug';

export class LoadScene extends Scene {
  static sceneName = 'load';

  loadingText?: BitmapText;
  loadChar?: AnimatedSprite;

  preload() {
    this.doLoad();
  }
  doLoad() {
    this.loader.add(Assets.textures);

    // 下载资源进度
    this.loader.onProgress.add(this.progress.bind(this));
    // 下载资源完成
    this.loader.load(this.complete.bind(this));
  }
  progress(loader: Loader) {
    if (this.loadingText) {
      this.loadingText.text = `Loading...${Math.floor(loader.progress)}%`;
    }
  }
  complete() {
    debug.log('资源加载完成');
    this.publish(EventNames.LoadCompleted);
  }
  create() {
    // console.log(this.state);
    let frameIds = [];

    for (let i = 26; i <= 37; i++) {
      frameIds.push('virtual-guy' + i + '.png');
    }
    this.loadChar = AnimatedSprite.fromFrames(frameIds);
    this.loadChar.animationSpeed = 0.3;
    this.loadChar.play();
    this.loadChar.x = this.state.realWidth / 2 - this.loadChar.width / 2;
    this.loadChar.y = this.state.realHeight / 2 - this.loadChar.height / 2;
    this.addChild(this.loadChar);

    this.loadingText = new BitmapText('Loading...0%', { fontName: 'Carter_One', fontSize: 14 });
    this.loadingText.x = this.loadChar.x - 50;
    this.loadingText.y = this.loadChar.y + this.loadChar.height + 5;
    this.addChild(this.loadingText);
  }
  onResize({ realWidth, realHeight }: ResizeOptions) {
    if (this.loadChar) {
      this.loadChar.x = realWidth / 2 - this.loadChar.width / 2;
      this.loadChar.y = realHeight / 2 - this.loadChar.height / 2;

      if (this.loadingText) {
        this.loadingText.x = this.loadChar.x - 50;
        this.loadingText.y = this.loadChar.y + this.loadChar.height + 5;
      }
    }
  }
}
