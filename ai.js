import {
  ACTIONS
} from "./actions.js";

import {
  BOSS_AI_SETTINGS
} from "./config.js";

import {
  choose,
  show_message
} from "./ui.js";

export function choose_boss_action(combat) {
  let boss_hp_ratio = combat.boss.hp / combat.boss.max_hp;
  let player_hp_ratio = combat.player.hp / combat.player.max_hp;
  let action = ACTIONS.ATTACK;

  if (
    boss_hp_ratio <= BOSS_AI_SETTINGS.critical_hp_threshold &&
    combat.boss.heals > 0
  ) {
    action = ACTIONS.HEAL;
  } else if (
    boss_hp_ratio <= BOSS_AI_SETTINGS.medium_hp_threshold &&
    player_hp_ratio >= BOSS_AI_SETTINGS.player_hp_threshold &&
    !combat.boss.defending
  ) {
    action = ACTIONS.DEFEND;
  } else if (
    player_hp_ratio > BOSS_AI_SETTINGS.strong_attack_hp_threshold
  ) {
    action = ACTIONS.STRONG_ATTACK;
  }

  show_message(`${combat.boss.name} выбрал действие: ${action}`);

  return action;
}

export function choose_player_action(combat, callback) {
  let question =
    `Ваш HP: ${combat.player.hp}/${combat.player.max_hp}\n` +
    `Босс HP: ${combat.boss.hp}/${combat.boss.max_hp}`;

  let options = [
    { value: ACTIONS.ATTACK, text: "Атаковать" },
    { value: ACTIONS.STRONG_ATTACK, text: "Сильная атака" },
    { value: ACTIONS.HEAL, text: "Лечиться" },
    { value: ACTIONS.DEFEND, text: "Защищаться" }
  ];

  choose(
    question,
    options,
    callback
  );
}
