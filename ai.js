import {
  ACTIONS
} from "./actions.js";

export function choose_boss_action(combat) {
  let action = ACTIONS.ATTACK;

  console.log(`${combat.boss.name} chose to ${action}`);

  return action;
}

export function choose_player_action(combat) {
  let action = ACTIONS.ATTACK;

  console.log(`${combat.player.name} chose to ${action}`);

  return action;
}
