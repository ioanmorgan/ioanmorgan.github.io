# Animations Module

This directory contains all the individual animation implementations for the personal website's animated background.

## Structure

```
src/animations/
├── index.js                 # Main exports and animation metadata
├── MagneticFields.js        # Magnetic field particle system
├── FlockingBoids.js         # Swift-like flocking behavior
├── ConwaysGameOfLife.js     # Conway's Game of Life implementation
└── README.md               # This file
```

## Adding New Animations

To add a new animation:

1. **Create the animation file** (e.g., `MyNewAnimation.js`):
```javascript
export const initMyNewAnimation = (ctx, canvas) => {
  // Animation setup code here
  
  const animate = () => {
    // Animation loop code here
  };

  const interact = (x, y) => {
    // Click interaction code here
  };

  return { animate, interact };
};
```

2. **Export it in `index.js`**:
```javascript
export { initMyNewAnimation } from './MyNewAnimation.js';

export const ANIMATIONS = [
  // ... existing animations
  { id: 'myNewAnimation', name: 'My New Animation', init: initMyNewAnimation }
];
```

3. **The animation will automatically appear in the control panel!**

## Animation Interface

Each animation must export a function that:
- Takes `(ctx, canvas)` as parameters
- Returns an object with `{ animate, interact }`

### Required Methods

- **`animate()`**: Called every frame to update and draw the animation
- **`interact(x, y)`**: Called when user clicks on the canvas at coordinates (x, y)

### Canvas Context

The `ctx` parameter is a 2D canvas context with all standard Canvas API methods available.

### Canvas Element

The `canvas` parameter provides access to:
- `canvas.width` - Current canvas width
- `canvas.height` - Current canvas height

## Best Practices

1. **Performance**: Use `requestAnimationFrame` for smooth 60fps animations
2. **Memory**: Clean up resources when animations are switched
3. **Responsive**: Handle canvas resize events gracefully
4. **Interactive**: Make animations respond to user clicks
5. **Consistent**: Use similar color schemes and visual styles

## Example Animation

```javascript
export const initExampleAnimation = (ctx, canvas) => {
  const particles = [];
  
  // Initialize particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    });
  }

  const animate = () => {
    // Update particles
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });

    // Draw particles
    particles.forEach(particle => {
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const interact = (x, y) => {
    // Add new particle at click location
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    });
  };

  return { animate, interact };
};
```
