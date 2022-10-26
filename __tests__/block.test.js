



const Block = require('../src/components/block.ts')

describe("Block", () => {
    const block = new Block.Block(0,0,30,"red", 1);

    test("Block.x", () => {
        expect(block.x).toBe(0);
    })
    test("Block.y", () => {
        expect(block.y).toBe(0);
    })
    test("Block.width", () => {
        expect(block.width).toBe(30);
    })
    test("Block.color", () => {
        expect(block.color).toBe("red");
    })
    test("Block.state", () => {
        expect(block.state).toBe(1);
    })


})