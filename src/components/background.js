import { Texture, TilingSprite } from 'pixi.js';
export class Background {
    constructor(options) {
        this.state = options;
    }
    addTo(parent) {
        let scaleY = this.state.height / this.state.designHeight;
        console.log('Background -> addTo -> this.state', this.state);

        let bgBackTexture = Texture.from('bg_back');
        this.bgBack = new TilingSprite(bgBackTexture, bgBackTexture.baseTexture.width, bgBackTexture.baseTexture.height);
        this.bgBack.width = this.state.width;
        this.bgBack.scale.y = scaleY;
        this.bgBack.y = this.state.height - this.bgBack.height;

        let bgFrontTexture = Texture.from('bg_front');
        this.bgFront = new TilingSprite(bgFrontTexture, bgFrontTexture.baseTexture.width, bgFrontTexture.baseTexture.height);
        this.bgFront.width = this.state.width;
        this.bgFront.scale.y = scaleY;
        this.bgFront.y = this.state.height - this.bgFront.height;

        let cloudsBackTexture = Texture.from('clouds_back');
        this.cloudsBack = new TilingSprite(cloudsBackTexture, cloudsBackTexture.baseTexture.width, cloudsBackTexture.baseTexture.height);
        this.cloudsBack.width = this.state.width;
        this.cloudsBack.scale.y = scaleY;

        let cloudsFrontTexture = Texture.from('clouds_front');
        this.cloudFront = new TilingSprite(cloudsFrontTexture, cloudsFrontTexture.baseTexture.width, cloudsFrontTexture.baseTexture.height);
        this.cloudFront.width = this.state.width;
        this.cloudFront.scale.y = scaleY;

        parent.addChild(this.cloudsBack, this.cloudFront, this.bgBack, this.bgFront);
    }
    update(delta, gameState) {
        //背景移动
        this.cloudsBack.tilePosition.x -= 0.4 * delta + gameState.world.pivotOffsetX * 0.25;
        this.cloudFront.tilePosition.x -= 0.3 * delta + gameState.world.pivotOffsetX * 0.25;

        this.bgBack.tilePosition.x -= gameState.world.pivotOffsetX * 0.25;
        this.bgFront.tilePosition.x -= gameState.world.pivotOffsetX * 0.22;
    }
}
