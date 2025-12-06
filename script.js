const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game Constants
const PADDLE_HEIGHT = 15;
const PADDLE_WIDTH = 100;
const BALL_RADIUS = 8;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 9;
const BRICK_PADDING = 15;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 35;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;

// Colors
const COLOR_PADDLE = '#0f3460';
const COLOR_BALL = '#e94560';
const COLOR_BRICK = '#533483';
const COLOR_TEXT = '#fff';

// Game State
let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;
let gameRunning = true;

// Paddle
let paddleX = (canvas.width - PADDLE_WIDTH) / 2;

// Ball
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

// Bricks
const bricks = [];
for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    bricks[c] = [];
    for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Event Listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - PADDLE_WIDTH / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + BRICK_WIDTH && y > b.y && y < b.y + BRICK_HEIGHT) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    scoreElement.innerText = score;
                    if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = COLOR_BALL;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#e94560'; // Using the highlight color for visibility
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                const brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = COLOR_BRICK;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Wall Collision
    if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) {
        dx = -dx;
    }
    if (y + dy < BALL_RADIUS) {
        dy = -dy;
    } else if (y + dy > canvas.height - BALL_RADIUS - 10) { // Check bottom
        if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
            // Paddle hit logic: Add some angle variation based on hit position could be nice, 
            // but for now simple bounce
            dy = -dy;
            // Speed up slightly on paddle hit to make it interesting?
            // dx = dx * 1.05; 
            // dy = dy * 1.05;
        } else if (y + dy > canvas.height - BALL_RADIUS) {
            // Game Over
            // alert('GAME OVER');
            // document.location.reload();
            // Instead of blocking alert, let's just reset for now or stop
            lives--;
            if (!lives) {
                // alert("GAME OVER");
                // document.location.reload();
                // To avoid blocking the browser continuously in development:
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - PADDLE_WIDTH) / 2;
                score = 0;
                scoreElement.innerText = score;
                // createBricks(); // Reset bricks if we want full reset
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    // Paddle Movement
    if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();
