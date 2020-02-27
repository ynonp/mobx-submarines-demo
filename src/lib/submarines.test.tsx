import '@testing-library/react';
import { Board, VerticalSubmarine, HorizontalSubmarine } from "./submarines";

test('can hit the sea', () => {
    const b = new Board(10, 10);
    b.bomb([0, 0]);
    expect(b.cellAt([0, 0])?.revealed).toBe(true);
    expect(b.repr()[0]).toBe('0');
});

test('can hit a submarine', () => {
    const b = new Board(10, 10);
    const s = new HorizontalSubmarine(4);
    b.addSubmarine(s, 0, 0);
    b.bomb([0, 0]);
    expect(b.cellAt([0, 0])?.revealed).toBe(true);
    expect(b.repr()[0]).toBe('/');
});

test('can sunk a submarine', () => {
    const b = new Board(10, 10);
    const s = new HorizontalSubmarine(4);
    b.addSubmarine(s, 0, 0);
    b.bomb([0, 0]);
    b.bomb([0, 1]);
    b.bomb([0, 2]);
    b.bomb([0, 3]);
    expect(b.cellAt([0, 0])?.revealed).toBe(true);
    expect((b.cellAt([0, 0])?.item as HorizontalSubmarine).sank).toBe(true);
    expect(b.repr()[0]).toBe('X');
    expect(b.repr()[1]).toBe('X');
});
