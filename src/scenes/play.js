import { Scene } from '../pitaya';
import { Background, PlayBoard } from '../components';

export class PlayScene extends Scene {
    create() {
        this.background = new Background({
            width: this.state.width,
            height: this.state.height,
        });
        this.background.addTo(this);

        //添加地面
        this.playboard = new PlayBoard({ width: this.state.width, height: this.state.height });
        this.addChild(this.playboard);
    }
    update(delta) {
        //背景移动
        this.background.update(delta);
    }
}
