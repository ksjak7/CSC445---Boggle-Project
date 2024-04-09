class Stack {
    constructor() {
        this.items = [];
    }

    // Push an element onto the stack
    push(element) {
        this.items.push(element);
    }

    // Pop the top element from the stack
    pop() {
        if (this.isEmpty()) {
            return null; // Stack is empty
        }
        return this.items.pop();
    }

    // Return the top element without removing it
    peek() {
        if (this.isEmpty()) {
            return null; // Stack is empty
        }
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get the size of the stack
    size() {
        return this.items.length;
    }

    // Clear all elements from the stack
    clear() {
        this.items = [];
    }

    // Joins all of the items into one string
    join() {
        return (this.items).join('');
    }
}


let player1SubmittedArray = [];
let player2SubmittedArray = [];

let player1WordList = document.getElementById('player1WordList');
let player2WordList = document.getElementById('player2WordList');

const player1ValueStack = new Stack();
const player2ValueStack = new Stack();

const player1IDStack = new Stack();
const player2IDStack = new Stack();

let player1GridCells = []; // Array to store references to all grid cells
let player2GridCells = []; // Array to store references to all grid cells

const numRows = 4;
const numCols = 4;


function generateBoggleBoard() {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    const letterDistribution = [...vowels,...vowels, ...vowels, ...vowels, ...consonants, ...consonants, ...consonants, ...consonants, ...consonants]; // Vowels:Consonants in a 4:5 Ratio

    const board = [];

    // Loop through each row
    for (let i = 0; i < numRows; i++) {
        const row = [];

        // Loop through each column in the current row
        for (let j = 0; j < numCols; j++) {
            // Generate a random index to select a letter from the distribution
            const randomIndex = Math.floor(Math.random() * letterDistribution.length);
            const randomLetter = letterDistribution[randomIndex];
            row.push(randomLetter); // Push the random letter to the current row
        }

        board.push(row); // Push the row to the 2D array (board)
    }

    return board;
}

// Function to create the grid from the letters list
function createGrid(letters, gridID) {
    const grid = document.getElementById(gridID);

    // Clear existing content
    grid.innerHTML = '';
    gridCells = []; // Reset gridCells array

    // Loop through each row in the letters list
    letters.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');

        // Loop through each letter in the row
        rowData.forEach((letter, colIndex) => {
            const cell = document.createElement('td');
            const cellContent = document.createElement('div'); // Create a <div> for cell content
            cellContent.textContent = letter; // Set the text content of the <div>

            // Add styles to the cell content <div>
            cellContent.style.width = '100%';
            cellContent.style.height = '100%';
            cellContent.style.display = 'flex';
            cellContent.style.alignItems = 'center';
            cellContent.style.justifyContent = 'center';
            cellContent.style.backgroundColor = "#E6E6FA";

            // Assign a unique ID to each cell based on its position
            const cellId = `cell-${rowIndex}-${colIndex}`;
            cell.setAttribute('id', cellId);
            cell.setAttribute('data-gridID', gridID);
            cell.setAttribute('data-on', false);

            // Add click event listener to each cell
            cell.addEventListener('click', () => {
                const gridID = cell.getAttribute('data-gridID'); // Get the grid ID from the clicked cell
                const cellContent = cell.querySelector('div');

                if (gridID === 'player1Grid') {
                    if (cell.getAttribute('data-on') !== 'true') {
                        cellContent.style.backgroundColor = "#00CED1";
                        cell.setAttribute('data-on', 'true');

                        player1IDStack.push(cell.id);
                        player1ValueStack.push(cellContent.textContent);
                    } else if (cell.getAttribute('data-on') === 'true' && cell.id === player1IDStack.peek()) {
                        cell.setAttribute('data-on', 'false');
                        cellContent.style.backgroundColor = "#E6E6FA";

                        player1IDStack.pop();
                        player1ValueStack.pop();
                    }
                } else {
                    if (cell.getAttribute('data-on') !== 'true') {
                        cellContent.style.backgroundColor = "#00CED1";
                        cell.setAttribute('data-on', 'true');

                        player2IDStack.push(cell.id);
                        player2ValueStack.push(cellContent.textContent);
                    } else if (cell.getAttribute('data-on') === 'true' && cell.id === player2IDStack.peek()) {
                        cell.setAttribute('data-on', 'false');
                        cellContent.style.backgroundColor = "#E6E6FA";

                        player2IDStack.pop();
                        player2ValueStack.pop();
                    }
                }
            });

            cell.appendChild(cellContent); // Append the <div> to the cell
            row.appendChild(cell); // Append the cell to the row

            // Store reference to the cell in gridCells array
            if (gridID == 'player1Grid') {
                if (!player1GridCells[rowIndex]) {
                    player1GridCells[rowIndex] = [];
                }
                player1GridCells[rowIndex][colIndex] = cell;
            } else {
                if (!player2GridCells[rowIndex]) {
                    player2GridCells[rowIndex] = [];
                }
                player2GridCells[rowIndex][colIndex] = cell;
            }
        });

        grid.appendChild(row); // Append the row to the table
    });
}

// fix post stack implimentation
function submitWord(gridID) {
    let word;

    if (gridID=='player1Grid'){
        word = player1ValueStack.join('');
        console.log("Player 1 tried to submit ", word);
    } else {
        word = player2ValueStack.join('');
        console.log("Player 2 tried to submit ", word);
    }

    //Preform word validation against dictionary here.

    //Forced sucess for testing
    submitSuccess(word, gridID);

    // Reset background color of all cells of the given player grid
    if (gridID == 'player1Grid') {
        player1GridCells.forEach(row => {
            row.forEach(cell => {
                const cellContent = cell.querySelector('div');
                cellContent.style.backgroundColor = "#E6E6FA";
            });
        });
    } else if (gridID == 'player2Grid') {
        player2GridCells.forEach(row => {
            row.forEach(cell => {
                const cellContent = cell.querySelector('div');
                cellContent.style.backgroundColor = "#E6E6FA";
            });
        });
    }
}

function submitSuccess(word, gridID) {
    if (gridID=='player1Grid'){
        const listItem = document.createElement('li');
        listItem.textContent = word;
        player1WordList.appendChild(listItem);

        // Clear the submitArray
        player1IDStack.clear();
        player1ValueStack.clear();
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        player2WordList.appendChild(listItem);

        // Clear the submitArray
        player2IDStack.clear();
        player2ValueStack.clear();
    }
}

function submitFailure() {
    //IDK yet
}

function generateBoard() {
    const lettersList = generateBoggleBoard(numRows, numCols);

    // Call the function to initially create the grid
    createGrid(lettersList, 'player1Grid');
    createGrid(lettersList, 'player2Grid');

    player1SubmittedArray = [];
    player1IDStack.clear();
    player1ValueStack.clear();

    player2SubmittedArray = [];
    player2IDStack.clear();
    player2ValueStack.clear();
}

generateBoard();

