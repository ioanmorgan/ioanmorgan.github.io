// Conway's Game of Life Animation (interactive version)
export const initConwaysGameOfLife = (ctx, canvas) => {
  const cellSize = 8;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);
  let grid = [];
  let nextGrid = [];
  let ageGrid = []; // Track age of cells for color variation
  let userAddedGrid = []; // Track which cells were added by user interaction
  let colorGrid = []; // Track color of each cell
  let gliderId = 0; // Track glider instances for color sharing
  let frameCount = 0; // Frame counter for animation speed control
  const frameDelay = 5; // Update every 10 frames (slower animation)

  // Color palette for gliders
  const gliderColors = [
    { h: 0, s: 70, l: 50 },    // Red
    { h: 30, s: 70, l: 50 },   // Orange
    { h: 60, s: 70, l: 50 },   // Yellow
    { h: 120, s: 70, l: 50 },  // Green
    { h: 180, s: 70, l: 50 },  // Cyan
    { h: 240, s: 70, l: 50 },  // Blue
    { h: 270, s: 70, l: 50 },  // Purple
    { h: 300, s: 70, l: 50 },  // Magenta
  ];

  // Initialize grid
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    ageGrid[i] = [];
    userAddedGrid[i] = [];
    colorGrid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = Math.random() > 0.8 ? 1 : 0;
      nextGrid[i][j] = 0;
      ageGrid[i][j] = grid[i][j] ? 1 : 0;
      userAddedGrid[i][j] = false; // Initial cells are not user-added
      colorGrid[i][j] = null; // No color for initial cells
    }
  }

  const getNeighbors = (x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nx = (x + i + rows) % rows;
        const ny = (y + j + cols) % cols;
        count += grid[nx][ny];
      }
    }
    return count;
  };

  const checkIfUserAddedParent = (x, y) => {
    // Check if any of the 3 parent cells that would create this new cell were user-added
    let userAddedCount = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nx = (x + i + rows) % rows;
        const ny = (y + j + cols) % cols;
        if (grid[nx][ny] === 1 && userAddedGrid[nx][ny]) {
          userAddedCount++;
        }
      }
    }
    // If 3 user-added cells are neighbors, the new cell is considered user-added
    return userAddedCount >= 3;
  };

  const getDominantColor = (x, y) => {
    // Find the most common color among the 3 parent cells
    const colorCounts = {};
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nx = (x + i + rows) % rows;
        const ny = (y + j + cols) % cols;
        if (grid[nx][ny] === 1 && colorGrid[nx][ny]) {
          const colorKey = `${colorGrid[nx][ny].h}-${colorGrid[nx][ny].s}-${colorGrid[nx][ny].l}`;
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
      }
    }
    
    // Return the most common color, or null if no colored parents
    let maxCount = 0;
    let dominantColor = null;
    for (const [colorKey, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        const [h, s, l] = colorKey.split('-').map(Number);
        dominantColor = { h, s, l };
      }
    }
    return dominantColor;
  };

  const animate = () => {
    frameCount++;
    
    // Only update grid logic every frameDelay frames
    if (frameCount % frameDelay === 0) {
      // Update grid and age tracking
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const neighbors = getNeighbors(i, j);
          if (grid[i][j] === 1) {
            nextGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            // Age cells that survive
            ageGrid[i][j] = nextGrid[i][j] ? ageGrid[i][j] + 1 : 0;
          } else {
            nextGrid[i][j] = neighbors === 3 ? 1 : 0;
            // New cells start with age 1
            ageGrid[i][j] = nextGrid[i][j] ? 1 : 0;
            // Check if new cell should be marked as user-added (if any parent was user-added)
            if (nextGrid[i][j] === 1) {
              userAddedGrid[i][j] = checkIfUserAddedParent(i, j);
              // Inherit color from dominant parent
              colorGrid[i][j] = getDominantColor(i, j);
            }
          }
        }
      }
      
      // Swap grids only when we update
      [grid, nextGrid] = [nextGrid, grid];
    }

    // Draw with soft rendering and color system
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === 1) {
          const x = j * cellSize;
          const y = i * cellSize;
          const age = ageGrid[i][j];
          const isUserAdded = userAddedGrid[i][j];
          const cellColor = colorGrid[i][j];
          
          if (isUserAdded && cellColor) {
            // User-added cells with color get age-based variations
            const alpha = Math.min(0.9, 0.4 + age * 0.05);
            ctx.fillStyle = `hsla(${cellColor.h}, ${cellColor.s}%, ${cellColor.l}%, ${alpha})`;
          } else if (isUserAdded) {
            // User-added cells without color (fallback)
            const hue = (180 + age * 10) % 360;
            const saturation = Math.min(80, 40 + age * 2);
            const lightness = Math.min(70, 30 + age * 1.5);
            const alpha = Math.min(0.8, 0.3 + age * 0.05);
            ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          } else {
            // Original cells keep the original color scheme
            ctx.fillStyle = `hsla(180, 60%, 50%, 0.6)`;
          }
          
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize, cellSize, 2);
      ctx.fill();
        }
      }
    }
  };

  const interact = (x, y) => {
    // Convert click coordinates to grid coordinates
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    // Debug: log the coordinates
    console.log(`Click at pixel (${x}, ${y}) -> Grid (${gridX}, ${gridY})`);
    
    // Diamond glider pattern (5x5)
    const diamondGlider = [
      [0,0,1,0,0],
      [0,1,1,1,0],
      [1,1,0,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0]
    ];
    
    // Select a random color from the palette
    const selectedColor = gliderColors[Math.floor(Math.random() * gliderColors.length)];
    gliderId++;
    
    // Place the diamond glider at the exact click location
    // For a 5x5 pattern, we need to offset by 2 to center it on the click point
    const offset = 2;
    for (let i = 0; i < diamondGlider.length; i++) {
      for (let j = 0; j < diamondGlider[i].length; j++) {
        if (diamondGlider[i][j] === 1) {
          const nx = (gridX + i - offset + rows) % rows;
          const ny = (gridY + j - offset + cols) % cols;
          grid[nx][ny] = 1;
          ageGrid[nx][ny] = 1; // New cells start with age 1
          userAddedGrid[nx][ny] = true; // Mark as user-added
          colorGrid[nx][ny] = { ...selectedColor }; // Assign the selected color
        }
      }
    }
  };

  return { animate, interact };
};
