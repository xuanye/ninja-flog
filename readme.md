## 使用 PIXI.js 实现平台类小游戏

> 使用 PIXI.js 实现平台类小游戏，

使用的所有组件

-   `pixi.js` 渲染引擎
-   `animejs` 补间动画库
-   `javascript-state-machine` 有限状态机
-   `pixi-sound` 音频播放
-   `pixi-tilemap` Tiled 游戏地图展示（貌似使用多个瓦片图在 iPhone 中使用有问题，也是诡异）
-   `pubsub-js` 全局的事件订阅和发布
-   `sat` 分离轴碰撞检测库

## 安装依赖

```sh
npm install
```

or

```sh
yarn
```

## 启动

```sh
npm start
```

or

```sh
yarn start
```

## 开发说明

### 目录结构

```
├─assets //资源文件夹
│  ├─audio //音频资源
│  └─img //图片资源
│    ├─bless
│    ├─decorate
│    └─print_item
├─components //封装的组件和控件
├─constants //常量
├─extensions //扩展方法
├─helpers //一些帮助方法，动画辅助，碰撞检测
├─pitaya  //PIXI开发的规范帮助类和基类
├─scenes  //场景
└─sprites //一些常用精灵的封装
```

### 命名规范

1. 所有的文件名都使用小写字母命名，单词间用-符号分割
2. 变量名使用驼峰法命名，第一个字母小写，或许单词首字母大写

```
let name = 'xuanye';
let myName = 'xuanye wong';
```

1. 类名使用驼峰法命名，单词首字母大写

```
class MyClass extends BaseClass {}
```

### 创建应用

index.js

```
import * as PIXI from 'pixi.js';
import { extend } from './extensions/graphics';

//扩展绘图功能
extend(PIXI.Graphics);

import App from './app';

let designWidth = 750;
let designHeight = 1334;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

global.PIXI = window.PIXI = PIXI;

let app = new App({
    width: screenWidth * 2, //使用双倍屏幕宽度和高度来实例化画布，然后再缩放到可视区域，达到显示高清图的效果
    height: screenHeight * 2,
    screenWidth,
    screenHeight,
    designWidth,
    designHeight,
    antialias: true,
});
```

app.js

```

export default class App extends Game {
    constructor(options) {
        super(options);
        this.options = Object.assign({}, options);
        this.view.style = `width: ${options.screenWidth}px; height: ${options.screenHeight}px;`;
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
        //开始选择文物
        this.subscribe(eventNames.CHOOSE_RELIC, () => {
            this.fsm.startChoose();
        });

        //开始设计
        this.subscribe(eventNames.START_DESIGN, (msg, data) => {
            this.fsm.startDesign(data);
        });
        //完成设计
        this.subscribe(eventNames.COMPLETE_DESIGN, (msg, data) => {
            this.fsm.completeDesign(data);
        });
        //返回上一步
        this.subscribe(eventNames.PREV_STEP, (msg, data) => {
            this.fsm.prev(data);
        });
    }

    preload() {
        this.loader.add(assets.textures, {
            // 跨域
            crossOrigin: true,
        });
        this.loader.add(assets.audios, {
            // 跨域
            crossOrigin: true,
        });
    }

    progress(loader, resources) {
        //console.log('Loading...', loader.progress);
    }

    create() {
        console.log('App -> create -> this.state', this.fsm.state);
        //this.stage.addChild(Sprite.from('cloud_top'));
        //默认开启初始状态
        this.fsm.test(meta.relics[0], 1);
    }
    update() {} //如果需要主循环中执行的动画放在这里

```

### 场景 Scene

```
export default class LandscapeScene extends Scene {
    constructor(app) {
        super(app);
    }
    init() {
        this.state = { width: this._game.options.width, height: this._game.options.height };
    }
    create() {
        console.log('LandscapeScene -> init -> this._game.options', this._game.options);
        let graphics = new Graphics();
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, this.width, this.height);
        graphics.endFill();

        this.addChild(graphics);

        let style = {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#F7EDCA',
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true, //是否允许换行
            wordWrapWidth: 440, //换行执行宽度
        };

        let richText = new PIXI.Text('请使用竖屏观看', style);
        richText.x = this.state.width / 2 - richText.width / 2;
        richText.y = this.state.height / 2 - richText.height / 2;

        this.addChild(richText);
    }
}
```

### 组件 Component

```
export default class Button extends Component {
    constructor(options) {
        super(options);
    }
    /**
     *  初始化
     * @param {*} setting 配置信息
     * {width: 200, height:80  bgTexture：‘按钮的背景图’, text: '文字内容', fontSize: 32, color: 0x555555, align: 'center', fontFamily: ''  }
     * @memberof Button
     */
    init() {
        this.state = Object.assign({ text: 'button', fontSize: 32, color: 0x555555, align: 'center', fontFamily: '' }, this.options);
        this.interactive = true;
        this.buttonMode = true;
    }

    /**
     *  开始绘制
     * @memberof Button
     */
    create() {
        this.bg = Sprite.from(this.state.bgTexture);

        if (this.state.width) this.bg.width = this.state.width;
        if (this.state.height) this.bg.height = this.state.height;

        this.addChild(this.bg);

        this.textLabel = new Text(this.state.text, {
            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize,
            fill: this.state.color,
            align: this.state.align,
        });

        this.textLabel.anchor.set(0.5, 0.5);
        this.textLabel.position.set(this.bg.width / 2, this.bg.height / 2);
        this.addChild(this.textLabel);
    }
    /**
     * 设置按钮文字
     * @param {*} text
     */
    setText(text) {
        this.textLabel.text = text;
    }
}
```

### 有限状态机

示例中引入了有限状态机[javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine)

状态中 config.js 中定义 ,

```
export default {
    state: {
        init: 'none',
        transitions: [
            { name: 'beReady', from: 'none', to: 'choose' },
            { name: 'startChoose', from: 'ready', to: 'choose' },
            { name: 'startDesign', from: 'choose', to: 'design' },
            { name: 'completeDesign', from: 'design', to: 'result' },
            { name: 'prev', from: 'design', to: 'choose' },
            { name: 'prev', from: 'result', to: 'design' },
            { name: 'test', from: 'none', to: 'result' },
        ],
        methods: {},
    },
};
```

通过调用状态机的方法，来切换应用状态，并改变场景显示,app.js 中的代码：

```
   createState() {
        let state = {
            methods: {
                onTransition: this.onTransition.bind(this),
            },
        };
        let newState = Object.assign(super.createState(), config.state, state);
        return newState;
    }
    //------------------------
    // 状态机的事件
    //-----------------------
    onTransition(lifecycle, ...args) {
        console.log('onTransition:', lifecycle.to);
        if (lifecycle.to !== 'none') {
            this.startScene(lifecycle.to, args);
        }
    }
```

### 发布和订阅 Pub/Sub

引入[pubsub-js](https://github.com/mroderick/PubSubJS)

我们的游戏系统中可能有许多组件想要对这些事件做出反应：

-   计分板可能需要更新
-   粒子系统可能需要爆炸
-   Sound-fx 系统可能需要发挥作用
-   游戏可能需要转换 FSM 状态（例如，如果玩家死了）

在 Scene 基类和 Game 的基类中已经注册的 PubSub 的方法

scene.js

```
export default class Scene extends Container {
   ...
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
```

game.js

```

export default class Game extends Application {
    ....

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

```

在 Component 中没有加入订阅发布，是否引入 还需要进一步考量
