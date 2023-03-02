import type { IComponent } from '@/pitaya';
import { gameStateService } from '@/services/gameStateService';
import { CompositeTilemap } from '@pixi/tilemap';

export class TiledMap extends CompositeTilemap implements IComponent {
  update(_delta: number) {
    const gameState = gameStateService.state;
    this.pivot.x += gameState.world.pivotOffsetX;
    gameStateService.setPivotX(this.pivot.x);
  }
}
