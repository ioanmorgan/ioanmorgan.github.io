# Interactive Animated Background System

This personal website features a dynamic animated background with three distinct interactive animations that can be switched between using the control panel.

## Available Animations

### 1. Magnetic Fields
- **Description**: Dynamic particles with moving attractor points creating energetic swirls and patterns
- **Visual**: Particles leave longer trails with varying sizes and more vibrant colors
- **Behavior**: Moving attractors create constantly changing magnetic fields with added turbulence
- **Colors**: Blue to cyan range (hue: 180-240) with higher saturation
- **Interaction**: Click to add new particles at the click location

### 2. Flocking Boids (Swift-like)
- **Description**: Bird-like shapes that flock together like swifts flying in formation
- **Behavior**: Advanced flocking with separation, alignment, and cohesion for natural group movement
- **Visual**: Swift-shaped boids with wings that orient based on flight direction
- **Speed**: Graceful and coordinated, mimicking real bird flocking behavior
- **Colors**: Blue to purple range (hue: 200-240)
- **Interaction**: Click to add new swifts that will join the flock

### 3. Conway's Game of Life
- **Description**: Classic Game of Life implementation with soft rendering
- **Rendering**: Cells are rendered softly with rounded corners for a gentle appearance
- **Palette**: Gentle, not high contrast
- **Colors**: Soft teal tones
- **Interaction**: Click to add a 3x3 pattern of living cells (like the original)

## Technical Implementation

### Architecture
- Each animation is encapsulated in its own function with both animate() and interact() methods
- Animation switching happens via control panel without page refresh
- All animations use vanilla JavaScript (no external libraries)
- Canvas-based rendering for optimal performance
- Interactive click handling for all animations

### File Structure
```
src/components/
├── AnimatedBackground.js  # Main component with all animations and controls
└── PersonalStatement.js   # Professional statement overlay
```

### Control Panel
- **Animation Selector**: Buttons to switch between the three animations
- **Play/Pause Button**: Toggle animation on/off
- **Responsive Design**: Adapts to mobile screens
- **Position**: Top-right on desktop, bottom-right on mobile

### Adding New Animations

To add a new animation:

1. Create a new initialization function in `AnimatedBackground.js`:
```javascript
const initYourAnimation = (ctx, canvas) => {
  // Setup code here
  
  return () => {
    // Animation loop code here
  };
};
```

2. Add your animation to the animations array:
```javascript
const animations = ['magneticFields', 'flockingBoids', 'softCellularAutomata', 'conwaysGameOfLife', 'yourAnimation'];
```

3. Add a case in the switch statement:
```javascript
case 'yourAnimation':
  animationFunction = initYourAnimation(ctx, canvas);
  break;
```

### Performance Considerations
- All animations are optimized for 60fps
- Canvas is resized on window resize
- Animations use requestAnimationFrame for smooth rendering
- Memory is managed properly with cleanup functions

### Styling
- Background opacity is set to 0.4 for subtle effect
- Personal statement has backdrop blur for readability
- Responsive design works on all screen sizes
- Professional color scheme with LinkedIn blue accent
