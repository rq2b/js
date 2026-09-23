import {
  attack,
  strong_attack,
  heal,
  defend
} from "./combat.js";

const ACTIONS = {
  ATTACK: "attack",
  STRONG_ATTACK: "strong_attack",
  HEAL: "heal",
  DEFEND: "defend"
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

const action_heal = {
  id: ACTIONS.HEAL,
  name: "Лечение",
  handler: heal
};

const action_defend = {
  id: ACTIONS.DEFEND,
  name: "Защита",
  handler: defend
};

export const ACTION_REGISTRY = {
  [action_attack.id]: action_attack,
  [action_strong_attack.id]: action_strong_attack,
  [action_heal.id]: action_heal,
  [action_defend.id]: action_defend
};

export function get_action(action_id) {
  return ACTION_REGISTRY[action_id];
}

