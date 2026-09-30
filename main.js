import {
  player,
  boss
} from "./config.js";

import {
  create_fsm,
  run_turn
} from "./fsm.js";

let combat = {
  player: player,
  boss: boss,
  turn: 1
};

let fsm = create_fsm();

document.getElementById("start_game").onclick = function() {
  document.getElementById("start").remove();
  run_turn(fsm, combat);
};
