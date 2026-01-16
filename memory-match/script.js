const gridDisplay = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result');
const movesDisplay = document.querySelector('#moves');
const restartBtn = document.querySelector('#restartBtn');

// The cards: 6 pairs of emojis
const cardArray = [
    { name: 'fries', img: '🍟' },
    { name: 'fries', img: '🍟' },
    { name: 'cheeseburger', img: '🍔' },
    { name: 'cheeseburger', img: '🍔' },
    { name: 'hotdog', img: '🌭' },
    { name: 'hotdog', img: '🌭' },
    { name: 'ice-cream', img: '🍦' },
    { name: 'ice-cream', img: '🍦' },
    { name: 'milkshake', img: '🥤' },
    { name: 'milkshake', img: '🥤' },
    { name: 'pizza', img: '🍕' },
    { name: 'pizza', img: '🍕' }
];

let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let moves = 0;

// 1. Shuffle and Create Board
function createBoard() {
    // Randomize the array
    cardArray.sort(() => 0.5 - Math.random());

    // Clean up the grid in case of restart
    gridDisplay.innerHTML = "";
    
    // Loop through the array to create card elements
    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('data-id', i);
        card.textContent = '❓'; // The "back" of the card
        card.addEventListener('click', flipCard);
        gridDisplay.appendChild(card);
    }
}

// 2. Flip Card Logic
function flipCard() {
    let cardId = this.getAttribute('data-id');
    
    // Prevent clicking the same card twice or clicking matched cards
    if (cardsChosenId.includes(cardId) || this.classList.contains('card-matched')) {
        return;
    }

    // Reveal the card
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    
    // Visual change
    this.classList.add('card-flipped');
    this.textContent = cardArray[cardId].img;

    // Check if we have 2 cards selected
    if (cardsChosen.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        // Wait 500ms so the user can see the second card before we check
        setTimeout(checkForMatch, 500);
    }
}

// 3. Check for Match Logic
function checkForMatch() {
    const cards = document.querySelectorAll('.card');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (cardsChosen[0] === cardsChosen[1]) {
        // MATCH FOUND!
        cards[optionOneId].textContent = '✅';
        cards[optionTwoId].textContent = '✅';
        
        cards[optionOneId].classList.add('card-matched');
        cards[optionTwoId].classList.add('card-matched');
        
        // Remove click listeners so you can't click them again
        cards[optionOneId].removeEventListener('click', flipCard);
        cards[optionTwoId].removeEventListener('click', flipCard);
        
        cardsWon.push(cardsChosen);
    } else {
        // NO MATCH - Flip them back
        cards[optionOneId].textContent = '❓';
        cards[optionTwoId].textContent = '❓';
        cards[optionOneId].classList.remove('card-flipped');
        cards[optionTwoId].classList.remove('card-flipped');
    }

    // Reset chosen arrays for the next turn
    cardsChosen = [];
    cardsChosenId = [];

    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === cardArray.length / 2) {
        resultDisplay.textContent = 'Congratulations! You found them all!';
    }
}

// 4. Restart Logic
restartBtn.addEventListener('click', () => {
    cardsWon = [];
    cardsChosen = [];
    cardsChosenId = [];
    moves = 0;
    resultDisplay.textContent = 0;
    movesDisplay.textContent = 0;
    createBoard();
});

// Start the game immediately
createBoard();