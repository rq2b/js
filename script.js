const score_display = document.getElementById("score");
const time_display = document.getElementById("time");

let score = 0;
let time = 30;
let game_over = false;

let spawn_timer;
let game_timer;

function spawnTarget() {
  const target = document.createElement("div");
  target.className = "target-square";

  let x = Math.random() * (window.innerWidth - 50);
  let y = Math.random() * (window.innerHeight - 50);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener("click", (event) => {
    event.stopPropagation();
    if (game_over) return;

    score++;
    score_display.textContent = "score: " + score;
    target.remove();
  });

  document.body.appendChild(target);

  setTimeout(() => target.remove(), 2000);
}

function endGame() {
  game_over = true;

  clearInterval(spawn_timer);
  clearInterval(game_timer);

  document.querySelectorAll(".target-square").forEach((target) => target.remove());

  time_display.textContent = "game over";
}

document.body.addEventListener("click", () => {
  if (game_over) return;

  score--;
  score_display.textContent = "score: " + score;
});

spawn_timer = setInterval(() => {
  if (game_over) return;
  spawnTarget();
}, 1000);

game_timer = setInterval(() => {
  time--;
  time_display.textContent = "time: " + time;

  if (time <= 0) endGame();
}, 1000);
