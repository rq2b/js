export function calculate_damage(attacker, defender) {
  return Math.max(1, attacker.attack - defender.defense);
}

export function attack(attacker, defender) {
  let damage = calculate_damage(attacker, defender);

  defender.hp = Math.max(0, defender.hp - damage);

  console.log(`${attacker.name} attacked ${defender.name} for ${damage} damage`);

  return { damage: damage };
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

