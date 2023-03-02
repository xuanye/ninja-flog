import type { TiledObject } from '@/tiled';

export type CharacterStatusName = 'Idle' | 'Run' | 'Jump' | 'DoubleJump' | 'Fall' | 'Slide';

export enum EnumCharacterStatus {
  'Idle' = 'Idle',
  'Run' = 'Run',
  'Jump' = 'Jump',
  'DoubleJump' = 'DoubleJump',
  'Fall' = 'Fall',
  'Slide' = 'Slide',
}
export interface CharacterState {
  startX: number;
  startY: number;
  x: number;
  y: number;
  mode: CharacterStatusName;
}
export interface CharacterObjectType extends TiledObject {
  characterType: string;
}
