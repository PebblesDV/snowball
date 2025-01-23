export default class Snowball {
  //initializes properties of snowball
  constructor(x, y, size, speed, ctx) {
    this.x = x; //x position
    this.y = y; //y position
    this.size = size; //size
    this.speed = speed; //speed
    this.ctx = ctx; //canvas rendering
  }

  //draws snowball on canvas
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  //updates snowball y position
  update() {
    this.y += this.speed;
  }

  //checks if snowball collides with player
  isColliding(player) {
    return (
      this.y + this.size >= player.y &&
      this.y <= player.y + player.height &&
      this.x + this.size > player.x &&
      this.x < player.x + player.width
    );
  }

  //checks if snowball is out of bounds
  isOutOfBounds(canvasHeight) {
    return this.y > canvasHeight;
  }
}
