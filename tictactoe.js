const NONE = "-";

const PLAYER_A = "X";
const PLAYER_B = "O";

const GAME_MODE = {
    PURE_JS_MODE: 0,
    HTML_MODE: 1
};

const game_mode = GAME_MODE.HTML_MODE;

let game_board = [
    NONE, NONE, NONE,
    NONE, NONE, NONE,
    NONE, NONE, NONE
];

let human_player = PLAYER_A;
let algorithm_player = PLAYER_B;
let is_ai_turn = false;
let game_finished = false;

// hardcode ftw
const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


function show_message_alert(message) {
    alert(message);
}


function show_message_html(message) {
    document.getElementById("message").textContent = message;
}


function show_message(message) {
    if (game_mode == GAME_MODE.PURE_JS_MODE) {
        show_message_alert(message);
    } else {
        show_message_html(message);
    }
}


function show_board_alert() {
    show_message(
        `${game_board[0]}${game_board[1]}${game_board[2]}
${game_board[3]}${game_board[4]}${game_board[5]}
${game_board[6]}${game_board[7]}${game_board[8]}`
    );
}


function show_board_html() {
    let board = document.getElementById("board");

    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("button");

        cell.textContent = game_board[i];
        cell.dataset.index = i;
        cell.className = "cell";

        board.appendChild(cell);
    }
}


function show_board() {
    if (game_mode == GAME_MODE.PURE_JS_MODE) {
        show_board_alert();
    } else {
        show_board_html();
    }
}


function winner(board, player) {
    for (let combination of WIN_COMBINATIONS) {
        if (
            board[combination[0]] == player && board[combination[1]] == player && board[combination[2]] == player
        ) {
            return true;
        }
    }

    return false;
}


function game_over(board) {
    if (winner(board, PLAYER_A)) {
        return true;
    }

    if (winner(board, PLAYER_B)) {
        return true;
    }

    if (!board.includes(NONE)) {
        return true;
    }

    return false;
}


// алгоритм minimax для крестиков-ноликов
function minimax(board, is_maximizing) {
    if (winner(board, algorithm_player)) {
        return 1;
    }

    if (winner(board, human_player)) {
        return -1;
    }

    if (!board.includes(NONE)) {
        return 0;
    }

    if (is_maximizing) {
        let best_minimax_score = -999;

        for (let i = 0; i < 9; i++) {
            if (board[i] != NONE) {
                continue;
            }

            board[i] = algorithm_player;
            let score = minimax(board, false);
            board[i] = NONE;

            best_minimax_score = Math.max(best_minimax_score, score);
        }

        return best_minimax_score;
    }

    let best_minimax_score = 999;

    for (let i = 0; i < 9; i++) {
        if (board[i] != NONE) {
            continue;
        }

        board[i] = human_player;
        let score = minimax(board, true);
        board[i] = NONE;

        best_minimax_score = Math.min(best_minimax_score, score);
    }

    return best_minimax_score;
}


function best_move() {
    let best_score = -999;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (game_board[i] != NONE) {
            continue;
        }

        game_board[i] = algorithm_player;
        let score = minimax(game_board, false);
        game_board[i] = NONE;

        if (score > best_score) {
            best_score = score;
            move = i;
        }
    }

    return move;
}


function make_move(move, player) {
    // guard clause
    if (move < 0 || move > 8 || !Number.isInteger(move)) {
        return false;
    }

    // guard clause
    if (game_board[move] != NONE) {
        return false;
    }

    game_board[move] = player;

    return true;
}


function show_result() {
    if (winner(game_board, algorithm_player)) {
        show_message(`Победил алгоритм.`);
    } else if (winner(game_board, human_player)) {
        show_message(`Победил игрок.`);
    } else {
        show_message(`Ничья.`);
    }

    game_finished = true;
}


function player_move(move) {
    // guard clause
    if (game_finished || is_ai_turn) {
        return;
    }

    // guard clause
    if (!make_move(move, human_player)) {
        show_message(`Ход невозможен.`);
        return;
    }

    show_board();

    // guard clause
    if (game_over(game_board)) {
        show_result();
        return;
    }

    is_ai_turn = true;

    algorithm_move();
}


function algorithm_move() {
    // guard clause
    if (game_finished || !is_ai_turn) {
        return;
    }

    show_message(`Ход алгоритма`);

    let move = best_move();

    make_move(move, algorithm_player);

    show_board();

    // guard clause
    if (game_over(game_board)) {
        show_result();
        return;
    }

    is_ai_turn = false;
    show_message(`Ваш ход`);

    setup_board_events();
}


function setup_board_events() {
    if (game_mode != GAME_MODE.HTML_MODE) {
        return;
    }

    let cells = document.querySelectorAll(".cell");

    for (let cell of cells) {
        cell.onclick = function() {
            let move = Number(cell.dataset.index);

            player_move(move);
        };

        if (game_finished || is_ai_turn) {
            cell.disabled = true;
        }
    }
}


function start_game(first_player) {
    // guard clause
    if (first_player != "1" && first_player != "2") {
        show_message(`Выберите 1 или 2`);
        return;
    }

    document.getElementById("start").style.display = "none";

    show_board();

    if (first_player == "1") {
        is_ai_turn = false;
        show_message(`Ваш ход.`);
        setup_board_events();
    } else {
        is_ai_turn = true;
        algorithm_move();
    }
}


function setup_start_events() {
    if (game_mode != GAME_MODE.HTML_MODE) {
        return;
    }

    document.getElementById("start_player").onclick = function() {
        start_game("1");
    };

    document.getElementById("start_algorithm").onclick = function() {
        start_game("2");
    };
}


function start_pure_js_game() {
    let first_player = prompt(
        `Начинать будет:
1) Игрок
2) Алгоритм
0) Выход`
    );

    if (first_player == "0") {
        show_message(`Игра прервана`);
        return;
    }

    start_game(first_player);
}


// dependency injection, часто использую в написании юнит тестов в python
if (game_mode == GAME_MODE.PURE_JS_MODE) {
    start_pure_js_game();
} else {
    setup_start_events();
}
