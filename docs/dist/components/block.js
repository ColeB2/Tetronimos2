export class Block {
  constructor(x, y, width, color, state) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color;
    this.state = state;
  }
  drawBlock(ctx) {
    ctx.fillStyle = this.state === 1 ? this.color : "black";
    ctx.fillRect(this.x * this.width, this.y * this.width, this.width - 1, this.width - 1);
  }
}
