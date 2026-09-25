import {
  ATTACK_SETTINGS,
  HEAL_SETTINGS,
  PLAYER_NAME,
  BOSS_NAME,
  ATTACK_SETTINGS,
  CRITICAL_SETTINGS
} from "./config.js";

export function calculate_damage(attacker, defender) {
  let damage = Math.max(1, attacker.attack - defender.defense);
  let critical = check_critical();

  if (critical) {
    damage = calculate_critical_damage(damage);
  }

  return {
    damage: damage,
    critical: critical
  };
}

export function attack(attacker, defender) {
  let result = calculate_damage(attacker, defender);

  defender.hp = Math.max(0, defender.hp - result.damage);

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
      hit: false
    };
  }

  let damage = Math.max(1, (attacker.attack * ATTACK_SETTINGS.strong_multiplier) - defender.defense);

  defender.hp = Math.max(0, defender.hp - damage);

  console.log(
    `${attacker.name} attacked ${defender.name} with a strong attack for ${damage} damage`
  );

  return {
    damage: damage,
    hit: true
  };
}

export function heal(player) {
  if (player.name == BOSS_NAME) {
    console.warn("The boss can't heal");
    return {
      healed: false,
      amount: 0
    };
  }

  if (player.heals <= 0) {
    console.log(`${player.name} has no heals left`);
    return {
      healed: false,
      amount: 0
    };
  }

  let old_hp = player.hp;

  player.hp = Math.min(
    player.max_hp,
    player.hp + HEAL_SETTINGS.amount
  );

  let amount = player.hp - old_hp;

  player.heals--;

  console.log(`${player.name} healed for ${amount} HP`);

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

function check_critical() {
  return Math.random() < CRITICAL_SETTINGS.chance;
}

function calculate_critical_damage(damage) {
  return damage * CRITICAL_SETTINGS.multiplier;
}

