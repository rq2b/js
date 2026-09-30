import {
  player,
  boss
} from "./config.js";

import {
  create_fsm,
  run_turn
} from "./fsm.js";


const combat = {
  player: player,
  boss: boss,
  turn: 1
};

const fsm = create_fsm();

for (let i = 0; i < 100; i++) { run_turn(fsm, combat); }

