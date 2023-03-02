import { Graphics } from 'pixi.js';
import { Component } from '@/pitaya';
import type { TiledLevel, TiledObject } from '@/tiled';
import { ObjectType } from '@/constants';
import type { Point } from '@/components';
import { gameStateService } from '@/services/gameStateService';

export class CollisionDebugPanel extends Component {
  createCollisions(map: TiledLevel) {
    const g = new Graphics();
    g.lineStyle(1, 0xfcfcfc, 1);
    // g.beginFill(0x650a5a);
    map.objects.forEach((o: TiledObject) => {
      const type = o.class || o.type || '';

      if (type === ObjectType.CollisionObject) {
        const co = o as any;

        if (co.ellipse) {
          g.drawCircle(co.x + co.width / 2, co.y + co.width / 2, co.width / 2);
        } else if (co.polygon) {
          const points = co.polygon.map((p: Point) => {
            return {
              x: p.x + co.x,
              y: p.y + co.y,
            };
          });
          g.drawPolygon(points);
        } else {
          g.drawRect(co.x, co.y, co.width, co.height);
        }
      }
    });
    // g.endFill();
    this.addChild(g);
  }
  update(_delta: number): void {
    this.pivot.x += gameStateService.state.world.pivotOffsetX;
  }
}
