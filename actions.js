import {
  attack,
  strong_attack
} from "./combat.js";

const ACTIONS = {
  ATTACK: "attack",
  STRONG_ATTACK: "strong_attack"
};

const action_attack = {
  id: ACTIONS.ATTACK,
  name: "Атака",
  handler: attack
};

const action_strong_attack = {
  id: ACTIONS.STRONG_ATTACK,
  name: "Сильная атака",
  handler: strong_attack
}

export const ACTION_REGISTRY = {
  [action_attack.id]: action_attack,
  [action_strong_attack.id]: action_strong_attack
};

export function get_action(action_id) {
  return ACTION_REGISTRY[action_id];
}

