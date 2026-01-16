document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const rollBtn = document.getElementById('roll-btn');
    const resetHoldsBtn = document.getElementById('reset-holds-btn');
    const setDiceBtn = document.getElementById('set-dice-btn');
    const diceCountInput = document.getElementById('dice-count');

    // State to track dice
    // Each die object: { id: number, value: number, isHeld: boolean }
    let dice = [];

    // Initialize with default 5 dice
    initializeDice(5);

    // --- Event Listeners ---

    // Set number of dice
    setDiceBtn.addEventListener('click', () => {
        let count = parseInt(diceCountInput.value);
        if (count < 1) count = 1;
        if (count > 10) count = 10;
        diceCountInput.value = count;
        initializeDice(count);
    });

    // Roll dice
    rollBtn.addEventListener('click', rollDice);

    // Reset holds
    resetHoldsBtn.addEventListener('click', () => {
        dice.forEach(die => die.isHeld = false);
        renderDice();
    });

    // --- Functions ---

    function initializeDice(count) {
        dice = [];
        for (let i = 0; i < count; i++) {
            dice.push({
                id: i,
                value: 1, // Start at 1
                isHeld: false
            });
        }
        renderDice();
    }

    function rollDice() {
        // Add a shaking animation class (optional visual flair)
        diceContainer.classList.add('shaking');

        // Logic to update values
        dice.forEach(die => {
            if (!die.isHeld) {
                die.value = Math.ceil(Math.random() * 6);
            }
        });

        // Small timeout to allow "animation" feeling
        setTimeout(() => {
            renderDice();
            diceContainer.classList.remove('shaking');
        }, 200);
    }

    function toggleHold(index) {
        dice[index].isHeld = !dice[index].isHeld;
        renderDice();
    }

    function renderDice() {
        diceContainer.innerHTML = ''; // Clear current dice

        dice.forEach((die, index) => {
            const dieElement = document.createElement('div');
            dieElement.classList.add('die');
            
            if (die.isHeld) {
                dieElement.classList.add('held');
            }

            // Create the dots based on the value
            // We use a helper to determine dot positions for flex/grid
            createDots(die.value, dieElement);

            // Add click listener to toggle hold
            dieElement.addEventListener('click', () => toggleHold(index));

            diceContainer.appendChild(dieElement);
        });
    }

    // Helper to draw the correct pattern of dots
    function createDots(value, container) {
        // We need to position dots specifically for 1-6
        // To keep CSS simple, we can use specific classes for face layouts
        // or just brute force grid areas as defined in CSS.
        
        // This array maps the die value to which grid areas (a-g) should have dots
        // based on the CSS grid-template-areas:
        // "a . c"
        // "e g f"
        // "d . b"
        
        const layouts = {
            1: ['g'],
            2: ['a', 'b'],
            3: ['a', 'g', 'b'],
            4: ['a', 'c', 'd', 'b'],
            5: ['a', 'c', 'g', 'd', 'b'],
            6: ['a', 'c', 'e', 'f', 'd', 'b']
        };

        const areas = layouts[value];

        areas.forEach(area => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.style.gridArea = area;
            container.appendChild(dot);
        });
    }
});