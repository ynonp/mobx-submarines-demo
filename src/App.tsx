import React from 'react';
import { observer } from "mobx-react"
import board, { BoardSquare } from "./lib/submarines";
import _ from "lodash";

import './App.css';

const Square = observer(function Square({ item }: { item?: BoardSquare }) {
    if (!item) {
        throw new Error("Item cannot be null");
    }

    function handleClick() {
        item?.bomb();
    }

    // return <span onClick={handleClick}>{item.repr}</span>;
    return (
        <td onClick={handleClick}>
            {item.repr}
        </td>
    );
});

const SubmarineGame = observer(function SubmarineGame() {
    return (
        <div>
            <table>
                <tbody>
                {_.range(board.rowCount).map(rowIndex => (
                    <tr key={rowIndex}>
                        {_.range(board.columnCount).map(colIndex => (
                          <Square key={colIndex} item={board.cellAt([rowIndex, colIndex])} />
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
});

function App() {
  return (
    <div className="App">
        <SubmarineGame />
    </div>
  );
}

(window as any).board = board;

export default App;
