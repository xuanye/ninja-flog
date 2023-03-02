// 奖励的名称
export const AwardInfos: Record<string, Award> = {
  MonedaD: {
    name: 'moneda_d',
    texture: 'moneda_d.png',
    initState: 'Idle',
    score: 5,
    width: 16,
    height: 16,
    states: {
      Idle: [0, 4],
    },
    animationSpeed: 0.1,
  },
  Collected: {
    name: 'collected',
    texture: 'collected.png',
    initState: 'Idle',
    score: 5,
    width: 16,
    height: 16,
    states: {
      Idle: [0, 5],
    },
    animationSpeed: 0.1,
  },
};

export enum AwardNames {
  MonedaD = 'MonedaD',
  Collected = 'Collected',
}

export interface Award {
  name: string;
  texture: string;
  initState: string;
  width: number;
  height: number;
  score: number;
  states: Record<string, number[]>;
  animationSpeed: number;
}
