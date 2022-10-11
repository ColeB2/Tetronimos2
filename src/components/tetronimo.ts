

const oPieceMap = [
[
[0,0,0,0],
[0,1,1,0],
[0,1,1,0],
[0,0,0,0]
],
[
[0,0,0,0],
[0,1,1,0],
[0,1,1,0],
[0,0,0,0]
],
[
[0,0,0,0],
[0,1,1,0],
[0,1,1,0],
[0,0,0,0]
],
[
[0,0,0,0],
[0,1,1,0],
[0,1,1,0],
[0,0,0,0]
]
]

const iPieceMap = [
[
[0,0,0,0],
[0,0,0,0],
[1,1,1,1],
[0,0,0,0]
],
[
[0,0,1,0],
[0,0,1,0],
[0,0,1,0],
[0,0,1,0]
],
[
[0,0,0,0],
[0,0,0,0],
[1,1,1,1],
[0,0,0,0]
],
[
[0,0,1,0],
[0,0,1,0],
[0,0,1,0],
[0,0,1,0]
]
]

const sPieceMap = [
[
[0,0,0],
[0,1,1],
[1,1,0]
],
[
[0,1,0],
[0,1,1],
[0,0,1]
],
[
[0,0,0],
[0,1,1],
[1,1,0]
],
[
[0,1,0],
[0,1,1],
[0,0,1]
]
]

const zPieceMap = [
[
[0,0,0],
[1,1,0],
[0,1,1]
],
[
[0,0,1],
[0,1,1],
[0,1,0]
],
[
[0,0,0],
[1,1,0],
[0,1,1]
],
[
[0,0,1],
[0,1,1],
[0,1,0]
]
]


const jPieceMap = [
[
[0,0,0],
[1,1,1],
[0,0,1]
],
[
[0,1,0],
[0,1,0],
[1,1,0]
],
[
[1,0,0],
[1,1,1],
[0,0,0]
],
[
[0,1,1],
[0,1,0],
[0,1,0]
]
]



const lPieceMap = [
[
[0,0,0],
[1,1,1],
[1,0,0]
],
[
[1,1,0],
[0,1,0],
[0,1,0]
],
[
[0,0,1],
[1,1,1],
[0,0,0]
],
[
[0,1,0],
[0,1,0],
[0,1,1]
]
]



const tPieceMap = [
[
[0,0,0],
[1,1,1],
[0,1,0]
],
[
[0,1,0],
[1,1,0],
[0,1,0]
],
[
[0,1,0],
[1,1,1],
[0,0,0]
],
[
[0,1,0],
[0,1,1],
[0,1,0]
]
]

//Single block testing piece
const blockPieceMap = [
[
[0,0,0],
[0,1,0],
[0,0,0]
],
[
[0,0,0],
[0,1,0],
[0,0,0]
],
[
[0,0,0],
[0,1,0],
[0,0,0]
],
[
[0,0,0],
[0,1,0],
[0,0,0]
]
]

const oPiece = {
    name : "O",
    pieceMap : oPieceMap,
    color:     "#F8E608",
}
const iPiece = {
    name : "I",
    pieceMap : iPieceMap,
    color:     "#01F1F2",
}
const sPiece = {
    name : "S",
    pieceMap : sPieceMap,
    color:     "#02F102",
}
const zPiece = {
    name : "Z",
    pieceMap : zPieceMap,
    color:     "#F00001",
}
const jPiece = {
    name : "J",
    pieceMap : jPieceMap,
    color:     "#0100F1",
}
const lPiece = {
    name : "L",
    pieceMap : lPieceMap,
    color:     "#EF8201",
}
const tPiece = {
    name : "T",
    pieceMap : tPieceMap,
    color:     "#A001F1",
}


export const tetronimoPieces = [
    oPiece,
    iPiece,
    sPiece,
    zPiece,
    jPiece,
    lPiece,
    tPiece
] 
