import {Block} from './piece';

export class Board {
    width: number;
    height: number;
    boardColor: string;
    boardState: Block[][]

    constructor(width: number, height: number, boardColor: string, boardState:[][]) {
        this.width = width;
        this.height = height;
        this.boardColor = boardColor;
        this.boardState = boardState;
    }

    public createBlankBoard(): void {
        for (let r = 0; r < this.height; r++) {
            this.boardState.push(new Array())
            for (let c = 0; c < this.width; c++) {
                const block = new Block(c, r, 30, 'black', 0)
                this.boardState[r].push(block)

            }
        }

    }
    public drawBoard(ctx: any): void {
        this.boardState.forEach((row, r) => {
            row.forEach((cell, c) => {
                cell.drawBlock(ctx)
            })
        })
    }

    private resetBoard(): void {
        this.boardState.forEach((row, r) => {
            row.forEach((cell, c) => {
                cell.state = 0
            })
        })
    }

    
    openSpace(x:number,y:number) {
        try {
            return this.boardState[y][x].state === 0
        } catch (e) {
            return false;
        }
        
    }



}