let wordToGuess = "";
const maxAttempts = 6;
let attempts = [];
let currentInput = [];
let usedLetters = {};

// Cargar palabras desde el archivo JSON
fetch('mexicanadas.json')
  .then(response => response.json())
  .then(words => {
    wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
  })
  .catch(error => console.error("Error cargando las palabras:", error));

// Inicializar el teclado visual
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

// Crear la fila de escritura debajo de los intentos
const currentWordRow = document.getElementById("current-word");
for (let i = 0; i < 5; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    currentWordRow.appendChild(box);
}

// Función para agregar una letra a la palabra en construcción
function addLetter(letter) {
    if (currentInput.length < 5) {
        currentInput.push(letter);
        updateCurrentWord();
    }
}

// Función para borrar la última letra
function removeLetter() {
    currentInput.pop();
    updateCurrentWord();
}

// Función para actualizar la fila donde se escribe la palabra
function updateCurrentWord() {
    const boxes = currentWordRow.children;
    for (let i = 0; i < 5; i++) {
        boxes[i].textContent = currentInput[i] || "";
    }
}

// Función para manejar el intento
function submitGuess() {
    if (currentInput.length !== 5) {
        alert("La palabra debe tener 5 letras.");
        return;
    }

    const guess = currentInput.join("");

    if (attempts.length >= maxAttempts) {
        alert("¡Se acabaron los intentos!");
        return;
    }

    attempts.push(guess);
    currentInput = [];
    updateBoard();
    updateKeyboard(guess);
    updateCurrentWord();

    if (guess === wordToGuess) {
        alert("¡Felicidades! Adivinaste la palabra.");
    }
}

// Manejar el teclado físico
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

// Botón de intento
document.getElementById("guess-button").addEventListener("click", submitGuess);

/* Función para actualizar el tablero de intentos
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
*/

// Función para actualizar el teclado visual
function updateKeyboard(guess) {
    guess.split("").forEach(letter => {
        const key = document.getElementById(`key-${letter}`);
        if (key && usedLetters[letter]) {
            key.classList.add(usedLetters[letter]);
        }
    });
}

// Función para actualizar el tablero de intentos con lógica mejorada
function updateBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = "";

    attempts.forEach(guess => {
        const boxes = [];
        let remainingLetters = wordToGuess.split(""); // Copia de la palabra oculta para manejar duplicados
        let guessArray = guess.split("");
        let status = Array(5).fill("absent"); // Estado inicial de cada letra
        
        // Primero, marcar las letras correctas (verdes)
        for (let i = 0; i < 5; i++) {
            if (guessArray[i] === wordToGuess[i]) {
                status[i] = "correct";
                remainingLetters[i] = null; // Marca la letra como usada en la posición correcta
            }
        }

        // Luego, marcar las letras presentes pero en la posición incorrecta (amarillas)
        for (let i = 0; i < 5; i++) {
            if (status[i] !== "correct" && remainingLetters.includes(guessArray[i])) {
                status[i] = "present";
                remainingLetters[remainingLetters.indexOf(guessArray[i])] = null; // Marca la letra como usada
            }
        }

        // Finalmente, construir la fila de intentos con los colores correctos
        for (let i = 0; i < 5; i++) {
            const box = document.createElement("div");
            box.classList.add("letter-box", status[i]);
            box.textContent = guessArray[i];

            // Guardar estado para el teclado
            if (!usedLetters[guessArray[i]] || usedLetters[guessArray[i]] === "present") {
                usedLetters[guessArray[i]] = status[i];
            }

            boxes.push(box);
        }

        boxes.forEach(box => board.appendChild(box));
    });

    if (attempts[attempts.length - 1] === wordToGuess) {
        alert("¡Felicidades! Adivinaste la palabra.");
    }
}
