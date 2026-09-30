export const PLAYER_NAME = "Игрок";
export const BOSS_NAME = "Босс";

export const PLAYER_SETTINGS = {
  max_hp: 100,
  attack: 10,
  defense: 5,
  heals: 3
};

export const BOSS_SETTINGS = {
  max_hp: 150,
  attack: 12,
  defense: 7,
  heals: 0
};

export const player = {
  name: PLAYER_NAME,
  hp: PLAYER_SETTINGS.max_hp,
  max_hp: PLAYER_SETTINGS.max_hp,
  attack: PLAYER_SETTINGS.attack,
  defense: PLAYER_SETTINGS.defense,
  effects: [],
  heals: PLAYER_SETTINGS.heals,
  defending: false
};

export const boss = {
  name: BOSS_NAME,
  hp: BOSS_SETTINGS.max_hp,
  max_hp: BOSS_SETTINGS.max_hp,
  attack: BOSS_SETTINGS.attack,
  defense: BOSS_SETTINGS.defense,
  effects: [],
  heals: BOSS_SETTINGS.heals,
  defending: false
};

export const ATTACK_SETTINGS = {
  strong_multiplier: 2,
  strong_hit_chance: 0.75
};

export const HEAL_SETTINGS = {
  amount: 30
};

export const DEFENSE_SETTINGS = {
  damage_multiplier: 0.5
};

export const CRITICAL_SETTINGS = {
  chance: 0.15,
  multiplier: 2
};

export const ACTORS = {
  PLAYER: "player",
  BOSS: "boss"
};

export const BOSS_AI_SETTINGS = {
  critical_hp_threshold: 0.30,
  medium_hp_threshold: 0.60,
  player_hp_threshold: 0.50,
  strong_attack_hp_threshold: 0.75
};

export const EFFECT_SETTINGS = {
  bleeding: {
    duration: 3,
    damage: 5
  },

  stun: {
    duration: 1
  },

  attack_boost: {
    duration: 2,
    amount: 2
  }
};

