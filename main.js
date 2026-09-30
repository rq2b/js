import {
  PLAYER_NAME,
  BOSS_NAME,
  PLAYER_SETTINGS,
  BOSS_SETTINGS
} from "./config.js";

import {
  create_fsm,
  run_turn
} from "./fsm.js";

const player = {
  name: PLAYER_NAME,
  hp: PLAYER_SETTINGS.max_hp,
  max_hp: PLAYER_SETTINGS.max_hp,
  attack: PLAYER_SETTINGS.attack,
  defense: PLAYER_SETTINGS.defense,
  effects: [],
  heals: PLAYER_SETTINGS.heals,
  defending: false
};

const boss = {
  name: BOSS_NAME,
  hp: BOSS_SETTINGS.max_hp,
  max_hp: BOSS_SETTINGS.max_hp,
  attack: BOSS_SETTINGS.attack,
  defense: BOSS_SETTINGS.defense,
  effects: [],
  heals: BOSS_SETTINGS.heals,
  defending: false
};

const combat = {
  player: player,
  boss: boss,
  turn: 1,
  result: null
};

const fsm = create_fsm();

run_turn(fsm, combat);
run_turn(fsm, combat);
run_turn(fsm, combat);
run_turn(fsm, combat);

