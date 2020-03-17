import { CharacterDirections } from '../constants';
import { Component } from '../core/pitaya';
import { Sprite } from 'pixi.js';

/**
 * 用于手机端控制角色行动的处理
 */
export class ControllerBoard extends Component {
    constructor() {
        super({});
        this.boardState = {
            Jump: false,
            ArrowRight: false,
            ArrowLeft: false,
            JumpTime: 0,
        };
        this.keyCodes = Object.keys(this.boardState);
    }
    create() {}
    /**
     * 场景挂起时取消事件注册
     */
    pause() {}

    /**
     * 场景恢复时，重新注册事件
     */
    resume() {}
    onResize({ width, height, screenWidth, screenHeight, realWidth, realHeight }) {}

    update(delta, gameState) {
        //角色死亡了
        if (gameState.character.health <= 0) {
            return;
        }
        let moving = false;
        let onTheGround = false;
        let moveDirection = 0;
        //是否在移动
        moving = this.boardState.ArrowLeft || this.boardState.ArrowRight;

        if (this.boardState.ArrowLeft) {
            moveDirection = CharacterDirections.Left;
            gameState.character.direction = CharacterDirections.Left;
        }
        if (this.boardState.ArrowRight) {
            moveDirection = CharacterDirections.Right;
            gameState.character.direction = CharacterDirections.Right;
        }
        //是否已经落在地面
        onTheGround = gameState.collision.collision && gameState.collision.y > 0;

        if (onTheGround) {
            gameState.character.jumpType = 0;
        }
        if (this.boardState.Jump) {
            if (onTheGround) {
                //console.log('onTheGround');
                //console.log('Jump');
                gameState.character.jumpType = 1;
                gameState.character.vy = gameState.world.maxJumpSpeed;
            } else {
                if (gameState.character.jumpType != 2) {
                    //console.log('DoubleJump');
                    //处理二段跳的逻辑,
                    gameState.character.jumpType = 2;
                    gameState.character.vy = gameState.world.doubleJumpSpeed;
                }
            }
            this.touchBoardState.Jump = false;
        } else {
            if (onTheGround) {
                gameState.character.vy = 0;
            }
        }
        //顶部碰头
        if (gameState.collision.collision && gameState.collision.y < 0) {
            gameState.character.vy = 0;
        }

        //无时无刻不受重力影响
        gameState.character.vy += delta * gameState.world.gravity;

        if (!onTheGround && gameState.character.vx != 0) {
            //角色在空中，并有初始速度，则继续沿抛物线前进
            //飘落的逻辑很诡异
            moveDirection = gameState.character.direction;
        }
        //console.log('Keyboard -> update ->  gameState.character.vy', gameState.character.vy);
        gameState.character.vx = moveDirection * gameState.world.moveSpeed;
        gameState.character.onTheGround = onTheGround;
        gameState.character.moving = moving;
    }
}
