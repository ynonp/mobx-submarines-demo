import {action, computed, observable} from "mobx"
import _ from "lodash";

type Point = [number, number];

export class BoardSquare {
    @observable item: Submarine|Sea;
    @observable id: number;
    @observable revealed: boolean = false;

    constructor(item: Sea|Submarine, id: number) {
        this.item = item;
        this.id = id;
    }

    bomb() {
        this.item.hit(this.id);
        this.revealed = true;
    }

    @computed get repr() {
        if (this.revealed) {
            return this.item.repr();
        } else {
            return " ";
        }
    }
}

export class Board {
    @observable data: Map<string, BoardSquare> = new Map();
    rowCount: number;
    columnCount: number;

    constructor(rowCount: number, columnCount: number) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;

        for (let i=0; i < rowCount; i++) {
            for (let j=0; j < columnCount; j++) {
                this.data.set(`${i},${j}`, new BoardSquare(new Sea(), 0));
            }
        }
    }

    addSubmarine(submarine: Submarine, row: number, column: number) {
        const coords = submarine.getCoordinates(row, column);
        for (let i=0; i < coords.length; i++) {
            const square = this.cellAt(coords[i]);
            if (square == null) {
                throw new Error(`Invalid Coordinates: ${row}, ${column}`)
            }

            square.item  = submarine;
            square.id    = i;
        }
    }

    bomb(pos: Point) {
        const square = this.cellAt(pos);
        if (square == null) return;

        square.bomb();
    }

    cellAt(pos: Point) {
        const [row, col] = pos;
        return this.data.get(`${row},${col}`);
    }

    repr() {
        let res = "";
        for (let i=0; i < this.rowCount; i++) {
            for (let j=0; j < this.columnCount; j++) {
                let square = this.data.get(`${i},${j}`);
                if (square == null) {
                    throw new Error("Invalid Board");
                }
                res += square.repr;
            }
            res += "\n";
        }
        return res;
    }
}

class Sea {
    hit(id: number) {}

    repr() {
        return "0";
    }
}

abstract class Submarine extends Sea {
    size: number;
    @observable bombed: Set<number> = new Set();
    @observable sank: boolean = false;

    abstract getCoordinates(row: number, column: number): Point [];

    constructor(size: number) {
        super();
        this.size = size;
    }

    hit(id: number) {
        super.hit(id);
        this.bombed.add(id);
        if (this.bombed.size === this.size) {
            this.sank = true;
        }
    }

    repr() {
        if (this.sank) {
            return "X";
        } else {
            return "/";
        }
    }
}

export class VerticalSubmarine extends Submarine {
    getCoordinates(row: number, column: number) {
        return _.range(this.size).map((i): Point => ([row + i, column]));
    }
}

export class HorizontalSubmarine extends Submarine {
    getCoordinates(row: number, column: number) {
        return _.range(this.size).map((i): Point => ([row, column + i]));
    }
}

const b = new Board(10, 10);
b.addSubmarine(new HorizontalSubmarine(5), 0, 0);
b.addSubmarine(new VerticalSubmarine(3), 2, 5);
b.addSubmarine(new HorizontalSubmarine(2), 6, 0);
export default b;
