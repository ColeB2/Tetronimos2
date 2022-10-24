import { Block } from './block';

export class Board {
  width: number;
  height: number;
  boardColor: string;
  boardState: Block[][];

  constructor(
    width: number,
    height: number,
    boardColor: string,
    boardState: [][],
  ) {
    this.width = width;
    this.height = height;
    this.boardColor = boardColor;
    this.boardState = boardState;
  }

  public printBoard(): void {
    console.log('-----Board State-----');
    this.boardState.forEach((row) => {
      let boardRow: number[] = [];
      row.forEach((block) => {
        boardRow.push(block.state);
      });
      console.log(boardRow);
    });
  }

  public createBlankBoard(): void {
    for (let r = 0; r < this.height; r++) {
      this.boardState.push(new Array());
      for (let c = 0; c < this.width; c++) {
        const block = new Block(c, r, 30, 'black', 0);
        this.boardState[r].push(block);
      }
    }
  }
  public drawBoard(ctx: any): void {
    this.boardState.forEach((row, r) => {
      row.forEach((cell, c) => {
        cell.drawBlock(ctx);
      });
    });
  }

  public resetBoard(): void {
    this.boardState.forEach((row) => {
      row.forEach((block) => {
        block.state = 0;
      });
    });
  }

  openSpace(x: number, y: number) {
    try {
      return this.boardState[y][x].state === 0;
    } catch (e) {
      return false;
    }
  }

  lineClearCheck(): number[] {
    let linesToClear: number[] = [];
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

  clearRow(rowToBeCleared: number) {
    this.boardState[rowToBeCleared].forEach((block) => {
      block.state = 0;
    });
  }

  moveRowsDown(rowCleared: number) {
    for (let r = rowCleared; r > 0; r--) {
      this.boardState[r].forEach((block, b) => {
        let aboveBlock = this.boardState[r - 1][b];
        block.state = aboveBlock.state;
        block.color = aboveBlock.color;
      });
    }
  }
}
