const gridContainer = document.getElementById("grid");

// Create a 15x15 grid with random letters
const gridSize = 15;
const grid = Array.from({ length: gridSize }, () =>
  Array(gridSize).fill("")
);

const wordBank = ["MUFFINS", "CAKE", "BREAD", "COOKIES", "DONUTS", "PIE", "PUDDING"];

// Place words in the grid
function placeWord(grid, word) {
  const directions = [
    { x: 1, y: 0 }, // Horizontal
    { x: 0, y: 1 }, // Vertical
    { x: 1, y: 1 }, // Diagonal
  ];
  let placed = false;

  while (!placed) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const startX = Math.floor(Math.random() * gridSize);
    const startY = Math.floor(Math.random() * gridSize);

    let x = startX;
    let y = startY;
    let fits = true;

    for (const letter of word) {
      if (
        x < 0 ||
        x >= gridSize ||
        y < 0 ||
        y >= gridSize ||
        (grid[y][x] !== "" && grid[y][x] !== letter)
      ) {
        fits = false;
        break;
      }
      x += direction.x;
      y += direction.y;
    }

    if (fits) {
      x = startX;
      y = startY;

      for (const letter of word) {
        grid[y][x] = letter;
        x += direction.x;
        y += direction.y;
      }
      placed = true;
    }
  }
}

// Populate grid with words from the word bank
wordBank.forEach((word) => placeWord(grid, word));

// Fill empty spaces with random letters
grid.forEach((row, i) =>
  row.forEach((cell, j) => {
    if (cell === "") grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  })
);

// Display the grid
grid.forEach((row, rowIndex) => {
    row.forEach((letter, colIndex) => {
      const cell = document.createElement("div");
      cell.textContent = letter; // Display letter in cell
      cell.dataset.row = rowIndex; // Assign row index
      cell.dataset.col = colIndex; // Assign column index
      cell.textContent = letter;
      gridContainer.appendChild(cell); // Add cell to grid container
    });
  });
  

// Updated logic for mouse events
let startCell = null;
let selectedCells = [];
let foundWords = new Set(); // Track completed words

gridContainer.addEventListener("click", (event) => {
    console.log("Grid Click:", event.target);
  });

// Attach event listeners for interactivity
gridContainer.addEventListener("mousedown", handleMouseDown);
gridContainer.addEventListener("mousemove", handleMouseMove);
gridContainer.addEventListener("mouseup", handleMouseUp);


function handleMouseDown(event) {
    if (event.target.dataset.row && event.target.dataset.col) {
        startCell = event.target;
        selectedCells = [startCell];
        startCell.classList.add("highlight");
    }
}

function handleMouseMove(event) {
   if (startCell && event.target.dataset.row && event.target.dataset.col) {
       if (!selectedCells.includes(event.target)) {
           selectedCells.push(event.target);
           event.target.classList.add("highlight");
        }
     }
}

function handleMouseUp() {
    if (selectedCells.length > 0) {
        // Form the selected word
        const selectedWord = selectedCells.map((cell) => cell.textContent).join("");

        // Check if the word is in the word bank and not already found
        if (wordBank.includes(selectedWord) && !foundWords.has(selectedWord)) {
        selectedCells.forEach((cell) => cell.classList.add("correct"));
        foundWords.add(selectedWord); // Mark the word as found

        // Cross out the word in the word bank
      const wordList = document.querySelector("#word-bank ul"); // Get the list of words
      Array.from(wordList.children).forEach((wordElement) => {
        if (wordElement.textContent.trim().toUpperCase() === selectedWord.toUpperCase()) {
          wordElement.classList.add("found"); // Add 'found' class to the word
        }
      });

        // Check if all words are found
        if (foundWords.size === wordBank.length) {
            setTimeout(() => {
              showModal(); // Show the custom modal dialog
            }, 500);

            document.getElementById("play-again-btn").addEventListener("click", resetGame);
            document.getElementById("exit-btn").addEventListener("click", exitGame);

            function showModal() {
                const modal = document.getElementById("popup-modal");
                modal.style.display = "flex"; // Display the modal
            }
            
            function resetGame() {
                // Clear grid and reset word bank
                foundWords.clear(); // Reset the found words
                document.querySelectorAll("#grid div").forEach((cell) => {
                cell.classList.remove("highlight", "correct"); // Remove all highlights
                
                });
            
                const wordList = document.querySelector("#word-bank ul");
                Array.from(wordList.children).forEach((wordElement) => {
                wordElement.classList.remove("found"); // Remove the 'found' class
                });
            
                const modal = document.getElementById("popup-modal");
                modal.style.display = "none"; // Hide the modal

                // Clear the grid container
                const gridContainer = document.getElementById("grid");
                gridContainer.innerHTML = "";
                regenerateGrid();

                function regenerateGrid() {
                    // Create a new empty grid
                    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
                
                    // Place words from the word bank in the grid randomly
                    wordBank.forEach((word) => placeWord(grid, word));
                
                    // Fill the rest of the grid with random letters
                    grid.forEach((row, rowIndex) =>
                        row.forEach((cell, colIndex) => {
                            if (cell === "") {
                                grid[rowIndex][colIndex] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter
                            }
                        })
                    );
                
                    // Re-render the grid in the DOM
                    const gridContainer = document.getElementById("grid");
                    grid.forEach((row, rowIndex) => {
                        row.forEach((letter, colIndex) => {
                            const cell = document.createElement("div");
                            cell.textContent = letter;
                            cell.dataset.row = rowIndex; // Assign row index
                            cell.dataset.col = colIndex; // Assign column index
                            gridContainer.appendChild(cell);
                        });
                    });
                
                    // Attach event listeners to the new grid cells
                    attachCellListeners();
                }

                function attachCellListeners() {
                    const gridContainer = document.getElementById("grid");
                    gridContainer.addEventListener("mousedown", handleMouseDown);
                    gridContainer.addEventListener("mousemove", handleMouseMove);
                    gridContainer.addEventListener("mouseup", handleMouseUp);
                }

            }
            
            function exitGame() {
                const modal = document.getElementById("popup-modal");
                modal.style.display = "none"; // Hide the modal
            }
          }
    
        // if (foundWords.size === wordBank.length) {
        //     setTimeout(() => {
        //     alert("Congratulations! You've found all the words!");
        //     }, 500);
        // }
        } else {
        // Clear selection if the word isn't correct
        selectedCells.forEach((cell) => cell.classList.remove("highlight"));
        }
        selectedCells = [];
        startCell = null;
  }
}

