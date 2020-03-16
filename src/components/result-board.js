import { Component } from '../core/pitaya';
import { Sprite, BitmapText } from 'pixi.js';
import anime from 'animejs';
import PubSub from 'pubsub-js';
import { EventNames } from '../constants';

export class ResultBoard extends Component {
    init() {}
    create() {
        const text = new BitmapText('Game Over', { font: '36px Carter_One' });
        this.addChild(text);

        this.btnRestart = Sprite.from('gui_03.png');
        this.btnRestart.scale.set(0.8, 0.8);
        this.btnRestart.x = 30;
        this.btnRestart.y = text.height + 5;

        this.btnRestart.interactive = true;
        this.btnRestart.buttonMode = true;
        this.btnRestart.on('pointerdown', this.onRestart.bind(this));
        this.addChild(this.btnRestart);

        this.btnMenu = Sprite.from('gui_04.png');
        this.btnMenu.scale.set(0.8, 0.8);
        this.btnMenu.x = this.btnRestart.x + this.btnRestart.width + 20;
        this.btnMenu.y = this.btnRestart.y;

        this.btnMenu.interactive = true;
        this.btnMenu.buttonMode = true;
        this.btnMenu.on('pointerdown', this.onMenu.bind(this));

        this.addChild(this.btnMenu);
        this.visible = false;
    }
    publish(...args) {
        PubSub.publish(...args);
    }
    onMenu() {
        this.hide(() => {
            this.publish(EventNames.Menu);
        });
    }
    onRestart() {
        this.hide(() => {
            this.publish(EventNames.Restart);
        });
    }
    show() {
        this.y = this.state.height;
        this.visible = true;
        this.alpha = 0;
        anime({
            targets: this,
            alpha: 1,
            y: this.state.height / 2 - this.height / 2,
            duration: 2500,
        });
    }
    hide(callback) {
        anime({
            targets: this,
            alpha: 0,
            duration: 200,
            complete: () => {
                this.visible = false;
                callback && callback.call(this);
            },
        });
    }
}
