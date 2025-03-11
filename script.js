let wordToGuess = "";
const maxAttempts = 6;
let attempts = [];
let currentInput = [];
let usedLetters = {};

// Load words from the JSON file
fetch('mexicanadas.json')
  .then(response => response.json())
  .then(words => {
    wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
  })
  .catch(error => console.error("Error loading words:", error));

// Initialize visual keyboard
const keyboardContainer = document.getElementById("keyboard");
const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
alphabet.split("").forEach(letter => {
    const key = document.createElement("div");
    key.classList.add("key");
    key.textContent = letter;
    key.id = `key-${letter}`;
    key.addEventListener("click", () => addLetter(letter));
    keyboardContainer.appendChild(key);
});

// Create the row where the user types the word
const currentWordRow = document.getElementById("current-word");
for (let i = 0; i < 5; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    currentWordRow.appendChild(box);
}

// Add a letter to the current word being typed
function addLetter(letter) {
    if (currentInput.length < 5) {
        currentInput.push(letter);
        updateCurrentWord();
    }
}

// Remove the last letter typed
function removeLetter() {
    currentInput.pop();
    updateCurrentWord();
}

// Update the row where the user is typing the word
function updateCurrentWord() {
    const boxes = currentWordRow.children;
    for (let i = 0; i < 5; i++) {
        boxes[i].textContent = currentInput[i] || "";
    }
}

// Handle the guess attempt
function submitGuess() {
    if (currentInput.length !== 5) {
        alert("La palabra debe tener 5 letras.");
        return;
    }

    const guess = currentInput.join("");

    if (attempts.length >= maxAttempts) {
        alert("¡Se acabaron los intentos! La palabra correcta era: ${wordToGuess}");
        return;
    }

    attempts.push(guess);
    currentInput = [];
    updateBoard();
    updateKeyboard(guess);
    updateCurrentWord();

    if (guess === wordToGuess) {
        alert("¡Felicidades! Adivinaste la palabra.");
        // Display the correct word and stop the game
        return;
    }
}

// Handle physical keyboard input
document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();

    if (alphabet.includes(key) && currentInput.length < 5) {
        addLetter(key);
    } else if (event.key === "Backspace") {
        removeLetter();
    } else if (event.key === "Enter") {
        submitGuess();
    }
});

// Button to submit the guess
document.getElementById("guess-button").addEventListener("click", submitGuess);

// Update the attempt board
function updateBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = "";

    attempts.forEach(guess => {
        for (let i = 0; i < 5; i++) {
            const box = document.createElement("div");
            box.classList.add("letter-box");
            box.textContent = guess[i];

            if (guess[i] === wordToGuess[i]) {
                box.classList.add("correct");
                usedLetters[guess[i]] = "correct";
            } else if (wordToGuess.includes(guess[i])) {
                box.classList.add("present");
                if (!usedLetters[guess[i]]) usedLetters[guess[i]] = "present";
            } else {
                box.classList.add("absent");
                if (!usedLetters[guess[i]]) usedLetters[guess[i]] = "absent";
            }

            board.appendChild(box);
        }
    });
}

// Update the keyboard after each guess
function updateKeyboard(guess) {
    guess.split("").forEach(letter => {
        const key = document.getElementById(`key-${letter}`);
        if (key && usedLetters[letter]) {
            key.classList.add(usedLetters[letter]);
        }
    });
}
