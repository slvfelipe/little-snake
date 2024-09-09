const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;
let speed = 100; // Initial speed interval in milliseconds

let snake1 = [{x: 10 * gridSize, y: 10 * gridSize}];
let snake2 = [{x: 15 * gridSize, y: 15 * gridSize}];
let food = {x: 5 * gridSize, y: 5 * gridSize};
let dx1 = gridSize, dy1 = 0;
let dx2 = -gridSize, dy2 = 0;
let score1 = 0;
let score2 = 0;
let gameInterval = setInterval(main, speed);

document.addEventListener('keydown', changeDirection);

function main() {
    if (gameOver()) {
        clearInterval(gameInterval);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        ctx.fillText('Press F5 to restart', canvas.width / 4, canvas.height / 2 + 40);
        return;
    }

    clearCanvas();
    drawFood();
    moveSnake(snake1, dx1, dy1);
    moveSnake(snake2, dx2, dy2);
    drawSnake(snake1, 'green');
    drawSnake(snake2, 'blue');
    checkFoodCollision();
    drawScores();
    updateSpeed();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(snake, color) {
    ctx.fillStyle = color;
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

function moveSnake(snake, dx, dy) {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) {
    switch (event.key) {
        // Player 1 Controls (Arrow keys)
        case 'ArrowUp':
            if (dy1 === 0) { dx1 = 0; dy1 = -gridSize; }
            break;
        case 'ArrowDown':
            if (dy1 === 0) { dx1 = 0; dy1 = gridSize; }
            break;
        case 'ArrowLeft':
            if (dx1 === 0) { dx1 = -gridSize; dy1 = 0; }
            break;
        case 'ArrowRight':
            if (dx1 === 0) { dx1 = gridSize; dy1 = 0; }
            break;

        // Player 2 Controls (WASD keys)
        case 'w':
        case 'W':
            if (dy2 === 0) { dx2 = 0; dy2 = -gridSize; }
            break;
        case 's':
        case 'S':
            if (dy2 === 0) { dx2 = 0; dy2 = gridSize; }
            break;
        case 'a':
        case 'A':
            if (dx2 === 0) { dx2 = -gridSize; dy2 = 0; }
            break;
        case 'd':
        case 'D':
            if (dx2 === 0) { dx2 = gridSize; dy2 = 0; }
            break;
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function checkFoodCollision() {
    if (snake1[0].x === food.x && snake1[0].y === food.y) {
        score1++;
        snake1.push({}); // Adds a new segment to the snake
        placeFood();
    } else if (snake2[0].x === food.x && snake2[0].y === food.y) {
        score2++;
        snake2.push({}); // Adds a new segment to the snake
        placeFood();
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCountX) * gridSize,
        y: Math.floor(Math.random() * tileCountY) * gridSize
    };
}

function drawScores() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Player 1 Score: ${score1}`, 10, 20);
    ctx.fillText(`Player 2 Score: ${score2}`, canvas.width - 150, 20);
}

function updateSpeed() {
    const newSpeed = Math.max(50, 100 - (Math.max(score1, score2) * 2));
    if (newSpeed !== speed) {
        clearInterval(gameInterval);
        speed = newSpeed;
        gameInterval = setInterval(main, speed);
    }
}

function gameOver() {
    const head1 = snake1[0];
    if (head1.x < 0 || head1.x >= canvas.width || head1.y < 0 || head1.y >= canvas.height) {
        return true;
    }

    const head2 = snake2[0];
    if (head2.x < 0 || head2.x >= canvas.width || head2.y < 0 || head2.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake1.length; i++) {
        if (head1.x === snake1[i].x && head1.y === snake1[i].y) {
            return true;
        }
    }
    for (let i = 1; i < snake2.length; i++) {
        if (head2.x === snake2[i].x && head2.y === snake2[i].y) {
            return true;
        }
    }

    for (let i = 0; i < snake1.length; i++) {
        if (head2.x === snake1[i].x && head2.y === snake1[i].y) {
            return true;
        }
    }
    for (let i = 0; i < snake2.length; i++) {
        if (head1.x === snake2[i].x && head1.y === snake2[i].y) {
            return true;
        }
    }

    return false;
}
