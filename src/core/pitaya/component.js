import { Container } from 'pixi.js';
import PubSub from 'pubsub-js';
export default class Component extends Container {
    constructor(options) {
        super();
        this.state = options;
        this.init();
        this.create();
    }
    init() {}

    create() {}
    //---------------------
    // 发布/订阅模式的简单封装
    //---------------------
    subscribe(...args) {
        PubSub.subscribe(...args);
    }
    publish(...args) {
        PubSub.publish(...args);
    }
    update() {}
}
