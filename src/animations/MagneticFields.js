// Magnetic Fields Animation
export const initMagneticFields = (ctx, canvas) => {
  const particles = [];
  const attractors = [];
  const numParticles = 120;
  const numAttractors = 12;

  // Create particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      trail: [],
      hue: Math.random() * 60 + 180, // Blue to cyan range
      size: Math.random() * 3 + 1
    });
  }

  // Create attractors
  for (let i = 0; i < numAttractors; i++) {
    attractors.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      strength: (Math.random() - 0.5) * 0.05,
      radius: Math.random() * 150 + 80,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  const animate = () => {
    // Move attractors
    attractors.forEach(attractor => {
      attractor.x += attractor.vx;
      attractor.y += attractor.vy;
      
      // Bounce off edges
      if (attractor.x < 0 || attractor.x > canvas.width) attractor.vx *= -1;
      if (attractor.y < 0 || attractor.y > canvas.height) attractor.vy *= -1;
      
      // Keep in bounds
      attractor.x = Math.max(0, Math.min(canvas.width, attractor.x));
      attractor.y = Math.max(0, Math.min(canvas.height, attractor.y));
    });

    particles.forEach(particle => {
      // Store current position for trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 25) {
        particle.trail.shift();
      }

      // Apply attractor forces
      attractors.forEach(attractor => {
        const dx = attractor.x - particle.x;
        const dy = attractor.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < attractor.radius) {
          const force = attractor.strength / (distance + 1);
          particle.vx += dx * force;
          particle.vy += dy * force;
        }
      });

      // Add some turbulence
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Apply less damping for more movement
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });

    // Draw particles with trails
    particles.forEach(particle => {
      // Draw trail
      particle.trail.forEach((point, index) => {
        const alpha = (index / particle.trail.length) * 0.4;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 70%)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particle
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = `hsl(${particle.hue}, 80%, 70%)`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  };

  const interact = (x, y) => {
    // Add new particles at click location
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        trail: [],
        hue: Math.random() * 60 + 180,
        size: Math.random() * 3 + 1
      });
    }
  };

  return { animate, interact };
};
