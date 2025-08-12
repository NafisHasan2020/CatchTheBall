// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score-value');
const gameOverElement = document.getElementById('game-over');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Load images for ball and paddle
const ballImage = new Image();
ballImage.src = 'ball.png'; // Ensure ball.png is in your project folder
const paddleImage = new Image();
paddleImage.src = 'paddle.png'; // Ensure paddle.png is in your project folder

// Game objects
let paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 20,
    speed: 8,
    dx: 0
};

let ball = {
    x: canvas.width / 2,
    y: 50,
    radius: 10,
    speed: 4,
    dy: 4
};

let score = 0;
let gameOver = false;

// Handle paddle movement (keyboard)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
    if (e.key === 'ArrowRight') paddle.dx = paddle.speed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') paddle.dx = 0;
});

// Add touch controls for mobile
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX - canvas.offsetLeft;
    paddle.x = touchX - paddle.width / 2;
});

// Draw paddle using image
function drawPaddle() {
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball using image
function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

// Update game state
function update() {
    if (gameOver) return;

    // Move paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Move ball
    ball.y += ball.dy;

    // Ball collision with paddle
    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        score++;
        scoreElement.textContent = score;
        resetBall();
    }

    // Ball out of bounds
    if (ball.y + ball.radius > canvas.height) {
        gameOver = true;
        gameOverElement.style.display = 'block';
    }
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = 50;
    ball.dy += 0.5; // Increase speed slightly
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    gameOverElement.style.display = 'none';
    resetBall();
    ball.dy = 4;
    gameLoop();
}

// Ensure images are loaded before starting the game
ballImage.onload = paddleImage.onload = () => {
    gameLoop();
};