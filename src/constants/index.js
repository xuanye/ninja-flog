export * from './assets';

export * from './event-names';

export * from './texture-names';

export const CharacterDirections = {
    Left: -1,
    Right: 1,
};

export const CharacterMode = {
    Idle: 0, //空闲状态
    Run: 1, //跑起来
    Jump: 2, //跳跃
    DoubleJump: 3, //空中翻滚
    Fall: 4, //下坠，
    Hit: 5, //被撞击了
    WalkJump: 6, //我都不知道干嘛
};

export const ObjectType = {
    Character: 'character',
    CoinObject: 'awardObject',
    CollisionObject: 'collisionObject',
    AwardObject: 'awardObject',
};

export const World = {
    MinJumpThreshold: 1.75, //跳跃的阈值,1.25个单位
    MaxJumpThreshold: 4.5, //跳跃的阈值,5个单位
    DoubleJumpThreshold: 2.5, //二段跳跃的阈值,1.25个单位
    JumpDuration: 60, //跳跃空中的时长 2T
    Unit: 16, //单位像素
};

export const JumpType = {
    Nope: 0, //没跳
    Jump: 1, //一级跳
    WalkJump: 2, // 边走边跳
    DoubleJump: 3, // 二级跳
};
export const GameInitState = {
    world: {
        screenWidth: 0,
        screenHeight: 0,
        width: 0,
        height: 0,
        pivotOffsetX: 0,
        pivotX: 0,
        gravity: 0, //重力加速度，程序中计算
        moveSpeed: 2, //移动速度，单位时间 1/60 秒所移动的距离
        maxJumpSpeed: 0, //最大跳跃初始速度，程序中计算
        minJumpSpeed: 0, //最小跳跃初始速度，程序中计算 大小跳的处理，本例中没有
        doubleJumpSpeed: 0, //二段速度，程序中计算
    },
    collision: {
        x: 0,
        y: 0,
        collision: false,
    },
    character: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        direction: CharacterDirections.Right,
        jumpTime: 0,
        jump: 0, //当前跳跃的高度
        onGrand: true,
        jumpType: JumpType.Nope, //0 =没跳 1 =一级跳  2 =二级跳
        mode: CharacterMode.Idle,
    },
};

export const CollisionType = {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
};

export const Levels = {
    Level1: 'level1',
    Level2: 'level2',
};
//奖励的名称
export const AwardNames = {
    Apple: 'apple',
    Banana: 'banana',
    Cherry: 'cherry',
    Kiwi: 'kiwi',
    Melon: 'melon',
    Orange: 'orange',
    Pineapple: 'pineapple',
    Strawberry: 'strawberry',
    Collected: 'collected',
};
