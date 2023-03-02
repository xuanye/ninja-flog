export enum CharacterDirections {
  Left = -1,
  None = 0,
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
  Slide = 7, // 蹲 实际没用
}
export enum EnemyState {
  Idle = 0, // 空闲状态
  Run = 1, // 跑起来
  Hit = 2, // 被主角搞定了
  Walk = 3, // 走路
}

export enum JumpType {
  Slide = -1,
  Nope = 0, // 没跳
  Jump = 1, // 一级跳
  WalkJump = 2, // 边走边跳
  DoubleJump = 3, // 二级跳
}

export enum WorldStatus {
  Initial = 0,
  ArrivalTerminal = 1,
  End = 2,
}
export enum CharacterType {
  PinkMan = 'pink-man',
  NinjaFlog = 'ninja-flog',
  MaskDude = 'mask-dude',
  VirtualGuy = 'virtual-guy',
}
export const GameInitState: GameState = {
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
    status: WorldStatus.Initial,
    isEndPart: false,
    baseGroundY: 0,
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
    characterType: CharacterType.NinjaFlog,
    direction: CharacterDirections.Right,
    jumpTime: 0,
    jump: 0, // 当前跳跃的高度

    jumpType: JumpType.Nope, // 0 =没跳 1 =一级跳  2 =二级跳
    mode: CharacterMode.Idle,
    health: 1,
    isDead: false,
    invincible: false, // true时不和怪物碰撞
    moving: false, // 设置角色是否移动中
    onTheGround: false,
    sprite: null,
    box: null,
    effectiveArea: [5, 5, 24, 28], // 有效碰撞区域
  },
};

export const CollisionThreshold = {
  x: 1.3,
  y: 1,
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
export const World = {
  MinJumpThreshold: 1.75, // 跳跃的阈值,1.75个单位
  MaxJumpThreshold: 4.5, // 跳跃的阈值,4.5个单位
  DoubleJumpThreshold: 2.5, // 二段跳跃的阈值,2.5个单位
  JumpDuration: 60, // 跳跃空中的时长 2T
  Unit: 16, // 单位像素,
  groundHeight: 4, // 4个单位
  worldHeight: 24, // 24个单位
};

export interface WorldType {
  startX: number;
  startY: number;
  screenWidth: number;
  screenHeight: number;
  width: number;
  height: number;
  pivotOffsetX: number;
  pivotX: number;
  gravity: number; // 重力加速度，程序中计算
  moveSpeed: number; // 移动速度，单位时间 1/60 秒所移动的距离
  maxJumpSpeed: number; // 最大跳跃初始速度，程序中计算
  minJumpSpeed: number; // 最小跳跃初始速度，程序中计算 大小跳的处理，本例中没有
  doubleJumpSpeed: number; // 二段速度，程序中计算
  status: WorldStatus;
  isEndPart: boolean;
  baseGroundY: number;
}
export interface Collision {
  x: number;
  y: number;
  collision: boolean;
}

export type CharacterTypeName = 'pink-man' | 'ninja-flog' | 'mask-dude' | 'virtual-guy';

export interface Character {
  startX: number;
  startY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  characterType: CharacterTypeName;
  direction: CharacterDirections;
  jumpTime: number;
  jump: number; // 当前跳跃的高度

  jumpType: JumpType; // 0 =没跳 1 =一级跳  2 =二级跳
  mode: CharacterMode;
  health: number;
  isDead: boolean;
  invincible: boolean; // true时不和怪物碰撞
  moving: boolean; // 设置角色是否移动中
  onTheGround: boolean;
  sprite?: any;
  box?: any;
  effectiveArea: number[];
}

export interface GameState {
  world: WorldType;
  collision: Collision;
  character: Character;
}
