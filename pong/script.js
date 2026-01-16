const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "white"
};

// User Paddle (Left)
const user = {
    x: 0, 
    y: (canvas.height - 100) / 2, // Centered vertically
    width: 10,
    height: 100,
    score: 0,
    color: "white"
};

// Computer Paddle (Right)
const com = {
    x: canvas.width - 10, 
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
};

// Net (the dotted line in the middle)
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "white"
};

// 1. Draw Rectangles (Paddles & Net)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// 2. Draw Circle (Ball)
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// 3. Draw Text (Score)
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "45px courier new";
    ctx.fillText(text, x, y);
}

// 4. Draw the Net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// 5. Mouse Control
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// 6. Reset Ball (when someone scores)
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX; // Send it to the other player
    ball.speed = 7; // Reset speed
}

// 7. Collision Detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// 8. Update Game Logic (Movements, Physics)
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simple AI for Computer Paddle (0.1 is the "skill" level - higher is harder)
    com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

    // Top & Bottom Wall Collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Determine which paddle we need to check collision for
    let player = (ball.x < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {
        // Calculate where the ball hit the paddle
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        // Calculate angle (45 degrees max)
        let angleRad = (Math.PI / 4) * collidePoint;

        // Change X and Y velocity direction
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Speed up the ball every time it's hit
        ball.speed += 0.1;
    }

    // Score Update
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}

// 9. Render everything
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

// 10. The Game Loop
function game() {
    update();
    render();
}

// Run the game loop 50 times per second
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);