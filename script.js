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
        board[row][col].setMarker(player);
    };

    const isCellTaken = (row, col) => {
        return board[row][col].getValue() ? true : false;
    };

    const isBoardFull = () => {
        const remainingCells = board.flat().filter((cell) => cell.getValue() === 0);
        return remainingCells.length > 0 ? false : true;
    };

    const printBoard = () => {
        const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithValues);
    };

    return {
        getBoard,
        placeMarker,
        isCellTaken,
        isBoardFull,
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

    const players = [
        {
            name: 'Player One',
            marker: 1,
        },
        {
            name: 'Player Two',
            marker: 2,
        },
    ];

    const setPlayerName = (playerIndex, name) => {
        players[playerIndex].name = name;
    };

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn`);
    };

    const hasMatchingMarkers = (rows) => {
        let hasMatchingMarkers = false;

        rows.forEach((row) => {
            if (row[0].getValue() !== 0) {
                const hasMatch = row.every((cell) => cell.getValue() === row[0].getValue());
                if (hasMatch) hasMatchingMarkers = true;
            }
        });

        return hasMatchingMarkers;
    };

    const hasWinner = () => {
        const rows = board.getBoard();
        const columns = [];
        const diagonals = [];

        // convert columns into an arrays of rows
        for (let i = 0; i < rows[0].length; i++) {
            columns.push(rows.map((row) => row[i]));
        }

        diagonals.push([rows[0][0], rows[1][1], rows[2][2]], [rows[2][0], rows[1][1], rows[0][2]]);

        if (hasMatchingMarkers(rows) || hasMatchingMarkers(columns) || hasMatchingMarkers(diagonals)) {
            return true;
        }

        return false;
    };

    const playRound = (row, col) => {
        const isBoardFull = board.isBoardFull();
        const isCellTaken = board.isCellTaken(row, col);

        if (isBoardFull) {
            console.log('board is full');
            return;
        }

        if (isCellTaken) {
            console.log(`cell ${row} ${col} is taken`);
            return;
        }

        board.placeMarker(row, col, getActivePlayer().marker);

        if (hasWinner()) {
            console.log(`${getActivePlayer().name} is the Winner!`);
            board.printBoard();
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    };

    printNewRound();

    return {
        setPlayerName,
        getActivePlayer,
        getBoard: board.getBoard,
        playRound,
    };
})();

const game = gameController;
game.playRound(0, 0);
game.playRound(2, 1);
game.playRound(1, 2);
game.playRound(1, 1);
game.playRound(2, 2);
game.playRound(0, 2);
game.playRound(2, 0);
game.playRound(1, 0);
game.playRound(0, 1);
game.playRound(0, 1);
