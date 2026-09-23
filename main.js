import {
  PLAYER_SETTINGS,
  BOSS_SETTINGS
} from "./config.js";

import {
  attack,
  check_combat_end
} from "./combat.js";

const player = {
  name: "Игрок",
  hp: PLAYER_SETTINGS.max_hp,
  max_hp: PLAYER_SETTINGS.max_hp,
  attack: PLAYER_SETTINGS.attack,
  defense: PLAYER_SETTINGS.defense,
  effects: [],
  heals: PLAYER_SETTINGS.heals
};

const boss = {
  name: "Босс",
  hp: BOSS_SETTINGS.max_hp,
  max_hp: BOSS_SETTINGS.max_hp,
  attack: BOSS_SETTINGS.attack,
  defense: BOSS_SETTINGS.defense,
  effects: []
};

const combat = {
  player: player,
  boss: boss,
  turn: 1,
  current_actor: "player",
  phase: "player_turn",
  result: null
};

function next_turn() {
  if (combat.current_actor == "player") {
    combat.current_actor = "boss";
  } else {
    combat.current_actor = "player";
    combat.turn++;
  }

  console.log(combat);
}

function take_turn() {
  if (check_combat_end(combat)) {
    return;
  }

  if (combat.current_actor == "player") {
    attack(combat.player, combat.boss);
  } else {
    attack(combat.boss, combat.player);
  }

  next_turn();
}

take_turn();
take_turn();

