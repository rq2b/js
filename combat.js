export function calculate_damage(attacker, defender) {
  return Math.max(1, attacker.attack - defender.defense);
}

export function attack(attacker, defender) {
  let damage = calculate_damage(attacker, defender);

  defender.hp = Math.max(0, defender.hp - damage);

  console.log(`${attacker.name} attacked ${defender.name} for ${damage} damage`);

  return { damage: damage };
}
