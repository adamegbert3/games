const computerDisplay = document.getElementById('computer-choice');
const userDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');
const possibleChoices = document.querySelectorAll('button');

let userChoice;
let computerChoice;
let result;

// Add a click event to every button
possibleChoices.forEach(button => button.addEventListener('click', (e) => {
    // 1. Get user choice (the ID of the button clicked)
    userChoice = e.target.id; 
    
    // Some logic to handle clicking the emoji vs the button edge
    if(!userChoice) userChoice = e.target.parentElement.id; 
    
    userDisplay.innerHTML = userChoice;

    // 2. Generate computer choice
    generateComputerChoice();

    // 3. Compare and get result
    getResult();
}));

function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3) + 1; // Generates 1, 2, or 3
    
    if (randomNumber === 1) {
        computerChoice = 'rock';
    }
    if (randomNumber === 2) {
        computerChoice = 'scissors';
    }
    if (randomNumber === 3) {
        computerChoice = 'paper';
    }
    computerDisplay.innerHTML = computerChoice;
}

function getResult() {
    if (computerChoice === userChoice) {
        result = "It's a draw!";
    } else if (computerChoice === 'rock' && userChoice === 'paper') {
        result = "You win!";
    } else if (computerChoice === 'rock' && userChoice === 'scissors') {
        result = "You lost!";
    } else if (computerChoice === 'paper' && userChoice === 'scissors') {
        result = "You win!";
    } else if (computerChoice === 'paper' && userChoice === 'rock') {
        result = "You lost!";
    } else if (computerChoice === 'scissors' && userChoice === 'rock') {
        result = "You win!";
    } else if (computerChoice === 'scissors' && userChoice === 'paper') {
        result = "You lost!";
    }
    
    resultDisplay.innerHTML = result;
}