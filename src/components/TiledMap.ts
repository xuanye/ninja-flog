import type { GameInitState } from '@/constants';
import type { IComponent } from '@/pitaya';
import { CompositeTilemap } from '@pixi/tilemap';

type GameState = typeof GameInitState;
export class TiledMap extends CompositeTilemap implements IComponent {
  update(delta: number, gameState: GameState) {
    // this.pivot.x += gameState.world.pivotOffsetX;
    // gameState.world.pivotX = this.pivot.x;
  }
}
