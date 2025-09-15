import React, { useEffect, useRef, useState } from 'react';
import { ANIMATIONS } from '../animations';

const AnimatedBackground = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState('magneticFields');
  const [isPlaying, setIsPlaying] = useState(true);
  const animationStateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize the current animation
    const animationConfig = ANIMATIONS.find(anim => anim.id === currentAnimation);
    const animationFunction = animationConfig ? animationConfig.init(ctx, canvas) : ANIMATIONS[0].init(ctx, canvas);

    // Store animation state for interaction
    animationStateRef.current = animationFunction;

    // Start the animation
    const animate = () => {
      if (isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFunction.animate();
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentAnimation, isPlaying]);

  const handleCanvasClick = (event) => {
    if (!animationStateRef.current || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Call the interaction function if it exists
    if (animationStateRef.current.interact) {
      animationStateRef.current.interact(x, y);
    }
  };

  const switchAnimation = (animationId) => {
    setCurrentAnimation(animationId);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="animated-background" 
        onClick={handleCanvasClick}
      />
      <div className="animation-controls">
        <div className="animation-selector">
          {ANIMATIONS.map(animation => (
            <button
              key={animation.id}
              className={`animation-btn ${currentAnimation === animation.id ? 'active' : ''}`}
              onClick={() => switchAnimation(animation.id)}
            >
              {animation.name}
            </button>
          ))}
        </div>
        <button 
          className="play-pause-btn"
          onClick={togglePlayPause}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
    </>
  );
};

export default AnimatedBackground;