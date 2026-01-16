const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // This is the "pen" we use to draw
const scoreDisplay = document.getElementById("score");

// Game Settings
const gridSize = 20; // Size of one square (snake part or apple)
const tileCount = canvas.width / gridSize; // How many tiles wide/tall (20x20)

// Snake & Food
let score = 0;
let dx = gridSize; // Velocity X (moving right by default)
let dy = 0;        // Velocity Y
let foodX = 0;
let foodY = 0;

// The snake is an array of body parts. 
// We start in the middle.
let snake = [
    {x: 10 * gridSize, y: 10 * gridSize},
    {x: 9 * gridSize, y: 10 * gridSize},
    {x: 8 * gridSize, y: 10 * gridSize}
];

let changingDirection = false;

// Start the game
createFood();
main();

// Listen for keyboard presses
document.addEventListener("keydown", changeDirection);

function main() {
    if (didGameEnd()) {
        alert("Game Over! Score: " + score);
        return; 
    }

    changingDirection = false;

    // Use setTimeout to control the speed of the game (100ms)
    setTimeout(function onTick() {
        clearCanvas();
        advanceSnake();
        drawFood();
        drawSnake();
        
        // Repeat
        main();
    }, 100);
}

// 1. Clear the canvas (wipe the whiteboard)
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// 2. Move the snake logic
function advanceSnake() {
    // Create the new head based on current velocity
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Add new head to the beginning of the array
    snake.unshift(head);

    // Check if we ate food
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        scoreDisplay.innerHTML = "Score: " + score;
        createFood();
    } else {
        // If not, remove the tail to maintain size
        snake.pop();
    }
}

// 3. Draw the food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
    ctx.strokeStyle = "darkred";
    ctx.strokeRect(foodX, foodY, gridSize, gridSize);
}

// 4. Draw the snake
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "green";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

// 5. Generate random food location
function createFood() {
    foodX = Math.floor(Math.random() * tileCount) * gridSize;
    foodY = Math.floor(Math.random() * tileCount) * gridSize;

    // Make sure food doesn't spawn ON the snake
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

// 6. Handle Keyboard Input
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

// 7. Check for Game Over (collisions)
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        // Did head collide with body?
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - gridSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}