



const Piece = require('../src/components/piece.ts')
const Vitals = require('../src/components/tetronimo.ts')
const Board = require('../src/components/board.ts')

const { vitalsMock } = jest.createMockFromModule("../src/components/tetronimo.ts")
const { boardMock } = jest.createMockFromModule("../src/components/board.ts")

describe("Piece", () => {

    const piece_selected = Vitals.tetronimoPieces[2] // s piece
    const s_piece = new Piece.Piece(piece_selected, boardMock);


    test("Piece.name properly set", () => {
        expect(s_piece.name).toBe(piece_selected.name)
    })

    test("Piece.color properly set", () => {
        expect(s_piece.color).toBe(piece_selected.color)
    })

    test("Piece.allOrientations properly set", () => {
        expect(s_piece.allOrientations).toBe(piece_selected.pieceMap)
    })

    test("Piece.orientation starts initial value of 0", () => {
        expect(s_piece.orientation).toBe(0)
    })

    test("Piece.currentOrientation properly set", () => {
        expect(s_piece.currentOrientation).toBe(s_piece.allOrientations[s_piece.orientation])
    })

    test("Piece.board points to proper boardObject", () => {
        expect(s_piece.board).toBe(boardMock)
    })

    test("Piece.landed properly deaults to false", () => {
        expect(s_piece.landed).toBe(false);
    })

    //Piece Specific Relations. sPiece
    const sPieceWidth = 4 //sPiece Width = s_piece.currentOrientation[0].length
    const sPieceXOffset = s_piece.xOffsetSpawnValue - sPieceWidth
    test("piece.xOffset starts initial value of 0", () => {
        expect(s_piece.xOffset).toBe(sPieceXOffset)
    })

    test("piece.yOffset starts initial value of 0", () => {
        expect(s_piece.yOffset).toBe(1)
    })

    
})