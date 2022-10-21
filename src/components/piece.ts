import type { Board } from "./board";
import type { PieceObject } from "./types";



export class Block {
    x: number;
    y: number;
    width: number;
    color: string;
    state: number;

    constructor(x: number, y: number, width: number, color: string, state: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color;
        this.state = state;
    }


    public drawBlock(ctx:CanvasRenderingContext2D) {
        ctx.fillStyle = (this.state === 1? this.color : 'black');
        ctx.fillRect(this.x*this.width, this.y*this.width, this.width-1, this.width-1);
    }
}



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
        this.name = vitals.name
        this.color = vitals.color
        this.allOrientations = vitals.pieceMap
        this.currentOrientation = this.allOrientations[this.orientation]
        this.board = boardObject
        this.setSpawnOffset()
        this.validSpawn = true;
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
                if (cellState === 1 && validSpawn) {
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
            this.validSpawn = false;
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
        this.pieceMap.forEach((row) => {
            row.forEach((cell) => {
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
        let movePiece = true;
        this.pieceMap.forEach((row) => {
            row.forEach((cell) => {
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
        return movePiece
    }

    movePiece(direction: number) {
        this.pieceMap.forEach((row) => {
            row.forEach((cell) => {
                cell.x = cell.x + direction
            })
        })

    }
    handleMovement(direction: number, rotation=false) {
        if (rotation) {
            if (this.checkRotationalCollision(direction)) {
                this.rotatePiece(direction)
            }
        } else {
            if (this.checkLateralCollision(direction)) {
                this.movePiece(direction)
            }
        }
    }



    //Drawing Methods
    drawPiece(ctx: CanvasRenderingContext2D) {
        this.pieceMap.forEach((row) => {
            row.forEach((cell) => {
                if (cell.state === 1) {
                    cell.drawBlock(ctx)
                }
            })
        })
    }

    drawNextBox(ctx: CanvasRenderingContext2D, width: number, height: number) {
        let yOffset = height/3
        let pieceSize = this.currentOrientation[0].length
        let xOffset = (pieceSize === 3 ? 30 : 15)
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.fillText("NEXT", 10, 30);

        this.currentOrientation.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell === 1) {
                    ctx.fillStyle = this.color
                    ctx.fillRect(c*30 + xOffset, r*30 + yOffset, 29,29)
                }
            })
        })
    }

    drawStatBox(ctx: CanvasRenderingContext2D, width:number, height: number, verticalOffset: number) {
        
        let scale = 20
        let pieceSize = this.currentOrientation[0].length
        let xOffset = (width - pieceSize*scale) / 2 - 20
        let yOffset = 60 + (verticalOffset * scale * 2.5)
        if (this.name === "I") {yOffset -= 15}
        if (this.name === "O") {yOffset -= 5}

        this.currentOrientation.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell === 1) {
                    ctx.fillStyle = this.color
                    ctx.fillRect(
                        c*scale + xOffset,
                        r*scale + yOffset,
                        scale-1,
                        scale-1)
                }
            })
        })
    }





}