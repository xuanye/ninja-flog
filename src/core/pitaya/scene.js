import { Container } from 'pixi.js';
import PubSub from 'pubsub-js';

/**
 * 场景基类
 */
export default class Scene extends Container {
    constructor(game) {
        super();
        this._game = game;
        this.loader = game.loader;
        this.syncItems = [];
        this.init();
        this.preload();
        this.paused = false;
    }

    //---------------------
    // 发布/订阅模式的简单封装
    //---------------------
    subscribe(...args) {
        PubSub.subscribe(...args);
    }
    publish(...args) {
        PubSub.publish(...args);
    }
    init() {
        this.state = Object.assign({}, this._game.options);
        this.state.width = this.state.designWidth;
        this.state.height = this.state.designHeight;

        if (this.state.designWidth > this.state.designHeight) {
            this.state.realWidth = Math.max(this.state.screenWidth, this.state.screenHeight);
            this.state.realHeight = Math.min(this.state.screenWidth, this.state.screenHeight);
        } else {
            this.state.realWidth = Math.min(this.state.screenWidth, this.state.screenHeight);
            this.state.realHeight = Math.max(this.state.screenWidth, this.state.screenHeight);
        }
        //console.log(this.state);
        //console.log('Scene -> init -> this._game.options', this._game.view.width, this._game.view.height);
    }
    preload() {}
    resume() {
        //显示的方法
        this.visible = true;
        this.paused = false;
        if (this.syncItems) {
            this.syncItems.forEach(item => {
                if (item && item.resume && typeof item.resume == 'function') {
                    item.resume.call(item);
                }
            });
        }
    }
    pause() {
        this.visible = false;
        this.paused = true;
        if (this.syncItems) {
            this.syncItems.forEach(item => {
                if (item && item.pause && typeof item.pause == 'function') {
                    item.pause.call(item);
                }
            });
        }
    }
    isPaused() {
        return this.paused;
    }
    create() {}
    /**
     * 注册需要同步的元素，该元素必须有update方法
     * @param {Object} item  需要同步的元素，该元素必须有update方法
     */
    sync(item) {
        if (item && item.update && typeof item.update == 'function') {
            this.syncItems.push(item);
        }
    }
    cancelSync(item) {
        var index = this.syncItems.indexOf(item);
        if (index > -1) {
            this.syncItems.splice(index, 1);
        }
    }
    update(delta, ...args) {
        if (this.syncItems) {
            this.syncItems.forEach(item => {
                if (item && item.update && typeof item.update == 'function') {
                    item.update.call(item, delta, ...args);
                }
            });
        }
    }
}
