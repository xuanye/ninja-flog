import { BitmapText, AnimatedSprite } from 'pixi.js';
import { Scene } from '../core/pitaya';
import { Assets, EventNames } from '../constants';

export class LoadScene extends Scene {
    init() {
        super.init();
        this.loader = this._game.loader;
    }
    preload() {
        this.loader.add(Assets.textures, {
            // 跨域
            crossOrigin: true,
        });

        this.loader.add(Assets.audios, {
            // 跨域
            crossOrigin: true,
        });
        //下载资源进度
        this.loader.onProgress.add(this.progress.bind(this));
        //下载资源完成
        this.loader.load(this.complete.bind(this));
    }
    progress(loader, resources) {
        if (this.loadingText) {
            this.loadingText.text = `Loading...${Math.floor(loader.progress)}%`;
        }
    }
    complete() {
        this.publish(EventNames.LoadCompleted);
    }
    create() {
        console.log(this.state);
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

        this.loadingText = new BitmapText('Loading...0%', { font: '14px Carter_One' });
        this.loadingText.x = this.loadChar.x - 50;
        this.loadingText.y = this.loadChar.y + this.loadChar.height + 5;
        this.addChild(this.loadingText);
    }
    onResize({ realWidth, realHeight }) {
        this.loadChar.x = realWidth / 2 - this.loadChar.width / 2;
        this.loadChar.y = realHeight / 2 - this.loadChar.height / 2;

        this.loadingText.x = this.loadChar.x - 50;
        this.loadingText.y = this.loadChar.y + this.loadChar.height + 5;
    }
}
