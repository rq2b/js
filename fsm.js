import {
  ACTORS
} from "./config.js";

import {
  check_combat_end,
  take_turn
} from "./combat.js";

import {
  get_action
} from "./actions.js";

import {
  choose_boss_action,
  choose_player_action
} from "./ai.js";

import {
  show_message
} from "./ui.js";

import {
  EFFECTS,
  process_effects,
  update_effects,
  has_effect
} from "./effects.js";

export const COMBAT_STATES = {
  PLAYER_TURN: "player_turn",
  BOSS_TURN: "boss_turn",
  COMBAT_END: "combat_end"
};

export function create_fsm() {
  return {
    state: COMBAT_STATES.PLAYER_TURN
  };
}

function get_actor_id(fsm) {
  if (fsm.state == COMBAT_STATES.PLAYER_TURN) {
    return ACTORS.PLAYER;
  }

  if (fsm.state == COMBAT_STATES.BOSS_TURN) {
    return ACTORS.BOSS;
  }

  return null;
}

function transition(fsm, combat, state) {
  fsm.state = state;

  if (state == COMBAT_STATES.PLAYER_TURN) {
    combat.player.defending = false;
  }

  if (state == COMBAT_STATES.BOSS_TURN) {
    combat.boss.defending = false;
  }

  if (state == COMBAT_STATES.PLAYER_TURN) {
    combat.turn++;
  }

  console.log(`Combat state: ${fsm.state}`);
  console.log(combat);
}

function next_state(fsm, combat) {
  if (check_combat_end(combat)) {
    return COMBAT_STATES.COMBAT_END;
  }

  if (fsm.state == COMBAT_STATES.PLAYER_TURN) {
    return COMBAT_STATES.BOSS_TURN;
  }

  if (fsm.state == COMBAT_STATES.BOSS_TURN) {
    return COMBAT_STATES.PLAYER_TURN;
  }

  return COMBAT_STATES.COMBAT_END;
}

function finish_turn(fsm, combat, actor, action, target) {
  let result = take_turn(combat, actor, target, action);

  if (check_combat_end(combat)) {
    transition(fsm, combat, COMBAT_STATES.COMBAT_END);
    return result;
  }

  update_effects(actor);

  let state = next_state(fsm, combat);
  transition(fsm, combat, state);

  if (state != COMBAT_STATES.COMBAT_END) {
    run_turn(fsm, combat);
  }

  return result;
}

export function run_turn(fsm, combat) {
  if (fsm.state == COMBAT_STATES.COMBAT_END) {
    return;
  }

  if (check_combat_end(combat)) {
    transition(fsm, combat, COMBAT_STATES.COMBAT_END);
    return;
  }

  let actor_id = get_actor_id(fsm);
  let actor = combat[actor_id];
  let target = actor_id == ACTORS.PLAYER ? combat.boss : combat.player;

  process_effects(actor);

  if (check_combat_end(combat)) {
    transition(fsm, combat, COMBAT_STATES.COMBAT_END);
    return;
  }

  if (has_effect(actor, EFFECTS.STUN)) {
    show_message(`${actor.name} оглушён; ход пропущен.`);

    update_effects(actor);

    let state = next_state(fsm, combat);
    transition(fsm, combat, state);

    if (state != COMBAT_STATES.COMBAT_END) {
      run_turn(fsm, combat);
    }

    return;
  }

  if (actor_id == ACTORS.PLAYER) {
    choose_player_action(
      combat,
      function(action_id) {
        let action = get_action(action_id);
        finish_turn(fsm, combat, actor, action, target);
      }
    );
    return;
  }

  let action_id = choose_boss_action(combat);
  let action = get_action(action_id);

  finish_turn(fsm, combat, actor, action, target);
}
