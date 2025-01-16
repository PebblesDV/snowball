const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const gameOverMessage = document.getElementById("gameOver");
const startButton = document.getElementById("startButton"); // Start button element

let score = 0;
let missed = 0;
const maxMissed = 10;
const snowballs = [];
const player = { x: 275, y: 350, width: 100, height: 10, color: "red" };

let snowballInterval = 2000;
let gameLoopId = null; // Store requestAnimationFrame ID
let snowballGeneratorInterval = null; // Store snowball generator interval
let snowballSpeedInterval = null; // Store speed decrease interval

//function to generate snowballs with different sizes
function generateSnowballs() {
  snowballGeneratorInterval = setInterval(() => {
    const size = Math.random() * 20 + 10;
    const snowballSpeed = 2;
    const x = Math.random() * (canvas.width - size);
    snowballs.push({ x, y: 0, size, snowballSpeed });
  }, snowballInterval);
}

//decrease the interval over time with 100ms every 5 seconds
function adjustSnowballSpeed() {
  snowballSpeedInterval = setInterval(() => {
    if (snowballInterval > 1000) {
      snowballInterval -= 100;

      console.log("current interval: ", snowballInterval);

      clearInterval(snowballGeneratorInterval);

      console.log("cleared and restarted");
      generateSnowballs();
    }
  }, 2000);
}

//ctx = canvas rendering context
//draw the player (the stick catching the snowballs)
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

//draw snowballs on the canvas
function drawSnowballs() {
  ctx.fillStyle = "white";
  for (const ball of snowballs) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

//update snowballs
function updateSnowballs() {
  for (let i = snowballs.length - 1; i >= 0; i--) {
    const ball = snowballs[i];
    ball.y += ball.snowballSpeed;

    //check collision with player (snowball should be above the player and within player width)
    if (
      ball.y + ball.size >= player.y &&
      ball.y <= player.y + player.height &&
      ball.x + ball.size > player.x &&
      ball.x < player.x + player.width
    ) {
      score++; //increase the score for catching the snowball
      snowballs.splice(i, 1); //remove the snowball from the canvas
      continue; //skip further checks for this snowball
    }

    //check if ball was missed
    if (ball.y > canvas.height) {
      missed++; //increase the missed count
      snowballs.splice(i, 1); //remove the snowball
    }
  }
}

//update scoreboard
function updateScoreboard() {
  scoreboard.textContent = `Score: ${score} | Missed: ${missed}`;
}

//game over function
function checkGameOver() {
  if (missed >= maxMissed) {
    gameOverMessage.style.display = "block";
    cancelAnimationFrame(gameLoopId); // Stop the game loop
    clearInterval(snowballGeneratorInterval); // Stop snowball generation
    clearInterval(snowballSpeedInterval); // Stop speed adjustment
  }
}

//game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayerMovement(); //update player position
  drawPlayer(); //draw player
  drawSnowballs(); //draw snowballs
  updateSnowballs(); //update snowballs
  updateScoreboard(); //update scoreboard
  checkGameOver(); //check if the game is over

  gameLoopId = requestAnimationFrame(gameLoop); //continue the game loop
}

function restartGame() {
  removeButton();

  //reset all game variables
  score = 0;
  missed = 0;
  snowballs.length = 0; //clear existing snowballs
  gameOverMessage.style.display = "none";
  snowballInterval = 2000;

  // Clear any existing intervals or loops
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
  if (snowballGeneratorInterval) clearInterval(snowballGeneratorInterval);
  if (snowballSpeedInterval) clearInterval(snowballSpeedInterval);

  // Restart intervals
  adjustSnowballSpeed();
  generateSnowballs();

  isGamePlaying = true;

  // Restart the game loop
  gameLoop();
}

const keys = {
  left: false,
  right: false,
};

//player movement with arrow keys
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    keys.left = true;
  } else if (e.key === "ArrowRight") {
    keys.right = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    keys.left = false;
  } else if (e.key === "ArrowRight") {
    keys.right = false;
  }
});

//update player movement based on keys being pressed
function updatePlayerMovement() {
  if (keys.left && player.x > 0) {
    player.x -= 5; //move left
  }
  if (keys.right && player.x + player.width < canvas.width) {
    player.x += 5; //move right
  }
}

//button to restart game
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "r") {
    restartGame();
  }
});

function removeButton() {
  startButton.style.display = "none"; //hide the start button when the game starts
  generateSnowballs(); //start snowball generation when the game starts
  adjustSnowballSpeed(); // Start adjusting speed
}

//start the game when the start button is clicked
startButton.addEventListener("click", function () {
  removeButton();
  gameLoop(); //start the game loop
});
