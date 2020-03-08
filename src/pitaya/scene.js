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
        this.init();
        this.preload();
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
    }
    preload() {}
    resume() {
        //显示的方法
        this.visible = true;
    }
    pause() {
        this.visible = false;
    }
    create() {}
    update() {}
}
