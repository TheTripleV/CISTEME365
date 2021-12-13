import Ship from './ship.js'
import InputHandler from './input.js'
import ObstaclePair from './obstacle_pair.js';
import GhostShip from './ghost_ship.js'
import Wave from './wave.js'
import Wind from './wind.js'
import Difficulty from './difficulty.js'
import { GraphicsUtility } from "./graphics_utility.js";

import Canal from "./Canal.js"
import Gates from './Gates.js';


const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

const OBSTACLE_TYPE = {
    GLACIER: 0,
    ROCK: 1
};

export default class Game {

    constructor(gameWidth, gameHeight, gameDifficulty, ghostModeOn) {
        console.log("difficulty: " + gameDifficulty + ", ghost mode: " + ghostModeOn);

        // basic game information
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.ghostMode = ghostModeOn;

        // difficulty + properties
        this.difficulty = Difficulty.getDifficulty(gameDifficulty);
        this.lives = this.difficulty.lives;
        this.wind = this.difficulty.wind;
        this.goal = this.difficulty.goal;
        this.width = this.difficulty.width;
        this.speed = this.difficulty.speed;

        // stats to track for summary screen
        this.totalTime = 0;
        this.icebergCount = 0;

        // game objects (note wind is not a gameObject since it updates differently)
        this.ship = new Ship(this);
        this.ghost_ship = new GhostShip(this);
        this.obstacle_pair = new ObstaclePair(this, null, this.difficulty);
        this.wave = new Wave(this);
        this.wave2 = new Wave(this)
        this.wave3 = new Wave(this)
        this.gate = new Gates(this);
        this.gameObjects = [this.wave, this.wave2, this.wave3, this.ship, this.obstacle_pair];//, this.gate];


        // game state!
        this.gameState = GAMESTATE.RUNNING;
    }

    start() {
        new InputHandler(this.ship);
        if (this.ghostMode == "true") this.gameObjects.push(this.ghost_ship);
    }

    update(dt, timeStamp) {
        if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;

        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
        
        this.totalTime += dt/1000;
    }

    draw(ctx) {
        this.drawRunning(ctx);

        if(this.gameState === GAMESTATE.GAMEOVER) {
            // store data in local storage for summary page to access
            sessionStorage.setItem("totalTime", this.totalTime);
            sessionStorage.setItem("icebergCount", this.icebergCount);

            // draw game over window + button to move to summary page
            this.drawGameOverWindow(ctx);
        }
    }

    drawRunning(ctx) {
        // draw each item (boat, glaciers, waves)
        this.gameObjects.forEach(x => x.draw(ctx));

        // draw stats
        // score (iceberg count)
        let icebergCountY = 30;
        GraphicsUtility.drawStat(ctx, this, icebergCountY, "score:", this.icebergCount);

        // lives
        let livesY = icebergCountY * 2;
        GraphicsUtility.drawStat(ctx, this, livesY, "lives:", this.lives);

        // wind
        let windSpeedY = this.gameHeight / 2;
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity) * 100)/100;
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        GraphicsUtility.drawStat(ctx, this, windSpeedY, windSpeedText, windDirectionText);

        let arrowXMargin = 130;
        let arrowLengthStretch = 125; // arrow will be drawn to length of windVelocity * this
        GraphicsUtility.drawArrow(ctx, this.gameWidth - arrowXMargin, this.gameHeight / 2,
            this.gameWidth - arrowXMargin, this.gameHeight / 2 + this.wind.currentVelocity * arrowLengthStretch);
    }

    drawGameOverWindow(ctx) {
        // window
        ctx.rect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fill();

        // gmae over text
        GraphicsUtility.toGameHeaderFontStyle(ctx);
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);

        // button to summary page
        document.getElementById('summary').style.display = 'block';
        document.getElementById('summary').style.left = this.gameWidth/2 - 60;
        document.getElementById('summary').style.top = -280;
    }

    // helper methods
    generateObstacle() {
        return new ObstaclePair(this, OBSTACLE_TYPE.ROCK);
    }
}