import Scene from './scene';

/**
 * 场景管理器
 */
export default class SceneManager {
    constructor(game) {
        this._scenes = {}; //场景的类
        this._scenesInstances = {}; //场景的实例
        this._active = {
            //活跃的信息
            name: null,
            update: null,
            scene: null,
        };
        this._game = game;
    }

    /**
     * 注册场景
     * @param {String} name 场景名称
     * @param {Scene} scene 场景对象
     */
    add(name, scene) {
        if (this._scenes[name]) {
            console.warn(`${name} scene has registered, please rename it`);
        }
        this._scenes[name] = scene;
    }
    onResize(options) {
        if (this._active) {
            if (this._active.scene) {
                if (this._active.scene.onResize && typeof this._active.scene.onResize == 'function') {
                    this._active.scene.onResize.call(this._active.scene, options);
                }
            }
        }
    }
    update(delta) {
        if (this._active.scene && !this._active.scene.isPaused() && this._active.scene.update) {
            this._active.scene.update(delta);
        }
    }
    /**
     * 开始场景
     * @param {String} name 场景的名称
     * @param {*} args 场景init的参数
     */
    start(name, args) {
        setTimeout(() => {
            if (this._active.scene && this._active.scene.parent) {
                if (this._active.scene.pause && typeof this._active.scene.pause == 'function') {
                    this._active.scene.pause();
                }
            }

            const ActiveScene = this._scenes[name];

            if (!ActiveScene) throw new Error(`${name} scene is not exist`);

            let instance = this._scenesInstances[name];
            if (!instance) {
                instance = new ActiveScene(this._game);
                this._scenesInstances[name] = instance;
                if (instance.create && typeof instance.create == 'function') {
                    instance.create.apply(instance);
                }
                this._game.stage.addChildAt(instance, 0);
            }

            if (instance.resume && typeof instance.resume == 'function') {
                instance.resume.apply(instance, args);
            }

            //this._game.ticker.add(update);

            this._active.name = name;
            this._active.scene = instance;
        });
    }
}
