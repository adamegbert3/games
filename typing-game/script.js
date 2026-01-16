const wordContainer = document.getElementById('word-container');
const textInput = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endGameEl = document.getElementById('end-game-container');
const finalScoreEl = document.getElementById('final-score');

// 1. The Word List
const words = [
    'html', 'css', 'javascript', 'variable', 'function', 
    'array', 'object', 'loop', 'browser', 'developer',
    'game', 'arcade', 'keyboard', 'screen', 'pixel',
    'monitor', 'mouse', 'click', 'button', 'input',
    'react', 'angular', 'vue', 'node', 'python'
];

let score = 0;
let time = 30; // 30 seconds game duration
let difficulty = 2; // Speed of falling (pixels per tick)

// Focus on input immediately
textInput.focus();

// 2. Game Loops
// Every 1 second, update timer
const timeInterval = setInterval(updateTime, 1000);

// Every 2 seconds, spawn a new word
const wordSpawnInterval = setInterval(addWordToDOM, 2000);

// Every 50ms, move all words down
const moveInterval = setInterval(moveWords, 50);

// 3. Add a word to the screen
function addWordToDOM() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    const wordEl = document.createElement('div');
    wordEl.classList.add('word');
    wordEl.innerText = randomWord;
    
    // Random X position (between 20px and 450px)
    wordEl.style.left = Math.floor(Math.random() * 430) + 20 + 'px';
    wordEl.style.top = '0px';
    
    wordContainer.appendChild(wordEl);
}

// 4. Move words down logic
function moveWords() {
    const currentWords = document.querySelectorAll('.word');
    
    currentWords.forEach(wordEl => {
        // Get current top value (parse number from "10px")
        let top = parseInt(wordEl.style.top);
        
        // Increase top value
        wordEl.style.top = `${top + difficulty}px`;

        // Check if word hit the bottom (300px height of container)
        if (top > 280) {
            gameOver();
        }
    });
}

// 5. Input Event Listener (Checking matches)
textInput.addEventListener('input', e => {
    const insertedText = e.target.value;
    const currentWords = document.querySelectorAll('.word');

    currentWords.forEach(wordEl => {
        if (wordEl.innerText === insertedText) {
            // MATCH FOUND!
            wordEl.remove();      // Remove word from screen
            e.target.value = '';  // Clear input box
            score++;
            scoreEl.innerText = score;

            // Optional: Increase difficulty slightly every 5 points
            if (score % 5 === 0) {
                difficulty++;
            }
        }
    });
});

function updateTime() {
    time--;
    timeEl.innerHTML = time + 's';

    if (time === 0) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(timeInterval);
    clearInterval(wordSpawnInterval);
    clearInterval(moveInterval);
    
    endGameEl.style.display = 'flex';
    finalScoreEl.innerText = score;
}