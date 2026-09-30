import {
  EFFECT_SETTINGS
} from "./config.js";

export const EFFECTS = {
  BLEEDING: "bleeding"
};

function create_bleeding() {
  return {
    id: EFFECTS.BLEEDING,
    duration: EFFECT_SETTINGS.bleeding.duration,
    damage: EFFECT_SETTINGS.bleeding.damage
  };
}

function apply_effect(actor, effect) {
  if (effect.id == EFFECTS.BLEEDING) {
    actor.hp = Math.max(0, actor.hp - effect.damage);

    console.log(
      `${actor.name} takes ${effect.damage} bleeding damage`
    );
  }
}

function find_effect(actor, effect_id) {
  return actor.effects.find(
    effect => effect.id == effect_id // стрелочная функция
  );
}

export function add_effect(actor, effect) {
  let existing_effect = find_effect(actor, effect.id);

  if (!existing_effect) {
    actor.effects.push(effect);

    console.log(
      `${actor.name} received effect ${effect.id}`
    );

    return;
  }

  if (
    effect.duration > existing_effect.duration ||
    effect.damage > existing_effect.damage
  ) {
    actor.effects = actor.effects.filter(
      current_effect => current_effect.id != effect.id
    );

    actor.effects.push(effect);

    console.log(
      `${actor.name} refreshed effect ${effect.id}`
    );

    return;
  }

  console.log(
    `${actor.name} already has stronger effect ${effect.id}`
  );
}

export function apply_bleeding(actor) {
  add_effect(actor, create_bleeding());
}

export function process_effects(actor) {
  for (let effect of actor.effects) {
    apply_effect(actor, effect);
  }
}

export function update_effects(actor) {
  for (let effect of actor.effects) {
    effect.duration--;
  }

  let finished_effects = actor.effects.filter(
    effect => effect.duration <= 0
  );

  for (let effect of finished_effects) {
    console.log(
      `${actor.name} effect ${effect.id} ended`
    );
  }

  actor.effects = actor.effects.filter(
    effect => effect.duration > 0
  );
}
