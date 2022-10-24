import {Board} from "./components/board.js";
import {Piece} from "./components/piece.js";
import {tetronimoPieces} from "./components/tetronimo.js";
import {SPEED, LEVELS} from "./components/constants.js";
class MainGame {
  constructor() {
    this.shapeList = tetronimoPieces;
    this.cellWidth = 50;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.nextBoxCanvas = document.getElementById("nextBox");
    this.nextBoxCtx = this.nextBoxCanvas.getContext("2d");
    this.statsBoxCanvas = document.getElementById("statBox");
    this.statsBoxCtx = this.statsBoxCanvas.getContext("2d");
    this.board = new Board(10, 20, "black", []);
    this.pieceCount = {O: 0, I: 0, S: 0, Z: 0, J: 0, L: 0, T: 0};
    this.piece = new Piece(this.shapeList[Math.floor(Math.random() * this.shapeList.length)], this.board);
    this.nextPiece = new Piece(this.shapeList[Math.floor(Math.random() * this.shapeList.length)], this.board);
    this.pieceLanded = false;
    this.isRunning = true;
    this.startTime = performance.now();
    this.gameOver = false;
    this.lateralMoveFrequency = 150;
    this.dtLastLateralMove = performance.now();
    this.dtLastDownMove = performance.now();
    this.startLevel = 0;
    this.level = 0;
    this.linesCleared = 0;
    this.score = 0;
    this.linesValue = document.getElementById("linesValue");
    this.scoreValue = document.getElementById("scoreValue");
    this.levelValue = document.getElementById("levelValue");
    this.downFrequency = SPEED[this.level];
    this.downMoveFreqency = this.downFrequency;
    this.initializeGame();
    this.movementControlEvents();
  }
  initializeGame() {
    this.board.createBlankBoard();
    this.updateNextBox();
    this.displayStats();
    this.piece.spawnPiece();
    this.board.drawBoard(this.ctx);
    this.piece.drawPiece(this.ctx);
  }
  updatePieceStats(pieceName) {
    this.pieceCount[pieceName] += 1;
  }
  displayStatText() {
    this.statsBoxCtx.fillStyle = "white";
    this.statsBoxCtx.font = "bold 25px Arial";
    this.statsBoxCtx.fillText("STATISTICS", 5, 25);
  }
  displayStatValues() {
    let pieceStats = this.shapeList;
    let x = 95;
    let y = 104;
    this.shapeList.forEach((piece, p) => {
      this.statsBoxCtx.fillStyle = "white";
      this.statsBoxCtx.font = "20px Arial";
      this.statsBoxCtx.fillText(this.pieceCount[piece.name].toString(), x, y + p * 50);
    });
  }
  displayStats() {
    this.statsBoxCtx.fillStyle = "black";
    this.statsBoxCtx.fillRect(0, 0, this.statsBoxCanvas.width, this.statsBoxCanvas.height);
    let pieces = this.createStatePieces();
    pieces.forEach((piece, p) => {
      piece.drawStatBox(this.statsBoxCtx, this.statsBoxCanvas.width, this.statsBoxCanvas.height, p);
    });
    this.displayStatText();
    this.displayStatValues();
  }
  updateNextBox() {
    this.nextBoxCtx.fillStyle = "black";
    this.nextBoxCtx.fillRect(0, 0, this.nextBoxCanvas.width, this.nextBoxCanvas.height);
    this.nextPiece.drawNextBox(this.nextBoxCtx, this.nextBoxCanvas.width, this.nextBoxCanvas.height);
  }
  createStatePieces() {
    let statPieces = [];
    this.shapeList.forEach((piece) => {
      statPieces.push(new Piece(piece, this.board));
    });
    return statPieces;
  }
  update() {
    this.updateVisuals();
    this.pieceGravity();
    this.gameLogic();
  }
  updateVisuals() {
    this.board.drawBoard(this.ctx);
    this.piece.drawPiece(this.ctx);
  }
  lateralMovementControls(event, piece) {
    const keyName = event.key;
    if (performance.now() - this.dtLastLateralMove > this.lateralMoveFrequency) {
      if (keyName === "a" || keyName === "ArrowLeft") {
        this.piece.handleMovement(-1);
        this.dtLastLateralMove = performance.now();
      } else if (keyName === "d" || keyName === "ArrowRight") {
        this.piece.handleMovement(1);
        this.dtLastLateralMove = performance.now();
      }
    }
  }
  downMovementControls(event, piece) {
    const keyName = event.key;
    if (keyName === "s" || keyName === "ArrowDown") {
      this.downMoveFreqency = 0;
    } else {
      this.downMoveFreqency = this.downFrequency;
    }
  }
  rotationMovementControls(event, piece) {
    const keyName = event.key;
    if (keyName === "q" || keyName === "7") {
      this.piece.handleMovement(-1, true);
    } else if (keyName === "e" || keyName === "9") {
      this.piece.handleMovement(1, true);
    }
  }
  downMovementRelease(event, piece) {
    const keyName = event.key;
    if (keyName === "s" || keyName === "ArrowDown") {
      this.downMoveFreqency = this.downFrequency;
    }
  }
  movementControlEvents() {
    document.addEventListener("keydown", (event) => this.lateralMovementControls(event, this.piece));
    document.addEventListener("keydown", (event) => this.downMovementControls(event, this.piece));
    document.addEventListener("keyup", (event) => this.downMovementRelease(event, this.piece));
    document.addEventListener("keydown", (event) => this.rotationMovementControls(event, this.piece));
  }
  pieceGravity() {
    if (performance.now() - this.dtLastDownMove > this.downMoveFreqency) {
      this.piece.handleGravity();
      this.dtLastDownMove = performance.now();
    }
  }
  handleLevel() {
    console.log(this.level, this.startLevel);
    if (this.level > this.startLevel) {
      if (this.linesCleared >= LEVELS[this.startLevel] + 10 * (this.level - this.startLevel)) {
        this.level += 1;
      }
    } else if (this.linesCleared >= LEVELS[this.startLevel]) {
      this.level = this.startLevel + 1;
    }
  }
  handleLineScore(numberOfLinesToClear) {
    let multiplier = 40;
    switch (numberOfLinesToClear) {
      case 1:
        multiplier = 40 * (this.level + 1);
        break;
      case 2:
        multiplier = 100 * (this.level + 1);
        break;
      case 3:
        multiplier = 300 * (this.level + 1);
        break;
      case 4:
        multiplier = 1200 * (this.level + 1);
        break;
    }
    this.score += multiplier * (this.level + 1);
  }
  handleLineClear(rowsToClear) {
    this.linesCleared += rowsToClear.length;
    this.linesValue.innerHTML = this.linesCleared.toString();
    rowsToClear.forEach((row) => {
      this.board.clearRow(row);
      this.board.moveRowsDown(row);
    });
  }
  gameOverCheck() {
    if (this.piece.validSpawn === false) {
      this.gameOver = true;
    }
  }
  handleGameOver() {
    this.board.resetBoard();
    this.piece = new Piece(this.shapeList[Math.floor(Math.random() * this.shapeList.length)], this.board);
    this.pieceCount = {O: 0, I: 0, S: 0, Z: 0, J: 0, L: 0, T: 0};
    this.displayStats();
    this.nextPiece = new Piece(this.shapeList[Math.floor(Math.random() * this.shapeList.length)], this.board);
    this.piece.spawnPiece();
    this.level = 0;
    this.score = 0;
    this.linesCleared = 0;
    this.linesValue.innerHTML = this.linesCleared.toString();
    this.scoreValue.innerHTML = this.score.toString();
    this.linesValue.innerHTML = this.linesCleared.toString();
    this.downFrequency = SPEED[this.level];
    this.gameOver = false;
  }
  gameLogic() {
    if (this.piece.landed) {
      let linesToClear = this.board.lineClearCheck();
      if (linesToClear.length !== 0) {
        this.handleLineScore(linesToClear.length);
        this.handleLineClear(linesToClear);
        this.scoreValue.innerHTML = this.score.toString();
        this.linesValue.innerHTML = this.linesCleared.toString();
        console.log(this.score);
      }
      this.handleLevel();
      this.piece = this.nextPiece;
      this.updatePieceStats(this.piece.name);
      this.displayStats();
      this.piece.spawnPiece();
      this.downFrequency = SPEED[this.level];
      this.downMoveFreqency = this.downFrequency;
      this.nextPiece = new Piece(this.shapeList[Math.floor(Math.random() * this.shapeList.length)], this.board);
      this.updateNextBox();
      this.gameOverCheck();
      if (this.gameOver) {
        this.handleGameOver();
      }
      this.piece.landed = false;
      this.board.printBoard();
      console.log(this.pieceCount, this.score, this.level, this.linesCleared);
    }
  }
  mainLoop() {
    const self = this;
    function main(timestamp) {
      if (self.isRunning) {
        const drawStart = timestamp;
        const diff = drawStart - self.startTime;
        if (diff > 20) {
          self.update();
          self.updateVisuals();
          self.startTime = performance.now();
        }
        window.requestAnimationFrame(main);
      }
    }
    window.requestAnimationFrame(main);
  }
}
const mg = new MainGame();
mg.mainLoop();
