import { Game } from './pitaya';
import { assets, eventNames } from './constants';
import scenes from './scenes';
import config from './config';

/**
 * Pixi 主程序，用于控制场景展示
 */
export default class App extends Game {
    constructor(options) {
        super(options);
        this.options = Object.assign({}, options);
        document.body.appendChild(this.view);
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
        this.loader.add(assets.textures, {
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
    update() {}

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
