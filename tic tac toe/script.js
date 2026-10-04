// =========================================
// TIC TAC TOE - PLAYER VS COMPUTER
// =========================================

const cells = document.querySelectorAll(".cell");

const turnText = document.getElementById("turnText");
const resultMessage = document.getElementById("resultMessage");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const newRoundButton = document.getElementById("newRoundBtn");
const resetScoreButton = document.getElementById("resetScoreBtn");

const playerModeButton = document.getElementById("playerModeBtn");
const computerModeButton = document.getElementById("computerModeBtn");


// =========================================
// GAME STATE
// =========================================

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameOver = false;

let gameMode = "player";

let scores = {
    X: 0,
    O: 0
};


// =========================================
// WINNING PATTERNS
// =========================================

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


// =========================================
// CELL CLICK
// =========================================

cells.forEach((cell) => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        // Computer ke turn par player click nahi kar sakta
        if (
            gameMode === "computer" &&
            currentPlayer === "O"
        ) {
            return;
        }

        makeMove(index);

    });

});


// =========================================
// MAKE MOVE
// =========================================

function makeMove(index) {

    if (gameOver) {
        return;
    }

    if (board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;

    updateCell(index);

    const winningPattern = checkWinner();

    if (winningPattern) {
        handleWin(winningPattern);
        return;
    }

    if (checkDraw()) {
        handleDraw();
        return;
    }

    switchPlayer();

    // Computer ki turn
    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {
        setTimeout(computerMove, 500);
    }
}


// =========================================
// UPDATE CELL
// =========================================

function updateCell(index) {

    const cell = cells[index];

    cell.textContent = currentPlayer;

    cell.disabled = true;

    cell.classList.add(
        currentPlayer.toLowerCase()
    );
}


// =========================================
// CHECK WINNER
// =========================================

function checkWinner() {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return pattern;
        }
    }

    return null;
}


// =========================================
// CHECK DRAW
// =========================================

function checkDraw() {

    return board.every(
        (cell) => cell !== ""
    );
}


// =========================================
// HANDLE WIN
// =========================================

function handleWin(winningPattern) {

    gameOver = true;

    scores[currentPlayer]++;

    updateScore();

    winningPattern.forEach((index) => {

        cells[index].classList.add("winner");

    });

    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        resultMessage.textContent =
            "🤖 Computer wins!";

    } else {

        resultMessage.textContent =
            `🎉 Player ${currentPlayer} wins!`;

    }

    turnText.textContent = "Game Over";
}


// =========================================
// HANDLE DRAW
// =========================================

function handleDraw() {

    gameOver = true;

    resultMessage.textContent =
        "🤝 It's a draw!";

    turnText.textContent =
        "Game Over";
}


// =========================================
// SWITCH PLAYER
// =========================================

function switchPlayer() {

    if (currentPlayer === "X") {

        currentPlayer = "O";

    } else {

        currentPlayer = "X";

    }

    turnText.textContent =
        `${currentPlayer}'s Turn`;
}


// =========================================
// COMPUTER MOVE
// =========================================

function computerMove() {

    if (gameOver) {
        return;
    }

    if (currentPlayer !== "O") {
        return;
    }


    // 1. Computer winning move
    let move = findWinningMove("O");

    // 2. Player ko block karo
    if (move === null) {
        move = findWinningMove("X");
    }

    // 3. Center
    if (
        move === null &&
        board[4] === ""
    ) {
        move = 4;
    }

    // 4. Corner
    if (move === null) {

        const corners = [
            0,
            2,
            6,
            8
        ];

        const availableCorners =
            corners.filter(
                (index) => board[index] === ""
            );

        if (availableCorners.length > 0) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    availableCorners.length
                );

            move =
                availableCorners[randomIndex];
        }
    }

    // 5. Any remaining position
    if (move === null) {

        const availableMoves = [];

        board.forEach(
            (value, index) => {

                if (value === "") {
                    availableMoves.push(index);
                }

            }
        );

        if (availableMoves.length > 0) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    availableMoves.length
                );

            move =
                availableMoves[randomIndex];
        }
    }


    // Computer move
    if (move !== null) {

        board[move] = "O";

        updateCell(move);

        const winningPattern =
            checkWinner();

        if (winningPattern) {

            handleWin(winningPattern);

            return;
        }

        if (checkDraw()) {

            handleDraw();

            return;
        }

        currentPlayer = "X";

        turnText.textContent =
            "X's Turn";
    }
}


// =========================================
// FIND WINNING MOVE
// =========================================

function findWinningMove(player) {

    for (
        let index = 0;
        index < board.length;
        index++
    ) {

        if (board[index] !== "") {
            continue;
        }

        board[index] = player;

        const winner =
            checkWinner();

        board[index] = "";

        if (winner) {
            return index;
        }
    }

    return null;
}


// =========================================
// UPDATE SCORE
// =========================================

function updateScore() {

    scoreX.textContent = scores.X;

    scoreO.textContent = scores.O;
}


// =========================================
// NEW ROUND
// =========================================

function newRound() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameOver = false;


    cells.forEach((cell) => {

        cell.textContent = "";

        cell.disabled = false;

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });


    turnText.textContent =
        "X's Turn";

    resultMessage.textContent =
        "Make your move!";
}


// =========================================
// RESET SCORE
// =========================================

function resetScore() {

    scores = {
        X: 0,
        O: 0
    };

    updateScore();

    newRound();
}


// =========================================
// PLAYER MODE
// =========================================

playerModeButton.addEventListener(
    "click",
    () => {

        gameMode = "player";

        playerModeButton.classList.add("active");

        computerModeButton.classList.remove("active");

        newRound();

    }
);


// =========================================
// COMPUTER MODE
// =========================================

computerModeButton.addEventListener(
    "click",
    () => {

        gameMode = "computer";

        computerModeButton.classList.add("active");

        playerModeButton.classList.remove("active");

        newRound();

    }
);


// =========================================
// BUTTON EVENTS
// =========================================

newRoundButton.addEventListener(
    "click",
    newRound
);


resetScoreButton.addEventListener(
    "click",
    resetScore
);


// =========================================
// INITIALIZE
// =========================================

updateScore();