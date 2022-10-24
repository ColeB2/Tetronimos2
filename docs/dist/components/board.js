import {Block} from "./block.js";
export class Board {
  constructor(width, height, boardColor, boardState) {
    this.width = width;
    this.height = height;
    this.boardColor = boardColor;
    this.boardState = boardState;
  }
  printBoard() {
    console.log("-----Board State-----");
    this.boardState.forEach((row) => {
      let boardRow = [];
      row.forEach((block) => {
        boardRow.push(block.state);
      });
      console.log(boardRow);
    });
  }
  createBlankBoard() {
    for (let r = 0; r < this.height; r++) {
      this.boardState.push(new Array());
      for (let c = 0; c < this.width; c++) {
        const block = new Block(c, r, 30, "black", 0);
        this.boardState[r].push(block);
      }
    }
  }
  drawBoard(ctx) {
    this.boardState.forEach((row, r) => {
      row.forEach((cell, c) => {
        cell.drawBlock(ctx);
      });
    });
  }
  resetBoard() {
    this.boardState.forEach((row) => {
      row.forEach((block) => {
        block.state = 0;
      });
    });
  }
  openSpace(x, y) {
    try {
      return this.boardState[y][x].state === 0;
    } catch (e) {
      return false;
    }
  }
  lineClearCheck() {
    let linesToClear = [];
    this.boardState.forEach((row, r) => {
      let filled = true;
      row.forEach((block) => {
        if (block.state === 0) {
          filled = false;
        }
      });
      if (filled === true) {
        linesToClear.push(r);
      }
    });
    return linesToClear;
  }
  clearRow(rowToBeCleared) {
    this.boardState[rowToBeCleared].forEach((block) => {
      block.state = 0;
    });
  }
  moveRowsDown(rowCleared) {
    for (let r = rowCleared; r > 0; r--) {
      this.boardState[r].forEach((block, b) => {
        let aboveBlock = this.boardState[r - 1][b];
        block.state = aboveBlock.state;
        block.color = aboveBlock.color;
      });
    }
  }
}
