export type CharacterStatusName =
  | 'Idle'
  | 'Run'
  | 'Jump'
  | 'DoubleJump'
  | 'Fall'
  | 'Fall'
  | 'Slide';

export interface CharacterState {
  startX: number;
  startY: number;
  x: number;
  y: number;
  mode: CharacterStatusName;
}
