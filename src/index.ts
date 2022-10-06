import { Board } from './components/board';




//GLOBAL VARIABLES
interface myGlobalVariables {
    [key: string]: any
  }
var myGlobal: myGlobalVariables = {};
myGlobal.cellWidth = 50;
myGlobal.canvas = document.getElementById('canvas') as HTMLCanvasElement;
myGlobal.ctx = myGlobal.canvas.getContext('2d')


const board = new Board(10, 20, 'black', [])
board.createBlankBoard()
board.drawBoard(myGlobal.ctx)
console.log(board)