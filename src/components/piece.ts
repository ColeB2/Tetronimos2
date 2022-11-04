import type { Board } from './board';
import type { PieceObject } from './types';
import { Block } from './block';

export class Piece {
  private orientation: number = 0;
  private currentOrientation: number[][] = [];
  public landed: boolean = false;
  private allOrientations: number[][][];
  private pieceMap: Block[][] = [];
  public xOffset: number = 0;
  public yOffset: number = 0;
  public validSpawn: boolean;

  name: string;
  color: string;
  board: Board;

  constructor(vitals: PieceObject, boardObject: Board) {
    this.name = vitals.name;
    this.color = vitals.color;
    this.allOrientations = vitals.pieceMap;
    this.currentOrientation = this.allOrientations[this.orientation];
    this.board = boardObject;
    this.setSpawnOffset();
    this.validSpawn = true;
  }

  private createPiece() {
    for (let r = 0; r < this.currentOrientation.length; r++) {
      this.pieceMap.push(new Array());
      for (let c = 0; c < this.currentOrientation[0].length; c++) {
        const block = new Block(
          c + this.xOffset,
          r - this.yOffset,
          30,
          this.color,
          this.currentOrientation[r][c],
        );
        this.pieceMap[r].push(block);
      }
    }
  }

  private setSpawnOffset(): void {
    //Sets x/yOffset to spawn piece properly above board.
    this.xOffset = 7 - this.currentOrientation[0].length;
    for (let r = 0; r < this.currentOrientation.length; r++) {
      if (this.currentOrientation[r].includes(1)) {
        this.yOffset = r;
        break;
      }
    }
  }

  private checkSpawnValidity(): boolean {
    let validSpawn: boolean = true;
    let spawn_xoffset: number = 3;
    this.currentOrientation.forEach((row, r) => {
      row.forEach((cellState, c) => {
        if (cellState === 1 && validSpawn) {
          let x = c + spawn_xoffset;
          let y = r - this.yOffset;
          validSpawn = this.board.openSpace(x, y) ? true : false;
        }
      });
    });
    return validSpawn;
  }

  public spawnPiece(): void {
    let validSpawn: boolean = this.checkSpawnValidity();
    if (validSpawn) {
      this.createPiece();
    } else {
      this.validSpawn = false;
    }
  }

  // Downward movement
  public handleGravity(): void {
    if (this.checkCollision()) {
      this.movePieceDown();
    } else {
      this.lockPiece();
    }
  }

  private checkCollision(): boolean {
    let movePiece: boolean = true;
    let y_block_below: number = 1;
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.state === 1) {
          if (cell.y + y_block_below > this.board.height) {
            movePiece = false;
          } else if (
            this.board.openSpace(cell.x, cell.y + y_block_below) &&
            cell.y < this.board.height &&
            movePiece !== false
          ) {
            movePiece = true;
          } else {
            movePiece = false;
          }
        }
      });
    });
    return movePiece;
  }

  private movePieceDown(): void {
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        cell.y += 1;
      });
    });
  }

  private lockPiece(): void {
    this.landed = true;
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        if (cell.state === 1) {
          this.board.boardState[cell.y][cell.x].state = 1;
          this.board.boardState[cell.y][cell.x].color = this.color;
        }
      });
    });
  }

  //Lateral and Rotational Movements
  private checkRotationalCollision(rotationalDirection: number): boolean {
    let rotatePiece: boolean = true;
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        let rotation =
          this.allOrientations[this.nextRotationState(rotationalDirection)];
        let next_state = rotation[r][c];
        if (next_state === 1) {
          if (
            this.board.openSpace(cell.x, cell.y) &&
            cell.x >= 0 &&
            cell.x <= this.board.width &&
            rotatePiece != false
          ) {
            rotatePiece = true;
          } else {
            rotatePiece = false;
          }
        }
      });
    });
    return rotatePiece;
  }

  private nextRotationState(rotationalDirection: number): number {
    // Calculates next index value next rotational will be @.
    let nextState: number = this.orientation + rotationalDirection;
    if (nextState >= this.allOrientations.length) {
      nextState = 0;
    } else if (nextState < 0) {
      nextState = this.allOrientations.length - 1;
    }
    return nextState;
  }

  private rotatePiece(rotationalDirection: number): void {
    this.orientation = this.nextRotationState(rotationalDirection);
    this.currentOrientation = this.allOrientations[this.orientation];

    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        cell.state = this.currentOrientation[r][c];
      });
    });
  }

  private checkLateralCollision(direction: number): boolean {
    let movePiece: boolean = true;
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        if (cell.state === 1) {
          if (
            movePiece &&
            this.board.openSpace(cell.x + direction, cell.y) &&
            cell.x >= 0 &&
            cell.x < this.board.width
          ) {
            movePiece = true;
          } else {
            movePiece = false;
          }
        }
      });
    });
    return movePiece;
  }

  private movePiece(direction: number) {
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        cell.x = cell.x + direction;
      });
    });
  }

  public handleMovement(direction: number, rotation = false): void {
    if (rotation) {
      if (this.checkRotationalCollision(direction)) {
        this.rotatePiece(direction);
      }
    } else {
      if (this.checkLateralCollision(direction)) {
        this.movePiece(direction);
      }
    }
  }

  //Drawing Methods
  public drawPiece(ctx: CanvasRenderingContext2D): void {
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        if (cell.state === 1) {
          cell.drawBlock(ctx);
        }
      });
    });
  }

  public drawNextBox(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ): void {
    let yOffset = height / 3;
    let pieceSize = this.currentOrientation[0].length;
    let xOffset = pieceSize === 3 ? 30 : 15;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('NEXT', 10, 30);

    this.currentOrientation.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 1) {
          ctx.fillStyle = this.color;
          ctx.fillRect(c * 30 + xOffset, r * 30 + yOffset, 29, 29);
        }
      });
    });
  }

  public drawStatBox(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    verticalOffset: number,
  ): void {
    let scale = 20;
    let pieceSize = this.currentOrientation[0].length;
    let xOffset = (width - pieceSize * scale) / 2 - 20;
    let yOffset = 60 + verticalOffset * scale * 2.5;
    if (this.name === 'I') {
      yOffset -= 15;
    }
    if (this.name === 'O') {
      yOffset -= 5;
    }

    this.currentOrientation.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 1) {
          ctx.fillStyle = this.color;
          ctx.fillRect(
            c * scale + xOffset,
            r * scale + yOffset,
            scale - 1,
            scale - 1,
          );
        }
      });
    });
  }
}
