export enum EnumEnemyState {
  Idle = 'Idle', // 空闲状态
  Run = 'Run', // 跑起来
  Hit = 'Hit', // 被主角搞定了
  Walk = 'Walk', // 走路
}

export const EnemyInfos: Record<string, EnemyOptions> = {
  AngryPig: {
    name: 'angry-pig',
    width: 36,
    height: 30,
    texture: 'angry-pig.png',
    initState: EnumEnemyState.Idle,
    states: {
      Idle: [5, 13], // 空闲状态
      Run: [14, 25], // 跑起来
      Hit: [0, 4], // 被打中
      Walk: [26, 41], // 我都不知道干嘛
    },
    score: 0,
    animationSpeed: 0.2,
  },
  Chicken: {
    name: 'chicken',
    width: 32,
    height: 34,
    texture: 'chicken.png',
    initState: EnumEnemyState.Idle,
    states: {
      Idle: [5, 17], // 空闲状态
      Run: [18, 31], // 跑起来
      Hit: [0, 4], // 被打中
      Walk: [18, 31], // 我都不知道干嘛
    },
    score: 0,
    animationSpeed: 0.2,
  },
  BlueBird: {
    name: 'blue-bird',
    width: 32,
    height: 32,
    texture: 'blue-bird.png',
    initState: EnumEnemyState.Idle,
    states: {
      Idle: [0, 8], // 空闲状态
      Run: [0, 8], // 跑起来
      Hit: [9, 13], // 被打中
      Walk: [0, 8], // 我都不知道干嘛
    },
    score: 0,
    animationSpeed: 0.2,
  },
};

export enum EnemyNames {
  AngryPig = 'AngryPig',
  Chicken = 'Chicken',
  BlueBird = 'BlueBird',
}

export interface EnemyOptions {
  name: string;
  texture: string;
  initState: string;
  width: number;
  height: number;
  score: number;
  states: Record<string, number[]>;
  animationSpeed: number;
}
