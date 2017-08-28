/* tslint:disable: align no-empty max-line-length no-any*/
import "introcs";
import Point from "./Point";
import Cell from "./Cell";
import Snake from "./Snake";
require("./stylesheet.css");

let WIDTH: number = 370;
let HEIGHT: number = 370;
let MOBILE: boolean = false;
const GAMEPAD_HEIGHT: number = 110;
const SCORE_HEIGHT: number = 30;
const GRID_SIZE: number = 24;
const GRID_BORDER: number = 1;
const BACKGROUND: string = "#8D977F";
const CELL_COLOR: string = "RGBA(51, 51, 51, 1.00)";
const SHADOW_COLOR: string = "RGBA(76, 76, 76, 0.25)";
const FOOD_COLOR: string = "black";
const SHOW_SHADOW: boolean = true;
const SHADOW_OFFSET: number = 2;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let ticks: number = 0;
let grid: Cell[][];
let snake: Snake;
let food: Point[];
let hideGrid: boolean = true;
let run: boolean = false;
let score: number = 0;
let highScore: number = 0;

setInterval(function () {
    update();
    draw();
}, 100);

initializeCanvas();
initializeGame();
initializeGamepad();
update();
draw();

function initializeCanvas() {
    if (screen.width < screen.height) {
        MOBILE = true;
        WIDTH = screen.width - 4;
        HEIGHT = screen.width - 4;
    }

    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT + SCORE_HEIGHT;
    canvas.style.marginTop = "10px";
    ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    document.getElementById("container")!.appendChild(canvas);
    document.getElementById("container")!.style.textAlign = "center";
    document.getElementById("container")!.style.overflowY = "auto";
    document.addEventListener("keydown", onKey);
}

function initializeGamepad() {
    if (MOBILE) {
        let gamepad: HTMLDivElement = document.createElement("div");
        gamepad.id = "gamepad";
        gamepad.style.width = WIDTH + "px";

        let leftButton: HTMLButtonElement = document.createElement("button");
        leftButton.className = "dpadBtn";
        leftButton.id = "left";
        leftButton.innerHTML = "Left";
        leftButton.onclick = function () {
            hideGrid = false;
            snake.setDirection("left");
            return true;
        };

        let rightButton: HTMLButtonElement = document.createElement("button");
        rightButton.className = "dpadBtn";
        rightButton.id = "right";
        rightButton.innerHTML = "Right";
        rightButton.onclick = function () {
            hideGrid = false;
            snake.setDirection("right");
            return true;
        };

        let upButton: HTMLButtonElement = document.createElement("button");
        upButton.className = "dpadBtn";
        upButton.id = "up";
        upButton.innerHTML = "Up";
        upButton.onclick = function () {
            hideGrid = false;
            snake.setDirection("up");
            return true;
        };

        let downButton: HTMLButtonElement = document.createElement("button");
        downButton.className = "dpadBtn";
        downButton.id = "down";
        downButton.innerHTML = "Down";
        downButton.onclick = function () {
            hideGrid = false;
            snake.setDirection("down");
            return true;
        };

        document.getElementById("container")!.appendChild(gamepad);
        gamepad.appendChild(leftButton);
        gamepad.appendChild(rightButton);
        gamepad.appendChild(upButton);
        gamepad.appendChild(downButton);
        gamepad.onclick = function () { return true; };
    }
}

function initializeGame() {
    grid = new Array<Cell[]>();
    snake = new Snake(1, 2);
    food = new Array<Point>();

    for (let x: number = 0; x < GRID_SIZE; x++) {
        grid[x] = new Array<Cell>();
        for (let y: number = 0; y < GRID_SIZE; y++) {
            grid[x][y] = new Cell(false);
        }
    }
    addFood();
    snake.deathCallback = function () {
        run = false;
        setTimeout(function () {
            for (let x: number = 0; x < GRID_SIZE; x++) {
                for (let y: number = 0; y < GRID_SIZE; y++) {
                    if (grid[x][y].active) {
                        grid[x][y].color = "RGBA(100, 0, 0, 0.5)";
                        console.log(hideGrid);
                    }
                }
            }
        }, 10);
        setTimeout(function () {
            reset();
        }, 750);
    };
    run = true;
}

/**
 * Resets the game back to the start menu, and updates the highscore if possible.
 */
function reset() {
    hideGrid = true;
    if (score > highScore) {
        highScore = score;
    }
    score = 0;
    initializeGame();
}

/**
 * Updates the games every few milliseconds.
 */
function update() {
    ticks++;
    if (!hideGrid && run) {
        snake.move();

        if (snake.head.x < 0 || snake.head.x >= GRID_SIZE || snake.head.y < 0 || snake.head.y >= GRID_SIZE) {
            snake.deathCallback();
        }

        for (let x: number = 0; x < GRID_SIZE; x++) {
            for (let y: number = 0; y < GRID_SIZE; y++) {
                grid[x][y].active = snake.isAtCoordinates(x, y);
                if (grid[x][y].active) {
                    grid[x][y].color = "RGBA(51, 51, 51, 1.00)";
                }
            }
        }

        let foodToRemove: number[] = new Array<number>();
        for (let i: number = 0; i < food.length; i++) {
            let point: Point = food[i];
            if (snake.isAtCoordinates(point.x, point.y)) {
                snake.addTailPart();
                foodToRemove.push(i);
                addFood();
                score += 10;
            } else {
                grid[point.x][point.y].color = "black";
                grid[point.x][point.y].active = true;
            }
        }

        for (let i: number = 0; i < foodToRemove.length; i++) {
            food.splice(i, 1);
        }
    }
}

/**
 * Draws the game and text upon the canvas.
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = SHADOW_COLOR;
    ctx.lineWidth = 4;
    ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, HEIGHT, WIDTH, SCORE_HEIGHT);
    ctx.strokeStyle = SHADOW_COLOR;
    ctx.lineWidth = 4;
    ctx.strokeRect(1, HEIGHT, WIDTH - 2, SCORE_HEIGHT - 2);

    if (SHOW_SHADOW) {
        ctx.shadowColor = SHADOW_COLOR;
        ctx.shadowOffsetX = SHADOW_OFFSET;
        ctx.shadowOffsetY = SHADOW_OFFSET;
    }

    if (!hideGrid) {
        for (let x: number = 0; x < GRID_SIZE; x++) {
            for (let y: number = 0; y < GRID_SIZE; y++) {
                if (grid[x][y].active) {
                    ctx.fillStyle = grid[x][y].color;
                } else {
                    ctx.fillStyle = "RGBA(76, 76, 76, 0.02)";
                }
                ctx.fillRect(x * WIDTH / GRID_SIZE + GRID_BORDER, y * HEIGHT / GRID_SIZE + GRID_BORDER, WIDTH / GRID_SIZE - GRID_BORDER * 2, HEIGHT / GRID_SIZE - GRID_BORDER * 2);
            }
        }
    }

    if (hideGrid) {
        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let loc: Point = new Point(WIDTH / 2, HEIGHT / 2 - 40);
        ctx.fillStyle = CELL_COLOR;
        ctx.fillText("SNAKE", loc.x, loc.y);

        if (ticks > 5) {
            ctx.font = "20px Arial";
            ctx.fillText("Retro LCD Edition", loc.x, loc.y + 50);
        }

        if (ticks > 15 && Math.floor(ticks / 5) % 2 === 0) {
            ctx.font = "16px Arial";
            ctx.fillText("Press Any Key to Play", loc.x, loc.y + 120);
        }

        if (ticks > 150 && highScore === 0) { // https://en.wikipedia.org/wiki/Easter_egg_(media)
            ctx.font = "12px Arial";
            ctx.fillText("Truthfully, I hate snake - Idrees", loc.x, HEIGHT - 13);
        }
    }

    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = CELL_COLOR;
    ctx.fillText("SCORE: " + score, 5, HEIGHT + SCORE_HEIGHT / 2);
    ctx.fillText("HIGHSCORE: " + highScore, WIDTH - 180, HEIGHT + SCORE_HEIGHT / 2);
}

/**
 * Adds a food particle to the grid.
 */
function addFood() {
    let point: Point = new Point(randomIntFromInterval(0, GRID_SIZE - 1), randomIntFromInterval(0, GRID_SIZE - 1));
    if (snake.isAtCoordinates(point.x, point.y)) {
        point = new Point(randomIntFromInterval(0, GRID_SIZE - 1), randomIntFromInterval(0, GRID_SIZE - 1));
    }
    food.push(point);
}

/**
 * Executes every time a key is pressed.
 * @param event The keyboard event to analyze
 */
function onKey(event: KeyboardEvent) {
    if (hideGrid) {
        hideGrid = false;
    } else if (event.keyCode === 37) {
        snake.setDirection("left");
    } else if (event.keyCode === 38) {
        snake.setDirection("up");
    } else if (event.keyCode === 39) {
        snake.setDirection("right");
    } else if (event.keyCode === 40) {
        snake.setDirection("down");
    }
}

/**
 * Returns a random number between the given min and max bounds.
 * @param min The minimum number (inclusive)
 * @param max The maximum number (inclusive)
 */
function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
