import {
  attack
} from "./combat.js";

const ACTIONS = {
  ATTACK: "attack"
};

const action = {
  id: ACTIONS.ATTACK,
  name: "Атака",
  handler: attack
};

export const ACTION_REGISTRY = {
  [action.id]: action
};

export function get_action(action_id) {
  return ACTION_REGISTRY[action_id];
};

