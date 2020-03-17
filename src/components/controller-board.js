import { CharacterDirections, TextureNames } from '../constants';
import { Component } from '../core/pitaya';
import { Sprite, Texture } from 'pixi.js';

/**
 * 用于手机端控制角色行动的处理
 */
export class ControllerBoard extends Component {
    constructor(options) {
        super(options);
        this.boardState = {
            Jump: false,
            ArrowRight: false,
            ArrowLeft: false,
            JumpTime: 0,
        };
        this.keyCodes = Object.keys(this.boardState);
    }
    create() {
        //console.log('ControllerBoard -> create -> TextureNames.Controller.left', TextureNames.Controller.Left);
        this.leftBtn = Sprite.from(TextureNames.Controller.Left);
        this.leftBtn.scale.set(0.5, 0.5);
        this.leftBtn.x = 50;
        this.leftBtn.y = this.state.height - this.leftBtn.height - 20;
        this.rightBtn = Sprite.from(TextureNames.Controller.Right);
        this.rightBtn.scale.set(0.5, 0.5);
        this.rightBtn.x = this.leftBtn.x + this.leftBtn.width + 20;
        this.rightBtn.y = this.leftBtn.y;
        this.upBtn = Sprite.from(TextureNames.Controller.Up);
        this.upBtn.scale.set(0.5, 0.5);
        this.upBtn.y = this.leftBtn.y - 30;
        this.upBtn.x = this.state.width - this.upBtn.width - 50;

        this.leftBtn.alpha = 0.6;
        this.rightBtn.alpha = 0.6;
        this.upBtn.alpha = 0.6;
        this.leftBtn.interactive = true;
        this.leftBtn.buttonMode = true;
        this.rightBtn.interactive = true;
        this.rightBtn.buttonMode = true;
        this.upBtn.interactive = true;
        this.upBtn.buttonMode = true;

        this.leftBtn.on('pointerdown', this.keyDown.bind(this, 'ArrowLeft'));
        this.leftBtn.on('pointerup', this.keyUp.bind(this, 'ArrowLeft'));
        this.leftBtn.on('pointerout', this.keyUp.bind(this, 'ArrowLeft'));
        this.leftBtn.on('pointerupoutside', this.keyUp.bind(this, 'ArrowLeft'));

        this.rightBtn.on('pointerdown', this.keyDown.bind(this, 'ArrowRight'));
        this.rightBtn.on('pointerup', this.keyUp.bind(this, 'ArrowRight'));
        this.rightBtn.on('pointerout', this.keyUp.bind(this, 'ArrowRight'));
        this.rightBtn.on('pointerupoutside', this.keyUp.bind(this, 'ArrowRight'));

        this.upBtn.on('pointertap', this.keyDown.bind(this, 'Jump'));

        this.addChild(this.leftBtn, this.rightBtn, this.upBtn);
    }
    keyDown(key) {
        console.log('ControllerBoard -> keyDown -> key', key);
        this.boardState[key] = true;
    }
    keyUp(key) {
        console.log('ControllerBoard -> keyUp -> key', key);
        this.boardState[key] = false;
    }
    onResize({ width, height, screenWidth, screenHeight, realWidth, realHeight }) {
        this.leftBtn.x = 50;
        this.leftBtn.y = realHeight - this.leftBtn.height - 20;
        this.rightBtn.x = this.leftBtn.x + this.leftBtn.width + 20;
        this.rightBtn.y = this.leftBtn.y;
        this.upBtn.y = this.leftBtn.y - 30;
        this.upBtn.x = realWidth - this.upBtn.width - 50;
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
            this.boardState.Jump = false;
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
