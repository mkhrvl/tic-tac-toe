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

    const resetBoard = () => {
        for (let i = 0; i < ROWS; i++) {
            board[i] = [];
            for (let j = 0; j < COLS; j++) {
                board[i][j] = cell();
            }
        }
    };

    const placeMarker = (row, col, player) => {
        board[row][col].setMarker(player);
    };

    const isBoardFull = () => {
        const remainingCells = board.flat().filter((cell) => !cell.getValue());
        return remainingCells.length > 0 ? false : true;
    };

    return {
        getBoard,
        resetBoard,
        placeMarker,
        isBoardFull,
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

    const setPlayerName = (playerIndex, name) => {
        players[playerIndex].name = name;
        gameStatus = `${getActivePlayer().name}'s turn...`;
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

    let isGameRoundOver = false;

    const isRoundOver = () => isGameRoundOver;

    const playRound = (row, col) => {
        if (!hasWinner() && !board.isBoardFull()) {
            board.placeMarker(row, col, getActivePlayer().marker);
        }

        if (hasWinner()) {
            setGameStatus(`${getActivePlayer().name} is the Winner!`);
            isGameRoundOver = true;
            return;
        }

        if (board.isBoardFull()) {
            setGameStatus(`It's a Tie!`);
            isGameRoundOver = true;
            return;
        }

        switchPlayerTurn();
        setGameStatus(`${getActivePlayer().name}'s turn...`);
    };

    const startNewRound = () => {
        board.resetBoard();
        activePlayer = players[0];
        isGameRoundOver = false;
        setGameStatus(`${getActivePlayer().name}'s turn...`);
    };

    return {
        setGameStatus,
        setPlayerName,
        getActivePlayer,
        getGameStatus,
        getBoard: board.getBoard,
        isRoundOver,
        playRound,
        startNewRound,
    };
})();

const displayController = (function () {
    const game = gameController;
    const gameStatusDiv = document.querySelector('.game-status');
    const boardDiv = document.querySelector('.board');
    const newGameBtn = document.querySelector('.btn-newgame');
    const renamePlayersBtn = document.querySelector('.btn-rename');
    const dialog = document.querySelector('.name-players');
    const form = document.querySelector('.name-players__form');

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

        if (!game.isRoundOver()) {
            game.playRound(row, col);
            updateScreen();
        }

        if (game.isRoundOver()) {
            game.setGameStatus('Start A New Game');
            setTimeout(() => updateScreen(), 2 * 1000);
        }
    };

    boardDiv.addEventListener('click', boardClickHandler);

    const newGameClickHandler = () => {
        game.startNewRound();
        updateScreen();
    };

    newGameBtn.addEventListener('click', newGameClickHandler);

    const renamePlayersClickHandler = () => {
        dialog.showModal();
    };

    renamePlayersBtn.addEventListener('click', renamePlayersClickHandler);

    const setPlayersNames = () => {
        dialog.showModal();
    };

    const formSubmitHandler = (e) => {
        e.preventDefault();
        const playerOneName = document.querySelector('#player-one').value;
        const playerTwoName = document.querySelector('#player-two').value;
        game.setPlayerName(0, playerOneName || 'Player One');
        game.setPlayerName(1, playerTwoName || 'Player Two');
        dialog.close();
        updateScreen();
    };

    form.addEventListener('submit', formSubmitHandler);

    setPlayersNames();
    updateScreen();
})();

const display = displayController;
display;
