// Import animation functions
import { initMagneticFields } from './MagneticFields.js';
import { initFlockingBoids } from './FlockingBoids.js';

// Animation exports
export { initMagneticFields, initFlockingBoids };

// Animation metadata
export const ANIMATIONS = [
  { id: 'magneticFields', name: 'Magnetic', init: initMagneticFields },
  { id: 'flockingBoids', name: 'Flocking', init: initFlockingBoids }
];
