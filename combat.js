import {
  ATTACK_SETTINGS,
  HEAL_SETTINGS,
  CRITICAL_SETTINGS,
  DEFENSE_SETTINGS
} from "./config.js";

import {
  ACTORS
} from "./config.js";

function calculate_damage(attacker, defender, multiplier = 1, defense_multiplier = 1) {
  let damage = attacker.attack * multiplier;
  let critical = check_critical();

  if (critical) {
    damage = calculate_critical_damage(damage);
  }

  damage = Math.max(1, damage - defender.defense);
  damage *= defense_multiplier;
  damage = Math.max(1, damage);

  return {
    damage: damage,
    critical: critical
  };
}

function execute_attack(attacker, defender, multiplier = 1) {
  let defense_multiplier = 1;

  if (defender.defending) {
    defense_multiplier = DEFENSE_SETTINGS.damage_multiplier;
  }

  let result = calculate_damage(
    attacker,
    defender,
    multiplier,
    defense_multiplier
  );

  defender.hp = Math.max(0, defender.hp - result.damage);

  return result;
}

export function attack(attacker, defender) {
  let result = execute_attack(attacker, defender);

  console.log(
    `${attacker.name} attacked ${defender.name} for ${result.damage} damage` +
    `${result.critical ? " (critical hit)" : ""}`
  );

  return result;
}

export function check_combat_end(combat) {
  if (combat.player.hp <= 0) {
    combat.result = "boss_win";
    console.log("Combat ended; boss wins");
    return true;
  }

  if (combat.boss.hp <= 0) {
    combat.result = "player_win";
    console.log("Combat ended; player wins");
    return true;
  }

  return false;
}

export function strong_attack(attacker, defender) {
  if (Math.random() >= ATTACK_SETTINGS.strong_hit_chance) {
    console.log(`${attacker.name} missed the strong attack`);

    return {
      damage: 0,
      hit: false,
      critical: false
    };
  }

  let result = execute_attack(
    attacker,
    defender,
    ATTACK_SETTINGS.strong_multiplier
  );

  console.log(
    `${attacker.name} attacked ${defender.name} with a strong attack for ${result.damage} damage` +
    `${result.critical ? " (critical hit)" : ""}`
  );

  return {
    ...result,
    hit: true
  };
}

export function heal(actor) {
  if (actor.heals <= 0) {
    console.log(`${actor.name} has no heals left`);
    return {
      healed: false,
      amount: 0
    };
  }

  let old_hp = actor.hp;

  actor.hp = Math.min(
    actor.max_hp,
    actor.hp + HEAL_SETTINGS.amount
  );

  let amount = actor.hp - old_hp;

  actor.heals--;

  console.log(`${actor.name} healed for ${amount} HP`);

  return {
    healed: true,
    amount: amount
  };
}

export function defend(actor) {
  actor.defending = true;

  console.log(`${actor.name} is defending`);

  return {
    defending: true
  };
}

function next_turn(combat) {
  if (combat.current_actor == ACTORS.PLAYER) {
    combat.current_actor = ACTORS.BOSS;
  } else {
    combat.current_actor = ACTORS.PLAYER;
    combat.turn++;
  }

  combat.phase = `${combat.current_actor}_turn`;
  combat[combat.current_actor].defending = false;

  console.log(combat);
}

export function take_turn(combat, action) {
  if (check_combat_end(combat)) {
    return;
  }

  if (!action) {
    console.warn("Cannot take turn without an action");
    return;
  }

  let actor;
  let target;

  if (combat.current_actor == ACTORS.PLAYER) {
    actor = combat.player;
    target = combat.boss;
  } else {
    actor = combat.boss;
    target = combat.player;
  }

  let result = action.handler(actor, target);

  if (check_combat_end(combat)) {
    return result;
  }

  next_turn(combat);

  return result;
}

function check_critical() {
  return Math.random() < CRITICAL_SETTINGS.chance;
}

function calculate_critical_damage(damage) {
  return damage * CRITICAL_SETTINGS.multiplier;
}

