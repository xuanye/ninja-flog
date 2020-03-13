import { Component } from '../core/pitaya';
import { BitmapText } from 'pixi.js';
import { EventNames } from '../constants';

export class ScoreBoard extends Component {
    init() {}
    create() {
        this.state.score = 0;
        this.scoreLabel = new BitmapText('000', { font: '10px myfw' });
        this.addChild(this.scoreLabel);

        this.subscribe(EventNames.Award, this.getAward.bind(this));
        this.subscribe(EventNames.HitEnemy, this.hitEnemy.bind(this));
    }
    getAward() {
        this.state.score += 1;
        this.setScore();
    }
    hitEnemy() {
        this.state.score += 2;
        this.setScore();
    }

    setScore() {
        this.scoreLabel.text = String(this.state.score).padStart(3, '0');
    }
}
