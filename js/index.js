import Snowball from "./snowball.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const gameOverMessage = document.getElementById("gameOver");
const startButton = document.getElementById("startButton");

let score = 0;
let missed = 0;
let snowballs = [];
const maxMissed = 10;
const player = { x: 275, y: 350, width: 100, height: 10, color: "red" };

let snowballInterval = 2000;
let gameLoopId = null;
let snowballGeneratorInterval = null;
let snowballSpeedInterval = null;

const keys = {
  left: false,
  right: false,
};

function startGame() {
  resetGameVariables();
  hideStartButton();
  setupIntervals();
  gameLoop();
}

function stopGame() {
  cancelAnimationFrame(gameLoopId);
  clearInterval(snowballGeneratorInterval);
  clearInterval(snowballSpeedInterval);
  snowballs = [];
}

function restartGame() {
  stopGame();
  startGame();
}

function resetGameVariables() {
  score = 0;
  missed = 0;
  snowballs.length = 0;
  snowballInterval = 2000;
  gameOverMessage.style.display = "none";
}

function hideStartButton() {
  startButton.style.display = "none";
}

function setupIntervals() {
  adjustSnowballSpeed();
  generateSnowballs();
}

function generateSnowballs() {
  console.log("INTERVAL STARTED");

  function spawnSnowball() {
    const size = Math.random() * 20 + 10;
    const speed = 2;
    const x = Math.random() * (canvas.width - size);
    snowballs.push(new Snowball(x, 0, size, speed, ctx));

    snowballGeneratorInterval = setTimeout(spawnSnowball, snowballInterval);
  }

  spawnSnowball();
}

function adjustSnowballSpeed() {
  snowballSpeedInterval = setInterval(() => {
    if (snowballInterval > 1000) {
      snowballInterval -= 100;
      console.log("Snowball interval adjusted to:", snowballInterval);
    }
  }, 5000);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawSnowballs() {
  for (const ball of snowballs) {
    ball.draw();
  }
}

function updateSnowballs() {
  for (let i = snowballs.length - 1; i >= 0; i--) {
    const ball = snowballs[i];
    ball.update();

    if (ball.isColliding(player)) {
      score++;
      snowballs.splice(i, 1);
      continue;
    }

    if (ball.isOutOfBounds(canvas.height)) {
      missed++;
      snowballs.splice(i, 1);
    }
  }
}

function updateScoreboard() {
  scoreboard.textContent = `Score: ${score} | Missed: ${missed}`;
}

function checkGameOver() {
  if (missed >= maxMissed) {
    gameOverMessage.style.display = "block";
    stopGame();
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayerMovement();
  drawPlayer();
  drawSnowballs();
  updateSnowballs();
  updateScoreboard();
  checkGameOver();

  gameLoopId = requestAnimationFrame(gameLoop);
}

function updatePlayerMovement() {
  if (keys.left && player.x > 0) {
    player.x -= 5;
  }
  if (keys.right && player.x + player.width < canvas.width) {
    player.x += 5;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

startButton.addEventListener("click", startGame);

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "r") {
    restartGame();
  }
});
