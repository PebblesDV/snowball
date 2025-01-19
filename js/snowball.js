export default class Snowball {
  constructor(x, y, size, speed, ctx) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  update() {
    this.y += this.speed;
  }

  isColliding(player) {
    return (
      this.y + this.size >= player.y &&
      this.y <= player.y + player.height &&
      this.x + this.size > player.x &&
      this.x < player.x + player.width
    );
  }

  isOutOfBounds(canvasHeight) {
    return this.y > canvasHeight;
  }
}
