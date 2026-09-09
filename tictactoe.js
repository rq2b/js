const NONE = "-";

const PLAYER_A = "X";
const PLAYER_B = "O";

let game_board = [
    [NONE, NONE, NONE],
    [NONE, NONE, NONE],
    [NONE, NONE, NONE]
];

let player = PLAYER_A;
let has_won = false;

let first_player = prompt(
    `Начинать будет:
1) Игрок А (X)
2) Игрок Б (O)
0) Выход`
);

switch (first_player) {
    case "1":
        player = PLAYER_A;
        break;

    case "2":
        player = PLAYER_B;
        break;

    case "0":
        alert(`Игра прервана.`);
        break;
}

if (first_player != "0") {
    while (true) {
        let move = prompt(`Игрок ${player}, выберите действие:
1) Ходить
0) Выход`);
        switch (move) {
            case "0":
                break;

            case "1":
                let column = Number(prompt(`Введите номер столбца (1-3):`)) - 1;
                let row = Number(prompt(`Введите номер ряда (1-3):`)) - 1;

                if (
                    row >= 0 && row < 3 &&
                    column >= 0 && column < 3 &&
                    game_board[row][column] == NONE
                ) {
                    game_board[row][column] = player;

                    alert(
                        `${game_board[0].join("")}
${game_board[1].join("")}
${game_board[2].join("")}`
                    );

                    has_won = false;

                    // хардкод intensifies (ohno), надо функции, а их запретили 0((
                    if (
                        (game_board[0][0] == player && game_board[0][1] == player && game_board[0][2] == player) ||
                        (game_board[1][0] == player && game_board[1][1] == player && game_board[1][2] == player) ||
                        (game_board[2][0] == player && game_board[2][1] == player && game_board[2][2] == player) ||
                        (game_board[0][0] == player && game_board[1][0] == player && game_board[2][0] == player) ||
                        (game_board[0][1] == player && game_board[1][1] == player && game_board[2][1] == player) ||
                        (game_board[0][2] == player && game_board[1][2] == player && game_board[2][2] == player) ||
                        (game_board[0][0] == player && game_board[1][1] == player && game_board[2][2] == player) ||
                        (game_board[0][2] == player && game_board[1][1] == player && game_board[2][0] == player)
                    ) { has_won = true; }

                    if (has_won) {
                        alert(`Победил игрок ${player}`);
                        break;
                    }

                    if (player == PLAYER_A) {
                        player = PLAYER_B;
                    } else {
                        player = PLAYER_A;
                    }
                } else {
                    alert(`Неправильный ход (ход невозможен)`);
                }

                break;
        }

        if (move == "0" || has_won) {
            break;
        }
    }
}