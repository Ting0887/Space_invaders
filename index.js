import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const background = new Image();
background.src = "images/space.jpg";

const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController);
const player = new Player(canvas, 3, playerBulletController);

let isGameOver = false;
let didwin = false;
let GameWin = new Audio("sounds/gamewin.wav");
GameWin.volume = 1;
let GameLose = new Audio("sounds/gameover.wav");
GameLose.volume = 1;

function game(){
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if(!isGameOver){
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);
    }
}

// 勝利或失敗顯示在遊戲畫面上
function displayGameOver(){
    if(isGameOver){
        let text = didwin ? "You Win" : "Game Over";
        let textOffset = didwin ? 3.5:5;

        ctx.fillStyle = "white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
}

function checkGameOver(){
    if(isGameOver){
        return;
    }
    //如果玩家被子彈擊中
    if(enemyBulletController.collideWith(player)){
        isGameOver = true;
        GameLose.currentTime = 0;
        GameLose.play();
    }
    //如果玩家碰到敵人
    if(enemyController.collideWith(player)){
        isGameOver = true;
        GameLose.currentTime = 0;
        GameLose.play();
    }
    if(enemyController.enemyRows.length === 0){
        didwin = true;
        isGameOver = true;
        GameWin.currentTime = 0;
        GameWin.play();
    }
}
setInterval(game, 1000/60);
