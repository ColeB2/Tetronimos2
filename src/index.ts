import { Board } from './components/board';
import { Piece } from './components/piece';
import { tetronimoPieces } from './components/tetronimo';

// const SPEED = {0:800, 1:717, 2:633, 3:550, 4:467, 5:383, 6:300, 7:217, 8:133, 9:150,
//   10:83, 11:83, 12:83, 13:67, 14:67, 15:67, 16:50, 17:50, 18:50, 19:33,
//   20:33, 21:33, 22:33, 23:33, 24:33, 25:33, 26:33, 27:33, 28:33, 29:17}

const SPEED = [
  800, 717, 633, 550, 467, //0-4
  383, 300, 217, 150, 133, //5-9
  83, 83, 83, 67, 67, 67,  //10-15
  50, 50, 50, 33, 33, 33,  //16-21
  33, 33, 33, 33, 33, 33, 33, 17] //22-29

class MainGame {
  public cellWidth: number;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public nextBoxCanvas: HTMLCanvasElement;
  public nextBoxCtx: CanvasRenderingContext2D;

  public board: Board;
  
  public pieceCount: Object = {'O':0,'I':0, 'S':0,'Z':0,'J':0,'L':0, 'T':0};
  public shapeList: any = tetronimoPieces;
  public piece: Piece;
  public nextPiece: Piece;

  public pieceLanded: boolean
  public isRunning: boolean;
  public startTime: number;

  public gameOver: boolean;
  public lateralMoveFrequency: number;
  public dtLastLateralMove: number;

  public dtLastDownMove: number;
  public downFrequency: number;
  public downMoveFreqency: number;

  public level: number;
  public score: number;

  constructor() {
    this.cellWidth = 50;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.nextBoxCanvas = document.getElementById('nextBox') as HTMLCanvasElement
    this.nextBoxCtx = this.nextBoxCanvas.getContext('2d') as CanvasRenderingContext2D;

    this.board = new Board(10,20,'black', [])
    this.piece = new Piece( 
      this.shapeList[Math.floor(Math.random()*this.shapeList.length)],
      this.board
    )
    this.nextPiece = new Piece( 
      this.shapeList[Math.floor(Math.random()*this.shapeList.length)],
      this.board
    )
    this.pieceLanded = false;
    this.isRunning = true;
    this.startTime = performance.now()

    this.gameOver = false;
    this.lateralMoveFrequency = 150;
    this.dtLastLateralMove = performance.now()

    this.dtLastDownMove = performance.now()

    this.level = 0;
    this.score = 0;

    this.downFrequency = SPEED[this.level]
    this.downMoveFreqency = this.downFrequency

    this.initializeGame()
    this.movementControlEvents()
    

    
  }

  initializeGame() {
    this.board.createBlankBoard()

    this.nextBoxCtx.fillStyle = 'black';
    this.nextBoxCtx.fillRect(0,0,this.nextBoxCanvas.width,this.nextBoxCanvas.height)
    this.nextPiece.drawNextBox(this.nextBoxCtx, this.nextBoxCanvas.width, this.nextBoxCanvas.height)


    this.piece.spawnPiece()

    this.board.drawBoard(this.ctx)
    this.piece.drawPiece(this.ctx)

  }

  update() {
    this.updateVisuals()
    this.pieceGravity()
    this.gameLogic()
  }

  updateVisuals() {
    this.board.drawBoard(this.ctx)
    this.piece.drawPiece(this.ctx)
  }


  lateralMovementControls(event:any, piece:Piece) {
    const keyName = event.key;
    if (performance.now() - this.dtLastLateralMove > this.lateralMoveFrequency) {
      if (keyName === 'a' || keyName === "ArrowLeft") {
        this.piece.handleMovement(-1)
        this.dtLastLateralMove = performance.now()
      } else if (keyName ==='d' || keyName === "ArrowRight") {
        this.piece.handleMovement(1)
        this.dtLastLateralMove = performance.now()
      }
    }
  }

  downMovementControls(event:any, piece:Piece) {
    const keyName = event.key;
    if (keyName === 's' || keyName === "ArrowDown") {
        this.downMoveFreqency = 0
    } else {
      this.downMoveFreqency = this.downFrequency
    } 
  }

  rotationMovementControls(event:any, piece:Piece) {
    const keyName = event.key;
    if (keyName === 'q' || keyName === "7") {
      this.piece.handleMovement(-1, true)
    } else if (keyName ==='e' || keyName === "9") {
    this.piece.handleMovement(1, true)
    }
  }

  downMovementRelease(event:any, piece:Piece) {
    const keyName = event.key;
    if (keyName === 's' || keyName === "ArrowDown") {
      this.downMoveFreqency = this.downFrequency
    }
  }

  movementControlEvents() {
    document.addEventListener('keydown', (event) => this.lateralMovementControls(event, this.piece))
    document.addEventListener('keydown', (event) => this.downMovementControls(event, this.piece))
    document.addEventListener('keyup', (event) => this.downMovementRelease(event, this.piece))
    document.addEventListener('keydown', (event) => this.rotationMovementControls(event, this.piece))
  }

  pieceGravity() {
    if (performance.now() - this.dtLastDownMove > this.downMoveFreqency) {
      this.piece.handleGravity()
      this.dtLastDownMove = performance.now()
    }
  }

  handleLineScore(numberOfLinesToClear: number) {
    let multiplier = 40
    switch (numberOfLinesToClear) {
      case 1:
        multiplier = 40
        break
      case 2:
        multiplier = 100
        break
      case 3:
        multiplier = 300
        break
      case 4:
        multiplier = 1200
        break
    }
    this.score += multiplier * (this.level + 1)

  }

  handleLineClear(rowsToClear: number[]) {
    rowsToClear.forEach((row) => {
      this.board.clearLine(row)
      this.board.moveRowsDown(row)
    })

  }

  gameLogic() {
    if (this.piece.landed) {
      let linesToClear = this.board.lineClearCheck()
      if (linesToClear.length !== 0) {
        console.log(linesToClear)
        this.handleLineScore(linesToClear.length)
        this.handleLineClear(linesToClear)
        console.log(this.score)

      }
      //Handle line clear stuff.

      this.piece = this.nextPiece;
      //update piece stats
      this.piece.spawnPiece();
      this.downMoveFreqency = this.downFrequency; //reset gravity to level gravity
      this.nextPiece = new Piece( 
        this.shapeList[Math.floor(Math.random()*this.shapeList.length)],
        this.board
      )
      this.nextBoxCtx.fillStyle = 'black';
      this.nextBoxCtx.fillRect(0,0,this.nextBoxCanvas.width,this.nextBoxCanvas.height)
      this.nextPiece.drawNextBox(this.nextBoxCtx, this.nextBoxCanvas.width, this.nextBoxCanvas.height)

      //Game Over Check
      //Handle Game over

      this.piece.landed = false;

    }
  }

  

  mainLoop() {
    const self = this
    function main(timestamp: DOMHighResTimeStamp) {
      
      if (self.isRunning) {
        const drawStart = timestamp
        const diff = drawStart - self.startTime
  
        if (diff > 20) {
          // console.log('clearly read', timestamp, self.piece)
          self.update()
          self.updateVisuals()
          self.startTime = performance.now()
        }
        
        window.requestAnimationFrame(main)
      }
    

    }
    window.requestAnimationFrame(main)
    
  }
}

const mg = new MainGame()
mg.mainLoop()





