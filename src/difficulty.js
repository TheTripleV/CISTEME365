import Wind from './wind.js'

/**************************************************************
 * DIFFICULTY
 * ------------------------------------------------------------
 * there's probably a better way of doing this but o well
 * 
 * if adding a new difficulty, make a new difficulty method and
 * add to getDifficulty. getDifficulty is used to get the
 * difficulty w/ difficulty number
 **************************************************************/
export default class Difficulty {
    constructor(label, lives, wind, goal, width, speed, windScale) {
        //goal = number of icebergs to pass to complete level
        //width = percent * how wide the passage is (200), so if we want it smaller, width < 1
        //there's def a better way to implement this ^ but I can't think of anything better rn so feel free to change ofc
        //speed = horizontal speed of game, ex: 0.2x current speed
        //windScale = modifier to make wind's growth over levels easier/harder
        this.label = label;
        this.lives = lives;
        this.wind = wind;
        this.goal = goal;
        this.width = width;
        this.speed = speed;
        this.windScale = windScale;
    }


    static getDifficulty(difficulty) {
        if (difficulty == null) return this.difficulty1();
        if (difficulty == 1) return this.difficulty1();
        if (difficulty == 2) return this.difficulty2();
        if (difficulty == 3) return this.difficulty3();
    }

    static difficulty1() {
        let label = "Easy";
        let lives = 3;
        let wind = new Wind(0, 0, 0);
        let goal = 1;
        let width = 1; //keeping dist the same
        let speed = 5;
        let windScale = 0.9;
        return new Difficulty(label, lives, wind, goal, width, speed, windScale);
    }
    static difficulty2() {
        let label = "Med";
        let lives = 3;
        let wind = new Wind(0, 0.25, 0);
        let goal= 1;
        let width = 1;
        let speed = 7;
        let windScale = 1;
        return new Difficulty(label, lives, wind, goal, width, speed, windScale);
    }
    static difficulty3() {
        let label = "Hard";
        let lives = 3;
        let wind = new Wind(0, 0.5, 0);
        let goal = 2;
        let width = 0.8; //passage is a little smaller
        let speed = 8;
        let windScale = 1.1;
        return new Difficulty(label, lives, wind, goal, width, speed, windScale);
    }
}