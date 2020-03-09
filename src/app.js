import { Game } from './core/pitaya';
import { Assets, EventNames } from './constants';
import scenes from './scenes';
import config from './config';

let Stats = null;
if (process.env.NODE_ENV != 'production') {
    Stats = require('stats.js');
}
/**
 * Pixi 主程序，用于控制场景展示
 */
export default class App extends Game {
    constructor(options) {
        super(options);
        this.options = Object.assign({}, options);
        document.body.appendChild(this.view);

        if (Stats) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }
    }

    /**
     * 重写创建游戏状态
     */
    createState() {
        let state = {
            methods: {
                onTransition: this.onTransition.bind(this),
            },
        };
        let newState = Object.assign(super.createState(), config.state, state);
        return newState;
    }

    init() {
        //注册场景
        this.addScenes(scenes);
        // 事件订阅
    }

    preload() {
        this.loader.add(Assets.textures, {
            // 跨域
            crossOrigin: true,
        });
    }

    progress(loader, resources) {
        //console.log('Loading...', resources);
    }

    create() {
        //this.stage.addChild(Sprite.from('cloud_top'));
        //默认开启初始状态
        this.fsm.play();
    }
    update(delta) {
        if (this.stats) {
            this.stats.begin();
        }
        super.update(delta);

        if (this.stats) {
            this.stats.end();
        }
    }

    //------------------------
    // 状态机的事件
    //-----------------------
    onTransition(lifecycle, ...args) {
        if (lifecycle.to !== 'none') {
            this.startScene(lifecycle.to, args);
        }
    }
    //------------------------
    // 发布订阅的事件
    //-----------------------
}
