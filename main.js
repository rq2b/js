const TOTAL_ROOMS = 12;

// (почти) enum
const PLAYER_CLASSES = {
    MELEE: "Воин",
    ARCHER: "Лучник",
    MAGE: "Маг"
};

// dict в JS, computed properties, что бы работал "enum" (ну, почти)
const CLASS_SETTINGS = {
    [PLAYER_CLASSES.MELEE]: {
        weapon: "Катана",
        damage: 8,
        max_hp: 160
    },
    [PLAYER_CLASSES.ARCHER]: {
        weapon: "Лук",
        damage: 11,
        max_hp: 120
    },
    [PLAYER_CLASSES.MAGE]: {
        weapon: "Ванда",
        damage: 14,
        max_hp: 80
    }
};

const ENEMIES = [
    { name: "Розбійник", hp: 34, damage: 5, gold: 16, xp: 40 },
    { name: "Лучник", hp: 29, damage: 11, gold: 18, xp: 45 },
    { name: "Маг", hp: 24, damage: 14, gold: 22, xp: 50 }
];

const ITEMS = [
    "Хилка",
    "Лук",
    "Ванда",
    "Катана",
    "Штани за 40 гривень"
];

// косплей на класс
const player = {
    class: null,
    hp: 0,
    xp: 0,
    damage: 0,
    max_hp: 0,
    level: 1,
    gold: 20,
    weapon: "",
    armor: "Штани за 10 гривень",
    inventory: ["Хилка"]
};

// основные переменные состояния
let room = 0;
let riddle_seen = false;
let merchant_seen = false;
let boss_seen = false;
let boss_cooldown = 0;
let game_finished = false;

// helper функции
function random_number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random_choice(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function show_message(message) {
    document.getElementById("message").textContent = message;
}

function choose(question, options, callback) {
    let actions = document.getElementById("actions");

    actions.innerHTML = "";
    show_message(question);

    // удобный for цикл
    for (let option of options) {
        let button = document.createElement("button");

        button.textContent = option.text;

        button.onclick = function() {
            actions.innerHTML = "";
            // callback - для удобного перекидывания
            // аргументов по цепочке, например с других функций
            callback(option.value);
        };

        actions.appendChild(button);
    }
}

// лвл-ап каждые 100xp, +10хп и +2 дамага
function add_xp(xp) {
    player.xp += xp;

    while (player.xp >= 100) {
        player.xp -= 100;
        player.max_hp += 10;
        player.hp = player.max_hp; // халявный хил после лвл-апа
        player.damage += 2;
        player.level++;
    }
}

// atacc!
function attack(attacker, defender) {
    let damage = Math.max(
        1,
        Math.floor(attacker.damage * (0.75 + Math.random() * 0.5))
    );

    let critical = Math.random() < 0.15;

    if (critical) {
        damage *= 2;
    }

    defender.hp = Math.max(0, defender.hp - damage);

    return {
        damage: damage,
        critical: critical
    };
}

function heal() {
    let potion = player.inventory.indexOf("Хилка");

    if (potion == -1) {
        return false;
    }

    player.inventory.splice(potion, 1);
    player.hp = Math.min(player.max_hp, player.hp + 30);

    return true;
}

function create_enemy() {
    let source = random_choice(ENEMIES);

    return {
        name: source.name,
        hp: source.hp,
        max_hp: source.hp,
        damage: source.damage,
        gold: source.gold,
        xp: source.xp
    };
}

function create_boss() {
    return {
        name: "Змей Горыныч",
        hp: 350,
        max_hp: 350,
        damage: 20,
        gold: 320,
        xp: 700
    };
}

// бійка
function fight(enemy, boss, next, message = "") {
    let options = [
        { value: "attack", text: "Атаковать" },
        { value: "heal", text: "Лечиться" }
    ];

    if (!boss) {
        options.push({ value: "run", text: "Убежать" });
    }

    let question =
        `${enemy.name} HP: ${enemy.hp}/${enemy.max_hp}\n` +
        `Ваш HP: ${player.hp}/${player.max_hp}`;

    if (message != "") {
        question = `${message}\n\n${question}`;
    }

    choose(
        question,
        options,
        function(answer) {
            if (answer == "heal") {
                if (!heal()) {
                    fight(enemy, boss, next, "Хилки нет :(");
                    return;
                }

                enemy_attack(enemy, boss, next, "+30HP");
                return;
            }

            if (answer == "run" && !boss) {
                if (Math.random() < 0.5) {
                    choose(
                        "Вы эвакуировались.",
                        [{ value: "next", text: "Продолжить" }],
                        function() {
                            next(true);
                        }
                    );

                    return;
                }

                fight(enemy, boss, next, "Не удалось эвакуироваться");
                return;
            }

            let result = attack(player, enemy);

            if (enemy.hp <= 0) {
                add_xp(enemy.xp);

                if (Math.random() < 0.5) {
                    player.gold += enemy.gold;

                    choose(
                        `${result.critical ? "Критический удар! " : ""}` +
                        `Урон: ${result.damage}\n` +
                        `Победа! +${enemy.gold} золота, +${enemy.xp}XP.`,
                        [{ value: "next", text: "Продолжить" }],
                        function() {
                            next(true);
                        }
                    );
                } else {
                    let item = random_choice(ITEMS);
                    player.inventory.push(item);

                    choose(
                        `${result.critical ? "Критический удар! " : ""}` +
                        `Урон: ${result.damage}\n` +
                        `Победа! Предмет: ${item}, +${enemy.xp}XP.`,
                        [{ value: "next", text: "Продолжить" }],
                        function() {
                            next(true);
                        }
                    );
                }

                return;
            }

            enemy_attack(
                enemy,
                boss,
                next,
                `${result.critical ? "Критический удар! " : ""}Урон: ${result.damage}.` // ternary
            );
        }
    );
}

function enemy_attack(enemy, boss, next, message) {
    let result = attack(enemy, player);

    let text =
        `${message}\n` +
        `${result.critical ? "Критический удар врага! " : "Враг нанёс "}` +
        `${result.damage} урона.`;

    if (player.hp <= 0) {
        game_finished = true;
        show_message(`${text}\nYOU DIED`);
        return;
    }

    fight(enemy, boss, next, text);
}

function merchant(message = "") {
    let question =
        `Торговец:\n` +
        `У вас ${player.gold} золота.`;

    if (message != "") {
        question = `${message}\n\n${question}`;
    }

    choose(question, [
        { value: "potion", text: "Хилка - 15 золота" },
        { value: "weapon", text: "Улучшить оружие - 30 золота" },
        { value: "armor", text: "Улучшить броню - 25 золота" },
        { value: "inventory", text: "Посмотреть инвентарь" },
        { value: "leave", text: "Продолжить путь" }
    ], function(answer) {
        if (answer == "potion") {
            if (player.gold < 15) {
                merchant("Недостаточно золота.");
                return;
            }

            player.gold -= 15;
            player.inventory.push("Хилка");
            merchant("Вы купили хилку");
            return;
        }

        if (answer == "weapon") {
            if (player.gold < 30) {
                merchant("Недостаточно золота.");
                return;
            }

            player.gold -= 30;
            player.damage += 5;
            player.weapon = `Улучшенный ${player.weapon}`;
            merchant("Оружие улучшено.");
            return;
        }

        if (answer == "armor") {
            if (player.gold < 25) {
                merchant("Недостаточно золота.");
                return;
            }

            player.gold -= 25;
            player.max_hp += 10;
            player.hp += 10;
            player.armor = "Улучшенная бронь";
            merchant("Бронь улучшена.");
            return;
        }

        if (answer == "inventory") {
            merchant(
                `Инвентарь:\n` +
                `${player.inventory.length == 0
                    ? "Пусто."
                    : player.inventory.join("\n")}\n\n` +
                `Золото: ${player.gold}` // please do not execute me за этот мазахизм
            );

            return;
        }

        next_room();
    });
}


function room_event() {
    let events = [
        "monster",
        "chest",
        "trap"
    ];

    if (!merchant_seen) {
        events.push("merchant");
    }

    if (!riddle_seen && Math.random() < 0.05) {
        riddle_seen = true;
        return "riddle";
    }

    let event = random_choice(events);

    if (event == "merchant") {
        merchant_seen = true;
    }

    return event;
}

function next_room() {
    if (game_finished) {
        return;
    }

    if (room >= TOTAL_ROOMS && !boss_seen && boss_cooldown == 0) {
        if (Math.random() < 0.35) {
            boss_choice();
            return;
        }
    }

    if (boss_cooldown > 0) {
        boss_cooldown--;
    }

    room++;

    let event = room_event();

    if (event == "monster") {
        let enemy = create_enemy();

        show_message(
            `Вы встретили ${enemy.name}.\n` +
            `HP: ${enemy.hp}\n` +
            `Урон: ${enemy.damage}`
        );

        fight(enemy, false, function() {
            next_room();
        });

        return;
    }

    if (event == "chest") {
        let gold = random_number(10, 40);
        let item = random_choice(ITEMS);

        player.gold += gold;
        player.inventory.push(item);

        choose(
            `Сундук!\n` +
            `+${gold} золота\n` +
            `Предмет: ${item}`,
            [{ value: "next", text: "Продолжить" }],
            function() {
                next_room();
            }
        );

        return;
    }

    if (event == "trap") {
        let damage = random_number(5, 20);

        player.hp = Math.max(0, player.hp - damage);

        if (player.hp == 0) {
            game_finished = true;

            show_message(
                `Ловушка! Потеряно ${damage} HP.\n` +
                `Вы погибли.`
            );

            return;
        }

        choose(
            `Ловушка! Потеряно ${damage} HP.`,
            [{ value: "next", text: "Продолжить" }],
            function() {
                next_room();
            }
        );

        return;
    }

    if (event == "merchant") {
        merchant();
        return;
    }

    choose(
        "Загадка: какая конструкция JavaScript используется для повторения кода?",
        [
            { value: "1", text: "Цикл" },
            { value: "2", text: "Константа" },
            { value: "3", text: "Комментарий" }
        ],
        function(answer) {
            if (answer == "3") {
                game_finished = true;

                show_message(
                    "Секретная концовка: препод с JS ждал за дверью с битой. YOU DIED"
                );

                return;
            }

            next_room();
        }
    );
}

function boss_choice() {
    choose(
        `Перед вами дверь в комнату босса.\n` +
        `Ваш уровень: ${player.level}\n` +
        `Ваш HP: ${player.hp}/${player.max_hp}\n` +
        `Ваше золото: ${player.gold}\n\n` +
        `Войти в комнату босса?`,
        [
            { value: "yes", text: "Войти в комнату босса" },
            { value: "no", text: "Продолжить путь" }
        ],
        function(answer) {
            if (answer == "no") {
                boss_cooldown = 2;

                choose(
                    "Пока что не босс",
                    [
                        {
                            value: "next",
                            text: "Продолжить"
                        }
                    ],
                    function() {
                        next_room();
                    }
                );

                return;
            }

            boss_seen = true;

            let boss = create_boss();

            show_message(
                `ФИНАЛЬНЫЙ БОСС ГОРЫНЫЧ!\n` +
                `${boss.name}\n` +
                `HP: ${boss.hp}\n` +
                `Урон: ${boss.damage}`
            );

            fight(boss, true, function() {
                game_finished = true;

                player.gold += boss.gold;
                add_xp(boss.xp);

                show_message(
                    `Победа!\n` +
                    `Mission Passed. RESPECT++\n` +
                    `+${boss.gold} золота, +${boss.xp} XP.\n` +
                    `Золото: ${player.gold}\n` +
                    `Уровень: ${player.level}`
                );
            });
        }
    );
}

// Начало игры
document.getElementById("start_game").onclick = function() {
    document.getElementById("start").remove();

    choose(
        "Выберите класс:",
        [
            { value: PLAYER_CLASSES.MELEE, text: "Воин" },
            { value: PLAYER_CLASSES.ARCHER, text: "Лучник" },
            { value: PLAYER_CLASSES.MAGE, text: "Маг" }
        ],
        function(answer) {
            let settings = CLASS_SETTINGS[answer];

            player.class = answer;
            player.hp = settings.max_hp;
            player.max_hp = settings.max_hp;
            player.damage = settings.damage;
            player.weapon = settings.weapon;

            next_room();
        }
    );
};
