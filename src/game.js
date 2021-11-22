import Ship from './ship.js'
import InputHandler from './input.js'
import glacier from './glacier_pair.js';
import Wind from './wind.js'

const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.lives = 1;
        this.icebergCount = 0;
        this.totalTime = 0;
    }

    start() {
        document.getElementById('summary').style.display = 'none';
        this.gamestate = GAMESTATE.RUNNING;
        this.wind = new Wind(0, 2, 5000); // note that these numbers are placeholder for testing
        this.ship = new Ship(this, this.wind)
        this.glacier_pair = new glacier(this);
        this.gameObjects = [this.ship, this.glacier_pair];
        new InputHandler(this.ship);
        this.icebergCount = 0;
        this.totalTime = 0;
    }

    update(dt, timeStamp) {
        if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;
        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
        this.totalTime += dt/1000;
        console.log(this.totalTime);
    }

    draw(ctx) {
        this.drawRunning(ctx);

        if(this.gameState == GAMESTATE.GAMEOVER) {
            this.drawGameOverWindow(ctx);
        }
    }

    drawRunning(ctx) {
        // draw each item (boat, glaciers)
        this.gameObjects.forEach(x => x.draw(ctx));

        // draw stats (wind)
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity) * 100)/100;
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.fillText(windSpeedText, this.gameWidth - 100, 30);
        ctx.textAlign = "right";
        ctx.fillText(windDirectionText, this.gameWidth - 15, 30);
    }

    drawGameOverWindow(ctx) {
        document.getElementById('summary').style.display = 'block';
        ctx.rect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
        document.getElementById('summary').style.left = this.gameWidth/2 - 60;
        document.getElementById('summary').style.top = -280;
    }
}