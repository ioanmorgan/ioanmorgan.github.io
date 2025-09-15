// Flocking Boids Animation (Swift-like)
export const initFlockingBoids = (ctx, canvas) => {
  const boids = [];
  const numBoids = 50;

  for (let i = 0; i < numBoids; i++) {
    boids.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6 + 0.2, // Slight bias towards positive x (rightward)
      vy: (Math.random() - 0.5) * 0.4, // Reduced vertical movement
      hue: Math.random() * 40 + 200, // Blue to purple range
      size: Math.random() * 2 + 2,
      maxSpeed: 1.2,
      maxForce: 0.05
    });
  }

  const flockingRules = (boid, boids) => {
    const separation = { x: 0, y: 0 };
    const alignment = { x: 0, y: 0 };
    const cohesion = { x: 0, y: 0 };
    const edgeAvoidance = { x: 0, y: 0 };
    let separationCount = 0;
    let alignmentCount = 0;
    let cohesionCount = 0;

    boids.forEach(other => {
      if (other === boid) return;
      
      const dx = boid.x - other.x;
      const dy = boid.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Separation: avoid crowding neighbors (increased distance)
      if (distance < 40 && distance > 0) {
        separation.x += dx / distance;
        separation.y += dy / distance;
        separationCount++;
      }

      // Alignment: steer towards average heading of neighbors (reduced distance)
      if (distance < 50 && distance > 0) {
        alignment.x += other.vx;
        alignment.y += other.vy;
        alignmentCount++;
      }

      // Cohesion: steer towards average position of neighbors (reduced distance)
      if (distance < 60 && distance > 0) {
        cohesion.x += other.x;
        cohesion.y += other.y;
        cohesionCount++;
      }
    });

    // Apply separation force (increased for better spacing)
    if (separationCount > 0) {
      separation.x /= separationCount;
      separation.y /= separationCount;
      separation.x *= 0.5;
      separation.y *= 0.5;
    }

    // Apply alignment force (reduced for gentler movement)
    if (alignmentCount > 0) {
      alignment.x /= alignmentCount;
      alignment.y /= alignmentCount;
      alignment.x *= 0.1;
      alignment.y *= 0.1;
    }

    // Apply cohesion force (reduced for gentler movement)
    if (cohesionCount > 0) {
      cohesion.x /= cohesionCount;
      cohesion.y /= cohesionCount;
      cohesion.x = (cohesion.x - boid.x) * 0.05;
      cohesion.y = (cohesion.y - boid.y) * 0.05;
    }

    // Edge avoidance - encourage movement away from edges
    const edgeMargin = 100;
    const edgeForce = 0.3;
    
    if (boid.x < edgeMargin) {
      edgeAvoidance.x += edgeForce * (edgeMargin - boid.x) / edgeMargin;
    } else if (boid.x > canvas.width - edgeMargin) {
      edgeAvoidance.x -= edgeForce * (boid.x - (canvas.width - edgeMargin)) / edgeMargin;
    }
    
    if (boid.y < edgeMargin) {
      edgeAvoidance.y += edgeForce * (edgeMargin - boid.y) / edgeMargin;
    } else if (boid.y > canvas.height - edgeMargin) {
      edgeAvoidance.y -= edgeForce * (boid.y - (canvas.height - edgeMargin)) / edgeMargin;
    }

    // Dynamic horizontal bias - only apply when not already moving in desired direction
    const rightEdgeThreshold = canvas.width - 200;
    const leftEdgeThreshold = 200;
    const stuckThreshold = canvas.width - 50;
    
    let horizontalBias = { x: 0, y: 0 }; // No default bias
    
    // Only apply bias if bird is not already moving in the right direction
    if (boid.x < leftEdgeThreshold && boid.vx < 0.5) {
      // Encourage rightward movement when near left edge and not already moving right
      horizontalBias.x = 0.2;
    } else if (boid.x > rightEdgeThreshold && boid.vx > -0.5) {
      // Encourage leftward movement when near right edge and not already moving left
      horizontalBias.x = -0.2;
    } else if (boid.x > stuckThreshold) {
      // Strong force to get unstuck if too close to right edge
      horizontalBias.x = -0.3;
    }

    // Add some gentle turbulence for natural movement (reduced)
    const turbulence = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02
    };

    // Apply all forces
    boid.vx += separation.x + alignment.x + cohesion.x + edgeAvoidance.x + horizontalBias.x + turbulence.x;
    boid.vy += separation.y + alignment.y + cohesion.y + edgeAvoidance.y + horizontalBias.y + turbulence.y;

    // Limit speed
    const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    if (speed > boid.maxSpeed) {
      boid.vx = (boid.vx / speed) * boid.maxSpeed;
      boid.vy = (boid.vy / speed) * boid.maxSpeed;
    }
  };

  const animate = () => {
    boids.forEach(boid => {
      flockingRules(boid, boids);
      
      boid.x += boid.vx;
      boid.y += boid.vy;

      // Keep within screen bounds (bounce off edges)
      if (boid.x < 0) {
        boid.x = 0;
        boid.vx = Math.abs(boid.vx) * 0.8; // Bounce and slow down
      }
      if (boid.x > canvas.width) {
        boid.x = canvas.width;
        boid.vx = -Math.abs(boid.vx) * 0.8; // Bounce and slow down
      }
      if (boid.y < 0) {
        boid.y = 0;
        boid.vy = Math.abs(boid.vy) * 0.8; // Bounce and slow down
      }
      if (boid.y > canvas.height) {
        boid.y = canvas.height;
        boid.vy = -Math.abs(boid.vy) * 0.8; // Bounce and slow down
      }
      
      // Help birds that are stuck on the right side
      if (boid.x > canvas.width - 30 && boid.vx > 0) {
        boid.vx = -Math.abs(boid.vx) * 1.2; // Force leftward movement
      }
    });

    // Draw boids as swift-like shapes
    boids.forEach(boid => {
      const angle = Math.atan2(boid.vy, boid.vx);
      
      ctx.save();
      ctx.translate(boid.x, boid.y);
      ctx.rotate(angle);
      
      // Draw swift-like body
      ctx.fillStyle = `hsl(${boid.hue}, 70%, 60%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, boid.size * 1.5, boid.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw wings
      ctx.fillStyle = `hsl(${boid.hue}, 70%, 50%)`;
      ctx.beginPath();
      ctx.ellipse(-boid.size * 0.5, -boid.size * 0.3, boid.size * 0.8, boid.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-boid.size * 0.5, boid.size * 0.3, boid.size * 0.8, boid.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  };

  const interact = (x, y) => {
    // Add new boids at click location
    for (let i = 0; i < 2; i++) {
      boids.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.6 + 0.2, // Slight bias towards rightward movement
        vy: (Math.random() - 0.5) * 0.4, // Reduced vertical movement
        hue: Math.random() * 40 + 200,
        size: Math.random() * 2 + 2,
        maxSpeed: 1.2,
        maxForce: 0.05
      });
    }
  };

  return { animate, interact };
};
