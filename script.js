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
        const remainingCells = board.flat().filter((cell) => !cell.getValue());
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
    let value = '';

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
            marker: 'o',
        },
        {
            name: 'Player Two',
            marker: 'x',
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

    let gameStatus = `${getActivePlayer().name}'s turn...`;

    const setGameStatus = (status) => {
        gameStatus = status;
    };

    const getGameStatus = () => gameStatus;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn`);
    };

    const hasMatchingMarkers = (rows) => {
        let hasMatchingMarkers = false;

        rows.forEach((row) => {
            if (row[0].getValue()) {
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
            setGameStatus(`It's a Tie!`);
            return;
        }

        if (isCellTaken) {
            console.log(`cell ${row} ${col} is taken`);
            return;
        }

        board.placeMarker(row, col, getActivePlayer().marker);

        if (hasWinner()) {
            setGameStatus(`${getActivePlayer().name} is the Winner!`);
            board.printBoard();
        } else {
            switchPlayerTurn();
            setGameStatus(`${getActivePlayer().name}'s turn...`);
            printNewRound();
        }
    };

    printNewRound();

    return {
        setPlayerName,
        getActivePlayer,
        getGameStatus,
        getBoard: board.getBoard,
        playRound,
    };
})();

const displayController = (function () {
    const game = gameController;
    const gameStatusDiv = document.querySelector('.game-status');
    const boardDiv = document.querySelector('.board');
    const newGameBtn = document.querySelector('.btn-newgame');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const gameStatus = game.getGameStatus();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellBtn = document.createElement('button');
                cellBtn.setAttribute('type', 'button');
                cellBtn.classList.add('cell');
                cellBtn.dataset.position = `${rowIndex},${colIndex}`;
                cellBtn.textContent = cell.getValue();
                boardDiv.appendChild(cellBtn);
            });
        });

        gameStatusDiv.textContent = gameStatus;
    };

    const boardClickHandler = (e) => {
        const selectedCell = e.target.dataset.position.split(',');
        const row = selectedCell[0];
        const col = selectedCell[1];

        if (!selectedCell) return;
        console.log('click');

        game.playRound(row, col);

        updateScreen();
    };

    boardDiv.addEventListener('click', boardClickHandler);

    updateScreen();
})();

const display = displayController;
display;
