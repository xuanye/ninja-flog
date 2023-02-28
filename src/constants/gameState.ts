export enum CharacterDirections {
  Left = -1,
  Right = 1,
}

export enum CharacterMode {
  Idle = 0, // 空闲状态
  Run = 1, // 跑起来
  Jump = 2, // 跳跃
  DoubleJump = 3, // 空中翻滚
  Fall = 4, // 下坠，
  Hit = 5, // 被撞击了
  WalkJump = 6, // 我都不知道干嘛
}
export enum EnemyState {
  Idle = 0, // 空闲状态
  Run = 1, // 跑起来
  Hit = 2, // 被主角搞定了
  Walk = 3, // 走路
}

export enum JumpType {
  Nope = 0, // 没跳
  Jump = 1, // 一级跳
  WalkJump = 2, // 边走边跳
  DoubleJump = 3, // 二级跳
}

export const GameInitState = {
  world: {
    startX: 0,
    startY: 0,
    screenWidth: 0,
    screenHeight: 0,
    width: 0,
    height: 0,
    pivotOffsetX: 0,
    pivotX: 0,
    gravity: 0, // 重力加速度，程序中计算
    moveSpeed: 2, // 移动速度，单位时间 1/60 秒所移动的距离
    maxJumpSpeed: 0, // 最大跳跃初始速度，程序中计算
    minJumpSpeed: 0, // 最小跳跃初始速度，程序中计算 大小跳的处理，本例中没有
    doubleJumpSpeed: 0, // 二段速度，程序中计算
  },
  collision: {
    x: 0,
    y: 0,
    collision: false,
  },
  character: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    characterType: 'pink-man',
    direction: CharacterDirections.Right,
    jumpTime: 0,
    jump: 0, // 当前跳跃的高度
    onGround: true,
    jumpType: JumpType.Nope, // 0 =没跳 1 =一级跳  2 =二级跳
    mode: CharacterMode.Idle,
    health: 1,
    isDead: false,
    invincible: false, // true时不和怪物碰撞
  },
};

export enum ObjectType {
  Character = 'character',
  CollisionObject = 'collisionObject',
  AwardObject = 'awardObject',
  EnemyObject = 'enemyObject',
}

export enum CollisionType {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}
export const Levels = {
  Level1: 'level1',
  Level2: 'level2',
  Choose: 'choose',
};
// 奖励的名称
export const AwardNames = {
  Collected: 'Collected',
  MonedaD: 'MonedaD',
};
export const AwardSize = {
  Width: 16,
  Height: 16,
};
export const EnemyInfos = {
  AngryPig: {
    name: 'angry-pig',
    width: 36,
    height: 30,
    texture: 'angry-pig_image',
    initState: EnemyState.Idle,
    states: [
      [5, 13], // 空闲状态
      [14, 25], // 跑起来
      [0, 4], // 被打中
      [26, 41], // 我都不知道干嘛
    ],
  },
  Chicken: {
    name: 'chicken',
    width: 32,
    height: 34,
    texture: 'chicken_image',
    initState: EnemyState.Idle,
    states: [
      [5, 17], // 空闲状态
      [18, 31], // 跑起来
      [0, 4], // 被打中
      [18, 31], // 我都不知道干嘛
    ],
  },
  BlueBird: {
    name: 'blue-bird',
    width: 32,
    height: 32,
    texture: 'blue-bird_image',
    initState: EnemyState.Idle,
    states: [
      [0, 8], // 空闲状态
      [0, 8], // 跑起来
      [9, 13], // 被打中
      [0, 8], // 我都不知道干嘛
    ],
  },
};
