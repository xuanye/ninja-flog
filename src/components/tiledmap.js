import 'pixi-tilemap';
export class TiledMap extends PIXI.tilemap.CompositeRectTileLayer {
    constructor(zIndex, baseTextures) {
        super(zIndex, baseTextures);
    }

    update(delta, gameState) {
        this.pivot.x += gameState.world.pivotOffsetX;
        gameState.world.pivotX = this.pivot.x;
    }
}
