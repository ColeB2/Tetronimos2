



const Piece = require('../src/components/piece.ts')
const Vitals = require('../src/components/tetronimo.ts')
const Board = require('../src/components/board.ts')

const { vitalsMock } = jest.createMockFromModule("../src/components/tetronimo.ts")
const { boardMock } = jest.createMockFromModule("../src/components/board.ts")

describe("Piece", () => {

    const piece_selected = Vitals.tetronimoPieces[0] // O piece
    const piece = new Piece.Piece(piece_selected, boardMock);


    test("Piece.name properly set", () => {
        expect(piece.name).toBe(piece_selected.name)
    })

    test("Piece.color properly set", () => {
        expect(piece.color).toBe(piece_selected.color)
    })

    test("Piece.allOrientations properly set", () => {
        expect(piece.allOrientations).toBe(piece_selected.pieceMap)
    })

    test("Piece.orientation starts initial value of 0", () => {
        expect(piece.orientation).toBe(0)
    })

    test("Piece.currentOrientation properly set", () => {
        expect(piece.currentOrientation).toBe(
            piece.allOrientations[piece.orientation]
            )
    })

    test("Piece.board points to proper boardObject", () => {
        expect(piece.board).toBe(boardMock)
    })

    test("Piece.landed properly deaults to false", () => {
        expect(piece.landed).toBe(false);
    })

    test ("Piece.valid spawn deaults to true", () => {
        expect(piece.validSpawn).toBe(true);
    })

    
})

describe("O Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[0] // O piece
    const OPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. sPiece
    const OPieceWidth = 4 //sPiece Width = s_piece.currentOrientation[0].length
    const OPieceXOffset = OPiece.xOffsetSpawnValue - OPieceWidth
    test("OPiece.xOffset set to correct x value", () => {
        expect(OPiece.xOffset).toBe(OPieceXOffset)
    })

    test("Opiece.yOffset set to correct y value", () => {
        expect(OPiece.yOffset).toBe(1)
    })

})

describe("I Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[1] // I piece
    const IPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. IPiece
    const IPieceWidth = 4 //IPiece Width = IPiece.currentOrientation[0].length
    const IPieceXOffset = IPiece.xOffsetSpawnValue - IPieceWidth
    test("IPiece.xOffset set to correct x value", () => {
        expect(IPiece.xOffset).toBe(IPieceXOffset)
    })

    //IPiece --> 4 high, spawns horizontally, with pieces on 2 (0Indexed)
    test("IPiece.yOffset set to correct y value", () => {
        expect(IPiece.yOffset).toBe(2)
    })

})


describe("S Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[2] // S piece
    const SPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. SPiece
    const SPieceWidth = 3 //SPiece Width = SPiece.currentOrientation[0].length
    const SPieceXOffset = SPiece.xOffsetSpawnValue - SPieceWidth
    test("SPiece.xOffset set to correct x value", () => {
        expect(SPiece.xOffset).toBe(SPieceXOffset)
    })

    //Piece spawns 3 high, starting on 1 (0 indexed)
    test("SPiece.yOffset set to correct y value", () => {
        expect(SPiece.yOffset).toBe(1)
    })

})

describe("Z Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[3] // Z piece
    const ZPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. ZPiece
    const ZPieceWidth = 3 //ZPiece Width = ZPiece.currentOrientation[0].length
    const ZPieceXOffset = ZPiece.xOffsetSpawnValue - ZPieceWidth
    test("ZPiece.xOffset set to correct x value", () => {
        expect(ZPiece.xOffset).toBe(ZPieceXOffset)
    })

    //Piece spawns 3 high, starting on 1 (0 indexed)
    test("ZPiece.yOffset set to correct y value", () => {
        expect(ZPiece.yOffset).toBe(1)
    })

})

describe("J Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[4] // J piece
    const JPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. JPiece
    const JPieceWidth = 3 //JPiece Width = JPiece.currentOrientation[0].length
    const JPieceXOffset = JPiece.xOffsetSpawnValue - JPieceWidth
    test("JPiece.xOffset set to correct x value", () => {
        expect(JPiece.xOffset).toBe(JPieceXOffset)
    })

    //JPiece --> 3 high, spawns horizontally, with pieces on 1 (0Indexed)
    test("JPiece.yOffset set to correct y value", () => {
        expect(JPiece.yOffset).toBe(1)
    })

})

describe("L Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[5] // L piece
    const LPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. LPiece
    const LPieceWidth = 3 //LPiece Width = LPiece.currentOrientation[0].length
    const LPieceXOffset = LPiece.xOffsetSpawnValue - LPieceWidth
    test("LPiece.xOffset set to correct x value", () => {
        expect(LPiece.xOffset).toBe(LPieceXOffset)
    })

    //LPiece --> 3 high, spawns horizontally, with pieces on 1 (0Indexed)
    test("LPiece.yOffset set to correct y value", () => {
        expect(LPiece.yOffset).toBe(1)
    })

})

describe("T Piece", () => {
    const pieceSelected = Vitals.tetronimoPieces[6] // T piece
    const TPiece = new Piece.Piece(pieceSelected, boardMock);

    //Piece Specific Tests. TPiece
    const TPieceWidth = 3 //TPiece Width = TPiece.currentOrientation[0].length
    const TPieceXOffset = TPiece.xOffsetSpawnValue - TPieceWidth
    test("TPiece.xOffset set to correct x value", () => {
        expect(TPiece.xOffset).toBe(TPieceXOffset)
    })

    //TPiece --> 3 high, spawns horizontally, with pieces on 1 (0Indexed)
    test("TPiece.yOffset set to correct y value", () => {
        expect(TPiece.yOffset).toBe(1)
    })

})