import {
  PLAYER_NAME,
  BOSS_NAME,
  PLAYER_SETTINGS,
  BOSS_SETTINGS,
  ACTORS
} from "./config.js";

import {
  take_turn
} from "./combat.js";

import {
  ACTIONS,
  get_action
} from "./actions.js";

import {
  choose_boss_action,
  choose_player_action
} from "./ai.js";

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
  current_actor: ACTORS.PLAYER,
  phase: "player_turn",
  result: null
};

function run_turn() {
  let action_id;

  if (combat.current_actor == ACTORS.BOSS) {
    action_id = choose_boss_action(combat);
  } else {
    action_id = choose_player_action(combat);
  }

  let action = get_action(action_id);

  return take_turn(combat, action);
}

run_turn();
run_turn();
run_turn();
run_turn();

