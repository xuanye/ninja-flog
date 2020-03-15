import { Application } from 'pixi.js';
import StateMachine from 'javascript-state-machine';
import SceneManager from './scene-manager';
import PubSub from 'pubsub-js';

export default class Game extends Application {
    constructor(options) {
        super(options);
        this.ssm = new SceneManager(this); //simple scene manager

        this.fsm = new StateMachine(this.createState()); //有限状态机  finite state machines
        this.init();
        this.preload();

        // 下载资源进度
        this.loader.onProgress.add(this.progress.bind(this));
        //下载资源完成
        this.loader.load(this.create.bind(this));

        //游戏主循环
        this.ticker.add(this.update.bind(this));
    }
    createState() {
        return {
            transitions: [],
        };
    }
    /**
     * 添加场景
     * @param {*} name 场景名称
     * @param {*} scene 场景
     */
    addScene(name, scene) {
        this.ssm.add(name, scene);
        return this;
    }
    /**
     * 批量添加场景
     * @param {*} scenes 场景信息 { sceneName1:sceneObj1,sceneName2:sceneObj2 }
     */
    addScenes(scenes) {
        Object.keys(scenes).forEach(sceneName => {
            this.addScene(sceneName, scenes[sceneName]);
        });
    }
    /**
     * 开始某个场景
     * @param {String} name 场景的名称
     * @param {*} args 场景init的参数
     */
    startScene(name, args) {
        this.ssm.start(name, args);
    }

    /**
     * 初始化方法
     */
    init() {}
    /**
     * 预加载资源需要重新这个方法
     */
    preload() {}

    /**
     * 资源加载进度
     */
    progress(loader, resources) {}
    /**
     * 资源加载完成后，开始游戏状态
     * @param {*} loaders 记载器
     * @param {*} resources 资源信息
     */
    create(loader, resources) {}

    /**
     * 主事件循环中
     */
    update(delta) {}

    onResize(options) {
        this.ssm.onResize(options);
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
}
