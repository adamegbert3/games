const squares = document.querySelectorAll('.square');
const timeLeftDisplay = document.querySelector('#time-left');
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#startBtn');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let countDownTimerId = null;

function randomSquare() {
    // 1. Remove the 'mole' class from all squares
    squares.forEach(square => {
        square.classList.remove('mole');
    });

    // 2. Select a random square
    let randomSquare = squares[Math.floor(Math.random() * 9)];
    
    // 3. Add the 'mole' class to it
    randomSquare.classList.add('mole');

    // 4. Save the id of the random square so we know where to click
    hitPosition = randomSquare.id;
}

squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        // If the square clicked matches the current mole position
        if (square.id == hitPosition) {
            result++;
            scoreDisplay.textContent = result;
            hitPosition = null; // Reset so you can't double click
            
            // Visual feedback (optional): clear the mole immediately
            square.classList.remove('mole');
        }
    });
});

function moveMole() {
    // Move the mole every 700 milliseconds
    timerId = setInterval(randomSquare, 700);
}

function countDown() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;

    if (currentTime == 0) {
        clearInterval(countDownTimerId);
        clearInterval(timerId);
        alert('GAME OVER! Your final score is ' + result);
    }
}

function startGame() {
    // Reset everything
    result = 0;
    currentTime = 60;
    scoreDisplay.textContent = 0;
    timeLeftDisplay.textContent = 60;
    
    // Clear any existing timers just in case
    clearInterval(timerId);
    clearInterval(countDownTimerId);

    // Start the timers
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
}

startBtn.addEventListener('click', startGame);