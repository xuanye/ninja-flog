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
    /**
     * 注册需要同步的元素，该元素必须有update方法
     * @param {Object} item  需要同步的元素，该元素必须有update方法
     */
    sync(item) {
        if (item && item.update && typeof item.update == 'function') {
            this.syncItems.push(item);
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
