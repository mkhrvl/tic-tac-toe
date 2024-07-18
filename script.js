const gameboard = (function () {
    const ROWS = 3;
    const COLS = 3;
    const board = [];

    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLS; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (row, col, player) => {
        if (board[row][col]) return;
        board[row][col].setMarker(player);
    };

    const printBoard = () => {
        const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithValues);
    };

    return {
        getBoard,
        placeMarker,
        printBoard,
    };
})();

function cell() {
    let value = 0;

    const setMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        setMarker,
        getValue,
    };
}

const gameController = (function () {
    const board = gameboard;

    board.printBoard();
})();

gameController;
