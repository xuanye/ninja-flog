import type { TiledObject } from '@/tiled';

export interface EnemyObjectType extends TiledObject {
  enemyType: string;
  width: number;
  height: number;
}
