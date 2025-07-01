import React, { useState, useCallback, useEffect } from "react";

/**
 * Figure out how to fit the game on the screen
 */
// Start from somewhere...somewhere that wont crash the browser due to size
// Keep in mind widescreens or large high res phones might mean theres a lot
// more than 80 in 1 direction
let numRows = 80;
let numCols = 80;
// Figure out how that fits the shortest screen dimention
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const cellSize = Math.floor(Math.min(windowHeight, windowWidth) / Math.max(numRows, numCols));
// Then scale up so we fill the screen longer screen direction
numRows = Math.floor(windowHeight / cellSize);
numCols = Math.floor(windowWidth / cellSize);

const tickRate = 350

// Color utilities
const generateRandomColor = () => {
  const colors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FF1493', // Deep Pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const blendColors = (color1, color2) => {
  if (!color1) return color2;
  if (!color2) return color1;
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  // Blend 50/50
  const blendedR = Math.round((rgb1.r + rgb2.r) / 2);
  const blendedG = Math.round((rgb1.g + rgb2.g) / 2);
  const blendedB = Math.round((rgb1.b + rgb2.b) / 2);
  
  return rgbToHex(blendedR, blendedG, blendedB);
};

/**
 * Set up a random board to kick off the game
 */
const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > 0.75 ? "#007FFF" : null))
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
          let neighborColors = [];
          
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) {
                continue;
              }
              const x = rowIndex + i;
              const y = colIndex + j;
              if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
                if (g[x][y]) {
                  neighbors += 1;
                  neighborColors.push(g[x][y]);
                }
              }
            }
          }

          if (cell && (neighbors < 2 || neighbors > 3)) {
            return null; // Cell dies
          } else if (!cell && neighbors === 3) {
            // New cell is born - blend colors from neighbors
            if (neighborColors.length >= 3) {
              // Blend the first 3 neighbor colors
              let blendedColor = neighborColors[0];
              for (let i = 1; i < Math.min(3, neighborColors.length); i++) {
                blendedColor = blendColors(blendedColor, neighborColors[i]);
              }
              return blendedColor;
            }
            return generateRandomColor(); // Fallback
          } else if (cell && neighbors >= 2 && neighbors <= 3) {
            // Cell survives - blend with neighbors
            if (neighborColors.length > 0) {
              let blendedColor = cell;
              for (const neighborColor of neighborColors) {
                blendedColor = blendColors(blendedColor, neighborColor);
              }
              return blendedColor;
            }
            return cell;
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
    }, tickRate);
 
    return () => {
      clearInterval(interval);
    };
  }, [runSimulation]);

  /**
   * Allow visitors to add Cells...because you know...fun...
   */
  const addCells = ((x, y) => {
    const newColor = generateRandomColor();
    const newGrid = grid.map(row => [...row]); // Create deep copy
    
    // Add cells with the new color
    newGrid[y][x] = newColor;
    if(y-1 >= 0) newGrid[y-1][x] = newColor;
    if(y+1 < newGrid.length) newGrid[y+1][x] = newColor;
    if(x-1 >= 0) newGrid[y][x-1] = newColor;
    if(x+1 < newGrid[y].length) newGrid[y][x+1] = newColor;
    
    setGrid(newGrid);
  });

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
                backgroundColor: grid[rowIndex][colIndex] || "#B0E0E6",
                border: "none",
              }}
              onClick={() => addCells(colIndex, rowIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Conways;