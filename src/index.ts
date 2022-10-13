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
  public ctx: CanvasRenderingContext2DSettings;
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

  constructor() {
    this.cellWidth = 50;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2DSettings
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

    this.downFrequency = SPEED[this.level]
    this.downMoveFreqency = this.downFrequency

    this.initializeGame()
    this.movementControlEvents()
    

    
  }

  initializeGame() {
    this.board.createBlankBoard()
    
  
    this.piece.spawnPiece()

    this.board.drawBoard(this.ctx)
    this.piece.drawPiece(this.ctx)

  }

  update() {
    this.updateVisuals()
    // this.piece.handleGravity()
    this.pieceGravity()

    // this.piece.handleMovement(1)
    // this.piece.handleMovement(-1, true)
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
const board = new Board(10, 20, 'black', [])
const piece = new Piece(tetronimoPieces[2], board)
piece.createPiece()
// piece.spawnPiece()
// console.log(piece)
const mg = new MainGame()
mg.mainLoop()


//GLOBAL VARIABLES
// interface myGlobalVariables {
//     [key: string]: any
//   }
// var myGlobal: myGlobalVariables = {};
// myGlobal.cellWidth = 50;
// myGlobal.canvas = document.getElementById('canvas') as HTMLCanvasElement;
// myGlobal.ctx = myGlobal.canvas.getContext('2d')

// myGlobal.isRunning = true;
// myGlobal.startTime = performance.now();




// const board = new Board(10, 20, 'black', [])
// board.createBlankBoard()
// // board.boardState[5][5].color = 'blue'
// // board.boardState[5][5].state = 1
// board.drawBoard(myGlobal.ctx)

// console.log(board)
// console.log(board.boardState[5][5].color,board.boardState[5][6].color)

// const piece = new Piece(tetronimoPieces[2], board)

// piece.createPiece()
// // piece.spawnPiece()
// console.log(piece)
// board.drawBoard(myGlobal.ctx)
// piece.drawPiece(myGlobal.ctx)

// // function run() {
// //   for (let i=0;i<15;i++){
// //     piece.handleGravity()
// //     board.drawBoard(myGlobal.ctx)
// //     piece.drawPiece(myGlobal.ctx)
// //     // setTimeout(run, 1000)
// //   }
// // }
// // run()
// // const piece2 = new Piece(tetronimoPieces[4], board)
// // piece2.rotatePiece(1)
// // piece2.movePiece(-1)
// // piece2.movePiece(-1)
// // piece2.createPiece()
// // for (let i=0;i<15;i++){
// //   piece2.handleGravity()
// //   board.drawBoard(myGlobal.ctx)
// //   piece2.drawPiece(myGlobal.ctx)
// //   // setTimeout(run, 1000)
// // }

// function mainLoop() {
//   function main(timestamp: DOMHighResTimeStamp) {
//     if (myGlobal.isRunning) {
//       const drawStart = timestamp
//       const diff = drawStart - myGlobal.startTime

//       if (diff > 1000) {
//         piece.handleGravity()
//         // piece.rotatePiece(1)
//         // piece.movePiece(-1)
//         piece.handleMovement(1)
//         piece.handleMovement(-1, true)
//         board.drawBoard(myGlobal.ctx)
//         piece.drawPiece(myGlobal.ctx)
//         myGlobal.startTime = performance.now()

//       }
      
//       window.requestAnimationFrame(main)
//     }
//   }
//   window.requestAnimationFrame(main)
// }

// function mainLoop1(timestamp: DOMHighResTimeStamp) {
//   if (myGlobal.isRunning) {
//     const drawStart = timestamp
//     const diff = drawStart - myGlobal.startTime

//     if (diff > 1000) {
//       piece.handleGravity()
//       // piece.rotatePiece(1)
//       // piece.movePiece(-1)
//       piece.handleMovement(1)
//       piece.handleMovement(-1, true)
//       board.drawBoard(myGlobal.ctx)
//       piece.drawPiece(myGlobal.ctx)
//       myGlobal.startTime = performance.now()

//     }
    
//     window.requestAnimationFrame(mainLoop1)
//   }
// }
// mainLoop1(performance.now())





