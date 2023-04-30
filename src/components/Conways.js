import React, { useState, useCallback, useEffect } from "react";

/**
 * Figure out how to fit the game on the screen
 */
// Start from somewhere...somewhere that wont crash the browser due to size
let numRows = 80;
let numCols = 80;
// Figure out how that fits the shortest screen dimention
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const cellSize = Math.floor(Math.min(windowHeight, windowWidth) / Math.max(numRows, numCols));
// Then scale up so we fill the screen longer screen direction
numRows = Math.floor(windowHeight / cellSize);
numCols = Math.floor(windowWidth / cellSize);

/**
 * Set up a random board to kick off the game
 */
const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
    );
  }
  return rows;
};

const Conways = () => {
  const [grid, setGrid] = useState(() => generateRandomGrid());

  
  /**
   * Each tick of the game, discover if a cell has neighbours
   * and allow it to propagate if the rules allow
   */
  const runSimulation = useCallback(() => {
    setGrid((g) => {
      return g.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          let neighbors = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) {
                continue;
              }
              const x = rowIndex + i;
              const y = colIndex + j;
              if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
                neighbors += g[x][y];
              }
            }
          }

          if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
            return 0;
          } else if (cell === 0 && neighbors === 3) {
            return 1;
          } else {
            return cell;
          }
        });
      });
    });

  }, []);

  /**
   * Tick the game ever so offten
   */
  useEffect(() => {

    const interval = setInterval(() => {
      runSimulation();
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [runSimulation]);

  return (
    <div className="conways">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[rowIndex][colIndex] ? "#007FFF" : "#B0E0E6",
                border: "none",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Conways;