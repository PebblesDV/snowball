// Select elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const gameOverMessage = document.getElementById("gameOver");
const startButton = document.getElementById("startButton"); // Start button element

// Game variables
let score = 0;
let missed = 0;
const maxMissed = 10;
const snowballs = [];
const player = { x: 275, y: 350, width: 100, height: 10, color: "red" };

let snowballInterval = 2000;

// Function to generate snowballs at regular intervals
function generateSnowballs() {
  setInterval(() => {
    const size = Math.random() * 20 + 10;
    const snowballSpeed = 2;
    const x = Math.random() * (canvas.width - size);
    snowballs.push({ x, y: 0, size, snowballSpeed });
  }, snowballInterval);
}

// Decrease the interval over time
setInterval(() => {
  if (snowballInterval > 200) {
    snowballInterval -= 100; // Reduce interval by 100ms every 5 seconds
  }
}, 5000);

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw snowballs
function drawSnowballs() {
  ctx.fillStyle = "white";
  for (const ball of snowballs) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Update snowballs
function updateSnowballs() {
  for (let i = snowballs.length - 1; i >= 0; i--) {
    const ball = snowballs[i];
    ball.y += ball.snowballSpeed;

    // Check collision with player (snowball must be above the player and within player width)
    if (
      ball.y + ball.size >= player.y && // Ball is vertically above the player
      ball.y <= player.y + player.height && // Ball is vertically within the player
      ball.x + ball.size > player.x && // Ball is horizontally within the player
      ball.x < player.x + player.width
    ) {
      score++; // Increase score for catching the snowball
      snowballs.splice(i, 1); // Remove the snowball
      continue; // Skip further checks for this snowball
    }

    // Check if ball missed (i.e., it went off the bottom of the canvas)
    if (ball.y > canvas.height) {
      missed++; // Increase missed count
      snowballs.splice(i, 1); // Remove the snowball
    }
  }
}

// Update scoreboard
function updateScoreboard() {
  scoreboard.textContent = `Score: ${score} | Missed: ${missed}`;
}

// Game Over
function checkGameOver() {
  if (missed >= maxMissed) {
    gameOverMessage.style.display = "block";
    cancelAnimationFrame(gameLoop);
  }
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayerMovement(); // Update player position
  drawPlayer(); // Draw player
  drawSnowballs(); // Draw snowballs
  updateSnowballs(); // Update snowballs
  updateScoreboard(); // Update scoreboard
  checkGameOver(); // Check if the game is over

  requestAnimationFrame(gameLoop); // Continue the game loop
}

function restartGame() {
  // Reset game variables
  score = 0;
  missed = 0;
  snowballs.length = 0; // Clear existing snowballs
  gameOverMessage.style.display = "none";
  snowballInterval = 2000;
  // Restart the game loop
  gameLoop();
}

const keys = {
  left: false,
  right: false,
};

// Player movement
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

// Update player movement based on keys being pressed
function updatePlayerMovement() {
  if (keys.left && player.x > 0) {
    player.x -= 5; // Move left
  }
  if (keys.right && player.x + player.width < canvas.width) {
    player.x += 5; // Move right
  }
}

// Player Movement
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "r") {
    restartGame();
  }
});

// Start the game when the start button is clicked
startButton.addEventListener("click", function () {
  startButton.style.display = "none"; // Hide the start button when the game starts
  generateSnowballs(); // Start snowball generation when the game starts
  gameLoop(); // Start the game loop
});
