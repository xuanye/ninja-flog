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
        //console.log('Loading...', loader.progress);
    }

    create() {
        //this.stage.addChild(Sprite.from('cloud_top'));
        //默认开启初始状态
        this.fsm.play();
    }
    update() {}

    //------------------------
    // 屏幕适配 强制竖屏
    //-----------------------
    __resize() {
        const { width, height, designWidth, designHeight } = this.options;
        const screenRect = document.body.getBoundingClientRect();
        //console.log('App -> __resize -> screenRect', screenRect);
        this.renderer.resize(screenRect.width, screenRect.height);

        let offsetWidth = 0;
        let offsetHeight = 0;
        if (window.orientation === 90 || window.orientation === -90) {
            offsetWidth = screenRect.height;
            offsetHeight = screenRect.width;
        } else {
            offsetWidth = screenRect.width;
            offsetHeight = screenRect.height;
        }

        const aspectRatio = offsetHeight / offsetWidth;

        // fixWidth, orientation="portrait"
        const newWidth = offsetWidth;
        const scale = newWidth / width;
        const newHeight = height * scale;

        const root = this.stage;
        root.scale.x = newWidth / width;
        root.scale.y = newHeight / height;

        if (window.orientation === 90 || window.orientation === -90) {
            root.rotation = -Math.PI / 2;
            root.y = newWidth;
        } else {
            root.rotation = 0;
            root.y = 0;
        }

        this.realScreen = {
            realWidth: offsetWidth,
            realHeight: offsetHeight,
            width,
            height,
            top: 0,
            bottom: offsetHeight / scale,
            left: 0,
            right: width,
            aspectRatio,
        };
        this.realScreen.width = this.realScreen.right - this.realScreen.left;
        this.realScreen.height = this.realScreen.bottom - this.realScreen.top;
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
