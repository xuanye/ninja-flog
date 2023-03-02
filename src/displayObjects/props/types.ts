import type { TiledObject } from '@/tiled';

export interface AwardObjectType extends TiledObject {
  awardType: string;
  width: number;
  height: number;
}
