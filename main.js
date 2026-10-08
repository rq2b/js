const arthur = {
  name: "Артур",
  damage: 35,
  health: 90,
  maxHealth: 90,
  gold: 5,

  showInfo() {
    console.log(
      `${this.name} has ${this.health}/${this.maxHealth}HP, deals ${this.damage} dmg, has ${this.gold} gold`
    );
  },

  attack() {
    console.log(`${this.name} attacked and dealt ${this.damage} dmg`);
  },

  takeDamage(damage) {
    this.health -= damage;

    if (this.health < 0) {
      this.health = 0;
    }

    console.log(`${this.name} lost ${damage} HP`);
  },

  heal(health) {
    this.health += health;

    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    console.log(`${this.name} restored ${health} HP`);
  },

  earnGold(gold) {
    this.gold += gold;
    console.log(`${this.name} got ${gold} gold`);
  },

  buyPotion() {
    if (this.gold < 30) {
      console.log(`${this.name} does not have enough gold to buy the potion`);
      return;
    }

    this.gold -= 30;
    this.heal(25);
    console.log(`${this.name} bought the potion for 30 gold`);
  },

  isAlive() {
    return this.health > 0;
  }
};

const orc = {
  name: "Орк",
  damage: 15,
  health: 150,
  maxHealth: 150,
  gold: 0,

  showInfo() {
    console.log(
      `${this.name} has ${this.health}/${this.maxHealth}HP, deals ${this.damage} dmg, has ${this.gold} gold`
    );
  },

  attack() {
    console.log(`${this.name} attacked and dealt ${this.damage} dmg`);
  },

  takeDamage(damage) {
    this.health -= damage;

    if (this.health < 0) {
      this.health = 0;
    }

    console.log(`${this.name} lost ${damage} HP`);
  },

  heal(health) {
    this.health += health;

    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    console.log(`${this.name} restored ${health} HP`);
  },

  earnGold(gold) {
    this.gold += gold;
    console.log(`${this.name} got ${gold} gold`);
  },

  buyPotion() {
    if (this.gold < 30) {
      console.log(`${this.name} does not have enough gold to buy the potion`);
      return;
    }

    this.gold -= 30;
    this.heal(25);
    console.log(`${this.name} bought the potion for 30 gold`);
  },

  isAlive() {
    return this.health > 0;
  }
};

arthur.attack();
orc.takeDamage(arthur.damage);

orc.attack();
arthur.takeDamage(orc.damage);

arthur.earnGold(50);
arthur.buyPotion();

arthur.showInfo();
orc.showInfo();
