import type { Board } from "./board";



export class Block {
    x: number;
    y: number;
    width: number;
    color: string;
    state: number;
    // xCoord: number;
    // yCoord: number;

    constructor(x: number, y: number, width: number, color: string, state: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color;
        this.state = state;
    }

    private getXCoordinate() {

    }

    public drawBlock(ctx:any) {
        ctx.fillStyle = (this.state === 1? this.color : 'black');
        ctx.fillRect(this.x*this.width, this.y*this.width, this.width-1, this.width-1);
    }
}

type PieceObject = {
    name: string,
    pieceMap: number[][][],
    color: string,
}

export class Piece {
    private orientation: number = 0;
    private currentOrientation: number[][] = [];
    public landed: boolean = false;
    private allOrientations: number[][][];
    private pieceMap: Block[][] = [];
    public xOffset: number = 0;
    public yOffset: number = 0;

    name: string;
    color: string;
    board: Board;

    constructor(vitals: PieceObject, boardObject: Board) {
        this.name = vitals.name
        this.color = vitals.color
        this.allOrientations = vitals.pieceMap
        this.currentOrientation = this.allOrientations[this.orientation]
        this.board = boardObject
        this.setSpawnOffset()
    }

    createPiece() {
        for (let r = 0; r < this.currentOrientation.length; r++) {
            this.pieceMap.push(new Array())
            for (let c = 0; c < this.currentOrientation[0].length; c++) {
                const block = new Block(
                    c+this.xOffset,
                    r-this.yOffset,
                    30, this.color,
                    this.currentOrientation[r][c]
                    )
                this.pieceMap[r].push(block)

            }
        }
    }

    setSpawnOffset(): void {
        //Sets x/yOffset to spawn piece properly above board.
        this.xOffset = (7-this.currentOrientation[0].length)
        for (let r = 0; r < this.currentOrientation.length; r++) {
            if (this.currentOrientation[r].includes(1)) {
                this.yOffset = r
                break
            }
        }
    }

    checkSpawnValidity(): boolean {
        let validSpawn = true;
        this.currentOrientation.forEach((row, r) => {
            row.forEach((cellState, c) => {
                if (cellState === 1) {
                    let x = c + 3
                    let y = r - this.yOffset
                    validSpawn = (this.board.openSpace(x, y) ? true : false)
                }

            })
        })
        return validSpawn
    }

    spawnPiece() {
        let validSpawn = this.checkSpawnValidity()
        if (validSpawn) {
            this.createPiece()
        } else {
            return false;
        }
    } 

    // Downward movement
    handleGravity() {
        if (this.checkCollision()) {
            this.movePieceDown()
        } else {
            this.lockPiece()
        }
    }

    checkCollision() {
        let movePiece = true;
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell.state === 1) {
                    if (cell.y+1 > this.board.height) {
                        movePiece = false;
                    } else if (
                        this.board.openSpace(cell.x, cell.y+1) && 
                        cell.y < this.board.height && movePiece !== false) {
                            movePiece = true;
                    } else {movePiece = false;}
                }

            })
        })
        return movePiece
    }

    movePieceDown() {
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                cell.y += 1
            })
        })
    }

    lockPiece() {
        this.landed = true;
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell.state === 1) {
                    this.board.boardState[cell.y][cell.x].state = 1
                    this.board.boardState[cell.y][cell.x].color = this.color
                }

            })
        })
    }

    //Lateral and Rotational Movements
    checkRotationalCollision(rotationalDirection: number) {
        let rotatePiece = true;
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                let rotation = this.allOrientations[this.nextRotationState(rotationalDirection)]
                let next_state = rotation[r][c]
                if (next_state === 1) {
                    if (this.board.openSpace(cell.x, cell.y) &&
                        cell.x >= 0 && cell.x <= this.board.width &&
                        rotatePiece != false) {
                            rotatePiece = true;
                    } else {
                        rotatePiece = false;
                    }
                }
            })
        })
        return rotatePiece
    }

    nextRotationState(rotationalDirection: number) {
        // Calculates next index value next rotational will be @.
        let nextState = this.orientation + rotationalDirection
        if (nextState >= this.allOrientations.length) {
            nextState = 0
        } else if (nextState < 0) {
            nextState = this.allOrientations.length-1
        }
        return nextState
    }

    rotatePiece(rotationalDirection: number) {
        this.orientation = this.nextRotationState(rotationalDirection)
        this.currentOrientation = this.allOrientations[this.orientation]

        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                cell.state = this.currentOrientation[r][c]

            })
        })
    }

    checkLateralCollision(direction:number): boolean {
        // console.log('Checking lateral collision')
        let movePiece = true;
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                // console.log(cell.state, direction, this.board.openSpace(cell.x+direction, cell.y), cell.x)
                if (cell.state === 1) {
                    if (movePiece && this.board.openSpace(cell.x+direction, cell.y) && 
                        cell.x >= 0 && cell.x < this.board.width) {
                            movePiece = true;
                        } else {
                            movePiece = false;
                        }

                }
            })
        })
        // console.log(movePiece)
        return movePiece
    }

    movePiece(direction: number) {
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                cell.x = cell.x + direction
            })
        })

    }
    handleMovement(direction: number, rotation=false) {
        if (rotation && this.checkRotationalCollision(direction)) {
            this.rotatePiece(direction)
        } else if (this.checkLateralCollision(direction)) {
            this.movePiece(direction)
        }

    }



    //Drawing Methods
    drawPiece(ctx: any) {
        this.pieceMap.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell.state === 1) {
                    cell.drawBlock(ctx)
                }
            })
        })
    }





}