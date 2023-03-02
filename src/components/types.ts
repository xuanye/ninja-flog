import type { IComponent } from '@/pitaya';

export interface IController extends IComponent {
  name: string;
  create: () => void;
}

export interface BoardState {
  jump: boolean;
  arrowRight: boolean;
  arrowLeft: boolean;
  jumpTime: number;
}

export enum EnumBoardState {
  Jump = 'jump',
  ArrowRight = 'arrowRight',
  ArrowLeft = 'arrowLeft',
}

export type BoardStateName = 'jump' | 'arrowLeft' | 'arrowRight';
