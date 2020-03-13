import { CharacterDirections, CharacterMode, World } from '../constants';
import { utils } from 'pixi.js';
/**
 * 用于手机端控制角色行动的处理
 */
export class TouchBoard {
    constructor(stage) {
        this.touchBoardState = {
            Jump: false,
            ArrowRight: false,
            ArrowLeft: false,
            JumpTime: 0,
        };

        this.startPoint = {};
        this.touchCount = 0;
        this.stage = stage;
        this.keyCodes = Object.keys(this.touchBoardState);
    }

    /**
     * 场景挂起时取消事件注册
     */
    pause() {
        if (this.onTouchStart) {
            this.stage.off('touchstart', this.onTouchStart);
            this.onTouchStart = null;
        }
        if (this.onTouchMove) {
            this.stage.off('touchmove', this.onTouchMove);
            this.onTouchMove = null;
        }

        if (this.onTouchEnd) {
            this.stage.off('touchend', this.onTouchEnd);
            this.stage.off('touchendoutside', this.onTouchEnd);
            this.stage.off('touchcancel', this.onTouchEnd);

            this.onTouchEnd = null;
        }
    }
    /**
     * 场景恢复时，重新注册事件
     */
    resume() {
        this.stage.interactive = true;

        //console.log('keyborad resume');
        this.onTouchStart = e => {
            //e.data.global={x,y}
            // e.stopPropagation();
            let id = '_' + e.data.pointerId;
            // console.log('start', id);
            this.startPoint[id] = { x: e.data.global.x, y: e.data.global.y };
            this.touchCount++;
        };
        this.onTouchMove = e => {
            //e.stopPropagation();

            let id = '_' + e.data.pointerId;
            let lastPoint = this.startPoint[id];
            if (!lastPoint) {
                return;
            }
            let movePoint = e.data.global;

            if (movePoint.x - lastPoint.x > 20) {
                this.touchBoardState.ArrowRight = true;
            } else if (movePoint.x - lastPoint.x < -20) {
                this.touchBoardState.ArrowLeft = true;
            } else {
                this.touchBoardState.ArrowLeft = false;
                this.touchBoardState.ArrowRight = false;
            }
        };

        this.onTouchEnd = e => {
            //e.stopPropagation();
            let id = '_' + e.data.pointerId;
            //console.log('end', id);
            let lastPoint = this.startPoint[id];
            if (!lastPoint) {
                return;
            }
            //delete this.startPoint[id];
            this.touchCount--;
            if (this.touchCount <= 0) {
                this.touchBoardState.ArrowLeft = false;
                this.touchBoardState.ArrowRight = false;
                this.touchCount = 0;
            }
            let movePoint = e.data.global;
            if (lastPoint.y - movePoint.y > 20) {
                //this.touchBoardState.JumpTime = +new Date();
                this.touchBoardState.Jump = true;
            }
        };
        this.stage.on('touchstart', this.onTouchStart);
        this.stage.on('touchmove', this.onTouchMove);
        this.stage.on('touchend', this.onTouchEnd);
        this.stage.on('touchendoutside', this.onTouchEnd);
        this.stage.on('touchcancel', this.onTouchEnd);
    }

    update(delta, gameState) {
        //角色死亡了
        if (gameState.character.health <= 0) {
            return;
        }
        let moving = false;
        let onTheGround = false;
        let moveDirection = 0;
        //是否在移动
        moving = this.touchBoardState.ArrowLeft || this.touchBoardState.ArrowRight;

        if (this.touchBoardState.ArrowLeft) {
            moveDirection = CharacterDirections.Left;
            gameState.character.direction = CharacterDirections.Left;
        }
        if (this.touchBoardState.ArrowRight) {
            moveDirection = CharacterDirections.Right;
            gameState.character.direction = CharacterDirections.Right;
        }
        //是否已经落在地面
        onTheGround = gameState.collision.collision && gameState.collision.y > 0;

        if (onTheGround) {
            gameState.character.jumpType = 0;
        }
        if (this.touchBoardState.Jump) {
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

        //设置角色状态
        if (gameState.character.jumpType == 2) {
            gameState.character.mode = CharacterMode.DoubleJump;
        } else if (gameState.character.jumpType == 1) {
            gameState.character.mode = CharacterMode.Jump;
        } else if (!onTheGround && gameState.collision.y > 1) {
            gameState.character.mode = CharacterMode.Fall;
        } else if (moving) {
            gameState.character.mode = CharacterMode.Run;
        } else {
            gameState.character.mode = CharacterMode.Idle;
        }
    }
}
