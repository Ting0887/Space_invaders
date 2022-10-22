import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";


export default class EnemyController{
    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      ];
    enemyRows = [];

    currentDirection = MovingDirection.right;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;
    firebulletTimerDefault = 100;
    firebulletTimer = this.firebulletTimerDefault;
    constructor(canvas, enemyBulletController, playerBulletController){
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;

        this.enemyDeathSound = new Audio("sounds/enemy-death.wav");
        this.enemyDeathSound.volume = 0.1;

        this.createEnemies();
    }

    draw(ctx){
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDectection();
        this.drawEnemies(ctx);
        this.resetMoveDownTimer();
        this.firebullet();
    }

    collideWith(sprite){
        const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet)=>bullet.collideWith.sprite);
        bullet.collideWith(sprite);

        if(bulletThatHitSpriteIndex >= 0){
            this.bullet.splice(bulletThatHitSpriteIndex, 1);
            return true;
        }
        return false;
    }

    collisionDectection(){
        this.enemyRows.forEach((enemyRow)=>{
            enemyRow.forEach((enemy, enemyIndex)=>{
                if(this.playerBulletController.collideWith(enemy)){
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                    enemyRow.splice(enemyIndex, 1);
                }
            })
        })
        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
    }

    firebullet(){
        this.firebulletTimer--;
        if(this.firebulletTimer <= 0){
            this.firebulletTimer = this.firebulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random()* allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
        }
    }

    resetMoveDownTimer(){
        if(this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    decrementMoveDownTimer(){
        if(this.currentDirection === MovingDirection.downleft ||
            this.currentDirection === MovingDirection.downright){
                this.moveDownTimer --;
            }
    }

    updateVelocityAndDirection(){
        for(const enemyRow of this.enemyRows){
            if(this.currentDirection == MovingDirection.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                const rightMostEnemy = enemyRow[enemyRow.length - 1];
                if(rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width){
                    this.currentDirection = MovingDirection.downleft;
                    break;
                }
            }
                else if(this.currentDirection === MovingDirection.downleft){
                    if(this.moveDown(MovingDirection.left)){
                        break;
                    }
                }
                else if(this.currentDirection === MovingDirection.left){
                    this.xVelocity =- this.defaultXVelocity;
                    this.yVelocity = 0;
                    const leftMostEnemy = enemyRow[0];
                    if(leftMostEnemy.x <= 0){
                        this.currentDirection = MovingDirection.downright;
                        break;
                    }
                }
                else if(this.currentDirection === MovingDirection.downright){
                    if(this.moveDown(MovingDirection.right)){
                        break;
                    }
                }
        }
    }
    moveDown(newDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if(this.moveDownTimer <= 0){
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

    drawEnemies(ctx){
        this.enemyRows.flat().forEach((enemy)=>{
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        });
    }
    createEnemies(){
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex)=>{
                if(enemyNumber > 0){
                    this.enemyRows[rowIndex].push(new Enemy(enemyIndex*50, rowIndex*35, enemyNumber));
                }
            });
        });
    }
    collideWith(sprite){
        return this.enemyRows.flat().some((enemy)=>enemy.collideWith(sprite));
    }
}