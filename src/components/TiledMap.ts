import type { IComponent } from '@/pitaya';
import { gameStateService } from '@/services/gameStateService';
import type { TiledLevel } from '@/tiled';
import { CompositeTilemap } from '@pixi/tilemap';
import type { Texture } from 'pixi.js';

export class TiledMap extends CompositeTilemap implements IComponent {
  tileMap(map: TiledLevel, textures: Texture[]) {
    map.groups.forEach((group: any) => {
      group.data.forEach(
        (d: {
          x: number;
          y: number;
          tileset: { index: number };
          tilesetX: number;
          tilesetY: number;
        }) => {
          this.tile(textures[d.tileset.index], d.x, d.y, {
            u: d.tilesetX,
            v: d.tilesetY,
            tileWidth: map.tileWidth,
            tileHeight: map.tileHeight,
          });
        }
      );
    });
  }

  update(_delta: number) {
    const gameState = gameStateService.state;
    this.pivot.x += gameState.world.pivotOffsetX;
    gameStateService.setPivotX(this.pivot.x);
  }
}
