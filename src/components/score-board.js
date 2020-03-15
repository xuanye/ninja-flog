import { Component } from '../core/pitaya';
import { TextStyle, AnimatedSprite, Text } from 'pixi.js';
import { EventNames, TextureNames, AwardNames, AwardSize } from '../constants';
import utils from '../utils';

export class ScoreBoard extends Component {
    init() {}
    create() {
        let frames = utils.su.filmstrip(TextureNames.Award[AwardNames.MonedaD], AwardSize.Width, AwardSize.Height);

        let coin = new AnimatedSprite(frames);
        this.addChild(coin);
        this.state.score = 0;

        const style = new TextStyle({
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontSize: 16,
            fontWeight: 'bold',
            stroke: '#8f8a8a',
            strokeThickness: 1,
        });
        this.scoreLabel = new Text('000', style);
        this.scoreLabel.x = AwardSize.Width + 5;
        this.addChild(this.scoreLabel);

        this.subscribe(EventNames.Award, this.getAward.bind(this));
        this.subscribe(EventNames.HitEnemy, this.hitEnemy.bind(this));
        this.subscribe(EventNames.Restart, () => {
            this.state.score = 0;
            this.setScore();
        });
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
