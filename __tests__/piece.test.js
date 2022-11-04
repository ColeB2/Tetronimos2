



const Piece = require('../src/components/piece.ts')
const Vitals = require('../src/components/tetronimo.ts')
const Board = require('../src/components/board.ts')

const { vitalsMock } = jest.createMockFromModule("../src/components/tetronimo.ts")
const { boardMock } = jest.createMockFromModule("../src/components/board.ts")

describe("Piece", () => {
    // const board = new Board.Board(10,10,"black", [])
    // const board = new boardMock.Board(10,10,"black", [])
    // const mockVitals = jest.mock("../src/components/tetronimo.ts")
    const piece = new Piece.Piece(Vitals.tetronimoPieces[0], boardMock);
    // console.log("boardMock", boardMock)
    // console.log(Vitals.tetronimoPieces)
    // console.log(vitalsMock)
    // console.log(mockVitals)
    // console.log(piece)

    // test("Create Piece", () => {
    //     expect(  
    // })
    test("Piece.orientation", () => {
        expect(piece.orientation).toBe(0)
    })

    test("Piece.landed", () => {
        expect(piece.landed).toBe(false);
    })

    
})