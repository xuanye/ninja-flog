export * from './assets';

export * from './event-names';

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
};

export const World = {
    Character: {
        Speed: 2, //移动速度
        JumpSpeed: 3, //跳跃速度
        JumpThreshold: 50, //跳跃的阈值
    },
    Gravity: 3, //重力加速度
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
        pivotX: 0,
    },
    character: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        direction: CharacterDirections.Right,
        jump: 0,
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
