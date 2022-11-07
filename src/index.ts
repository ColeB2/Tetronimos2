import { Board } from './components/board';
import { Piece } from './components/piece';
import { tetronimoPieces } from './components/tetronimo';
import type { PieceObject, PieceStats } from './components/types';
import { SPEED, LEVELS } from './constants/constants';

// const SPEED = {0:800, 1:717, 2:633, 3:550, 4:467, 5:383, 6:300, 7:217, 8:133, 9:150,
//   10:83, 11:83, 12:83, 13:67, 14:67, 15:67, 16:50, 17:50, 18:50, 19:33,
//   20:33, 21:33, 22:33, 23:33, 24:33, 25:33, 26:33, 27:33, 28:33, 29:17}

class MainGame {
  public cellWidth: number;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public nextBoxCanvas: HTMLCanvasElement;
  public nextBoxCtx: CanvasRenderingContext2D;

  public statsBoxCanvas: HTMLCanvasElement;
  public statsBoxCtx: CanvasRenderingContext2D;

  public board: Board;

  public pieceCount: PieceStats;
  public shapeList: any = tetronimoPieces;
  public piece: Piece;
  public nextPiece: Piece;

  public pieceLanded: boolean;
  public isRunning: boolean;
  public startTime: number;

  public gameOver: boolean;
  public lateralMoveFrequency: number;
  public dtLastLateralMove: number;

  public dtLastDownMove: number;
  public downFrequency: number;
  public downMoveFreqency: number;

  public startLevel: number;
  public level: number;
  public levelValue: HTMLElement;
  public linesCleared: number;
  public linesValue: HTMLElement;
  public score: number;
  public scoreValue: HTMLElement;

  constructor() {
    this.cellWidth = 50;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.nextBoxCanvas = document.getElementById(
      'nextBox',
    ) as HTMLCanvasElement;
    this.nextBoxCtx = this.nextBoxCanvas.getContext(
      '2d',
    ) as CanvasRenderingContext2D;

    this.statsBoxCanvas = document.getElementById(
      'statBox',
    ) as HTMLCanvasElement;
    this.statsBoxCtx = this.statsBoxCanvas.getContext(
      '2d',
    ) as CanvasRenderingContext2D;

    this.board = new Board(10, 20, 'black', []);
    this.pieceCount = { O: 0, I: 0, S: 0, Z: 0, J: 0, L: 0, T: 0 };

    this.piece = new Piece(
      this.shapeList[Math.floor(Math.random() * this.shapeList.length)],
      this.board,
    );
    this.nextPiece = new Piece(
      this.shapeList[Math.floor(Math.random() * this.shapeList.length)],
      this.board,
    );
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

    this.linesValue = document.getElementById('linesValue') as HTMLElement;
    this.scoreValue = document.getElementById('scoreValue') as HTMLElement;
    this.levelValue = document.getElementById('levelValue') as HTMLElement;

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

  updatePieceStats(pieceName: string): void {
    this.pieceCount[pieceName] += 1;
  }

  displayStatText() {
    this.statsBoxCtx.fillStyle = 'white';
    this.statsBoxCtx.font = 'bold 25px Arial';
    this.statsBoxCtx.fillText('STATISTICS', 5, 25);
  }
  displayStatValues() {
    let pieceStats = this.shapeList;
    let x = 95;
    let y = 104;
    this.shapeList.forEach((piece: Piece, p: number) => {
      this.statsBoxCtx.fillStyle = 'white';
      this.statsBoxCtx.font = '20px Arial';
      this.statsBoxCtx.fillText(
        this.pieceCount[piece.name].toString(),
        x,
        y + p * 50,
      );
    });
  }

  displayStats() {
    this.statsBoxCtx.fillStyle = 'black';
    this.statsBoxCtx.fillRect(
      0,
      0,
      this.statsBoxCanvas.width,
      this.statsBoxCanvas.height,
    );
    let pieces = this.createStatePieces();
    pieces.forEach((piece, p) => {
      piece.drawStatBox(
        this.statsBoxCtx,
        this.statsBoxCanvas.width,
        this.statsBoxCanvas.height,
        p,
      );
    });
    this.displayStatText();
    this.displayStatValues();
  }

  updateNextBox() {
    this.nextBoxCtx.fillStyle = 'black';
    this.nextBoxCtx.fillRect(
      0,
      0,
      this.nextBoxCanvas.width,
      this.nextBoxCanvas.height,
    );
    this.nextPiece.drawNextBox(
      this.nextBoxCtx,
      this.nextBoxCanvas.width,
      this.nextBoxCanvas.height,
    );
  }

  createStatePieces(): Piece[] {
    let statPieces: Piece[] = [];
    this.shapeList.forEach((piece: PieceObject) => {
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

  lateralMovementControls(event: any, piece: Piece) {
    const keyName = event.key;
    if (
      performance.now() - this.dtLastLateralMove >
      this.lateralMoveFrequency
    ) {
      if (keyName === 'a' || keyName === 'ArrowLeft') {
        this.piece.handleMovement(-1);
        this.dtLastLateralMove = performance.now();
      } else if (keyName === 'd' || keyName === 'ArrowRight') {
        this.piece.handleMovement(1);
        this.dtLastLateralMove = performance.now();
      }
    }
  }

  downMovementControls(event: any, piece: Piece) {
    const keyName = event.key;
    if (keyName === 's' || keyName === 'ArrowDown') {
      this.downMoveFreqency = 0;
    } else {
      this.downMoveFreqency = this.downFrequency;
    }
  }

  rotationMovementControls(event: any, piece: Piece) {
    const keyName = event.key;
    if (keyName === 'q' || keyName === '7') {
      this.piece.handleMovement(-1, true);
    } else if (keyName === 'e' || keyName === '9') {
      this.piece.handleMovement(1, true);
    }
  }

  downMovementRelease(event: any, piece: Piece) {
    const keyName = event.key;
    if (keyName === 's' || keyName === 'ArrowDown') {
      this.downMoveFreqency = this.downFrequency;
    }
  }

  movementControlEvents() {
    document.addEventListener('keydown', (event) =>
      this.lateralMovementControls(event, this.piece),
    );
    document.addEventListener('keydown', (event) =>
      this.downMovementControls(event, this.piece),
    );
    document.addEventListener('keyup', (event) =>
      this.downMovementRelease(event, this.piece),
    );
    document.addEventListener('keydown', (event) =>
      this.rotationMovementControls(event, this.piece),
    );
  }

  pieceGravity() {
    if (performance.now() - this.dtLastDownMove > this.downMoveFreqency) {
      this.piece.handleGravity();
      this.dtLastDownMove = performance.now();
    }
  }

  handleLevel(): void {
    if (this.level > this.startLevel) {
      if (
        this.linesCleared >=
        LEVELS[this.startLevel] + 10 * (this.level - this.startLevel)
      ) {
        this.level += 1;
        
      }
    } else if (this.linesCleared >= LEVELS[this.startLevel]) {
      this.level = this.startLevel + 1;
    }
    this.levelValue.innerHTML = this.level.toString()
  }

  handleLineScore(numberOfLinesToClear: number) {
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

  handleLineClear(rowsToClear: number[]) {
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
    this.piece = new Piece(
      this.shapeList[Math.floor(Math.random() * this.shapeList.length)],
      this.board,
    );
    this.pieceCount = { O: 0, I: 0, S: 0, Z: 0, J: 0, L: 0, T: 0 };
    this.displayStats();

    this.nextPiece = new Piece(
      this.shapeList[Math.floor(Math.random() * this.shapeList.length)],
      this.board,
    );
    this.piece.spawnPiece();
    this.level = 0;
    this.score = 0;
    this.linesCleared = 0;
    this.linesValue.innerHTML = this.linesCleared.toString();
    this.scoreValue.innerHTML = this.score.toString();
    this.levelValue.innerHTML = this.level.toString();
    this.downFrequency = SPEED[this.level];
    this.gameOver = false;
  }

  gameLogic() {
    if (this.piece.landed) {
      //Line Clearing/Scoring
      let linesToClear = this.board.lineClearCheck();
      if (linesToClear.length !== 0) {
        this.handleLineScore(linesToClear.length);
        this.handleLineClear(linesToClear);
        this.scoreValue.innerHTML = this.score.toString();
        this.linesValue.innerHTML = this.linesCleared.toString();
      }
      this.handleLevel();

      //Piece Handling
      this.piece = this.nextPiece;
      //update piece stats
      this.updatePieceStats(this.piece.name);
      this.displayStats();

      this.piece.spawnPiece();
      this.downFrequency = SPEED[this.level];
      this.downMoveFreqency = this.downFrequency; //reset gravity to level gravity
      this.nextPiece = new Piece(
        this.shapeList[Math.floor(Math.random() * this.shapeList.length)],
        this.board,
      );
      this.updateNextBox();

      //Game Over Check
      //Handle Game over
      this.gameOverCheck();
      if (this.gameOver) {
        this.handleGameOver();
      }
      this.piece.landed = false;

      this.board.printBoard();
    }
  }

  mainLoop() {
    const self = this;
    function main(timestamp: DOMHighResTimeStamp) {
      if (self.isRunning) {
        const drawStart = timestamp;
        const diff = drawStart - self.startTime;

        if (diff > 20) {
          // console.log('clearly read', timestamp, self.piece)
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
