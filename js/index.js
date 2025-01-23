import Snowball from "./snowball.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const gameOverMessage = document.getElementById("gameOver");
const startButton = document.getElementById("startButton");

//game variables
let score = 0;
let missed = 0;
let snowballs = [];
const maxMissed = 10;
const player = { x: 275, y: 350, width: 100, height: 10, color: "red" };

let snowballInterval = 2000; //time between snowball spawns
let gameLoopId = null;
let snowballGeneratorInterval = null;
let snowballSpeedInterval = null;

//track key press states
const keys = {
  left: false,
  right: false,
};

//starts the game
function startGame() {
  resetGameVariables(); //resets game variables to default values
  hideStartButton(); //hide start game button
  setupIntervals(); //sets interval for snowball spawns
  gameLoop(); //starts gameloop
}

//stops the game
function stopGame() {
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }

  //clears snowball generator interval
  if (snowballGeneratorInterval) {
    clearTimeout(snowballGeneratorInterval);
    snowballGeneratorInterval = null;
  }

  //clears snowball speed interval
  if (snowballSpeedInterval) {
    clearInterval(snowballSpeedInterval);
    snowballSpeedInterval = null;
  }

  //clears all the snowballs
  snowballs = [];
}

//restarts the game
function restartGame() {
  stopGame();
  startGame();
}

//resets game variables to default values
function resetGameVariables() {
  score = 0;
  missed = 0;
  snowballs.length = 0;
  snowballInterval = 2000;
  gameOverMessage.style.display = "none";
}

//hides start game button
function hideStartButton() {
  startButton.style.display = "none";
}

//sets interval for spawning snowballs and adjusting speed
function setupIntervals() {
  adjustSnowballSpeed();
  generateSnowballs();
}

//spawns snowballs
function generateSnowballs() {
  function spawnSnowball() {
    const size = Math.random() * 20 + 10;
    const speed = 2;
    const x = Math.random() * (canvas.width - size);
    snowballs.push(new Snowball(x, 0, size, speed, ctx));

    snowballGeneratorInterval = setTimeout(spawnSnowball, snowballInterval);
  }

  //spawns first snowball when game starts
  spawnSnowball();
}

//adjusts snowball speed every 2 seconds
function adjustSnowballSpeed() {
  snowballSpeedInterval = setInterval(() => {
    if (snowballInterval > 1000) {
      snowballInterval -= 100;
      console.log("Snowball interval adjusted to:", snowballInterval);
    }
  }, 2000);
}

//draws the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

//draws the snowballs
function drawSnowballs() {
  for (const ball of snowballs) {
    ball.draw();
  }
}

//updates snowballs
function updateSnowballs() {
  for (let i = snowballs.length - 1; i >= 0; i--) {
    const ball = snowballs[i];
    ball.update(); //updates snowball postition

    //checks if snowball collides with player
    if (ball.isColliding(player)) {
      score++;
      snowballs.splice(i, 1);
      continue;
    }

    //check if snowball goes out of bounds (outiside of canvas)
    if (ball.isOutOfBounds(canvas.height)) {
      missed++;
      snowballs.splice(i, 1);
    }
  }
}

//updates scoreboard
function updateScoreboard() {
  scoreboard.textContent = `Score: ${score} | Missed: ${missed}`;
}

//checks if game is over
function checkGameOver() {
  if (missed >= maxMissed) {
    gameOverMessage.style.display = "block";
    stopGame();
  }
}

//main gameloop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayerMovement(); //updates player movement
  drawPlayer(); //draws player
  drawSnowballs(); //draws snowballs
  updateSnowballs(); //updates snowballs position and collision
  updateScoreboard(); //updates scoreboard
  checkGameOver(); //checks if game is over

  //requests next gameloop frame
  gameLoopId = requestAnimationFrame(gameLoop);
}

//updates player movement with key presses
function updatePlayerMovement() {
  if (keys.left && player.x > 0) {
    player.x -= 5;
  }
  if (keys.right && player.x + player.width < canvas.width) {
    player.x += 5;
  }
}

//tracks when arrow keys are pressed
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});

//tracks when arrow keys are released
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

//starts game when start button is clicked
startButton.addEventListener("click", startGame);

//restarts game when enter or r is pressed
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "r") {
    restartGame();
  }
});
