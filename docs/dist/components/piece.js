import {Block} from "./block.js";
import {BLOCK_WIDTH} from "../constants/constants.js";
export class Piece {
  constructor(vitals, boardObject) {
    this.orientation = 0;
    this.currentOrientation = [];
    this.landed = false;
    this.pieceMap = [];
    this.xOffset = 0;
    this.yOffset = 0;
    this.xOffsetSpawnValue = 7;
    this.name = vitals.name;
    this.color = vitals.color;
    this.allOrientations = vitals.pieceMap;
    this.currentOrientation = this.allOrientations[this.orientation];
    this.board = boardObject;
    this.setSpawnOffset();
    this.validSpawn = true;
  }
  createPiece() {
    for (let r = 0; r < this.currentOrientation.length; r++) {
      this.pieceMap.push(new Array());
      for (let c = 0; c < this.currentOrientation[0].length; c++) {
        const block = new Block(c + this.xOffset, r - this.yOffset, BLOCK_WIDTH, this.color, this.currentOrientation[r][c]);
        this.pieceMap[r].push(block);
      }
    }
  }
  setSpawnOffset() {
    let pieceWidth = this.currentOrientation[0].length;
    this.xOffset = this.xOffsetSpawnValue - pieceWidth;
    for (let r = 0; r < this.currentOrientation.length; r++) {
      if (this.currentOrientation[r].includes(1)) {
        this.yOffset = r;
        break;
      }
    }
  }
  checkSpawnValidity() {
    let validSpawn = true;
    let spawn_xoffset = 3;
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
  spawnPiece() {
    let validSpawn = this.checkSpawnValidity();
    if (validSpawn) {
      this.createPiece();
    } else {
      this.validSpawn = false;
    }
  }
  handleGravity() {
    if (this.checkCollision()) {
      this.movePieceDown();
    } else {
      this.lockPiece();
    }
  }
  checkCollision() {
    let movePiece = true;
    let y_block_below = 1;
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.state === 1) {
          if (cell.y + y_block_below > this.board.height) {
            movePiece = false;
          } else if (this.board.openSpace(cell.x, cell.y + y_block_below) && cell.y < this.board.height && movePiece !== false) {
            movePiece = true;
          } else {
            movePiece = false;
          }
        }
      });
    });
    return movePiece;
  }
  movePieceDown() {
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        cell.y += 1;
      });
    });
  }
  lockPiece() {
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
  checkRotationalCollision(rotationalDirection) {
    let rotatePiece = true;
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        let rotation = this.allOrientations[this.nextRotationState(rotationalDirection)];
        let next_state = rotation[r][c];
        if (next_state === 1) {
          if (this.board.openSpace(cell.x, cell.y) && cell.x >= 0 && cell.x <= this.board.width && rotatePiece != false) {
            rotatePiece = true;
          } else {
            rotatePiece = false;
          }
        }
      });
    });
    return rotatePiece;
  }
  nextRotationState(rotationalDirection) {
    let nextState = this.orientation + rotationalDirection;
    if (nextState >= this.allOrientations.length) {
      nextState = 0;
    } else if (nextState < 0) {
      nextState = this.allOrientations.length - 1;
    }
    return nextState;
  }
  rotatePiece(rotationalDirection) {
    this.orientation = this.nextRotationState(rotationalDirection);
    this.currentOrientation = this.allOrientations[this.orientation];
    this.pieceMap.forEach((row, r) => {
      row.forEach((cell, c) => {
        cell.state = this.currentOrientation[r][c];
      });
    });
  }
  checkLateralCollision(direction) {
    let movePiece = true;
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        if (cell.state === 1) {
          if (movePiece && this.board.openSpace(cell.x + direction, cell.y) && cell.x >= 0 && cell.x < this.board.width) {
            movePiece = true;
          } else {
            movePiece = false;
          }
        }
      });
    });
    return movePiece;
  }
  movePiece(direction) {
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        cell.x = cell.x + direction;
      });
    });
  }
  handleMovement(direction, rotation = false) {
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
  drawPiece(ctx) {
    this.pieceMap.forEach((row) => {
      row.forEach((cell) => {
        if (cell.state === 1) {
          cell.drawBlock(ctx);
        }
      });
    });
  }
  drawNextBox(ctx, width, height) {
    let yOffset = height / 3;
    let pieceSize = this.currentOrientation[0].length;
    let xOffset = pieceSize === 3 ? 30 : 15;
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.fillText("NEXT", 10, 30);
    this.currentOrientation.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 1) {
          ctx.fillStyle = this.color;
          ctx.fillRect(c * 30 + xOffset, r * 30 + yOffset, 29, 29);
        }
      });
    });
  }
  drawStatBox(ctx, width, height, verticalOffset) {
    let scale = 20;
    let pieceSize = this.currentOrientation[0].length;
    let xOffset = (width - pieceSize * scale) / 2 - 20;
    let yOffset = 60 + verticalOffset * scale * 2.5;
    if (this.name === "I") {
      yOffset -= 15;
    }
    if (this.name === "O") {
      yOffset -= 5;
    }
    this.currentOrientation.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 1) {
          ctx.fillStyle = this.color;
          ctx.fillRect(c * scale + xOffset, r * scale + yOffset, scale - 1, scale - 1);
        }
      });
    });
  }
}
