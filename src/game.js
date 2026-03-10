/**
 * Core game loop: flower collection, butterfly animation, grass sway, camera follow.
 */
import { respawnFlower } from './environment.js';
import { showToast, randomToastMessage, updateFlowerCount, updateJoyBar } from './ui.js';

/**
 * Update flowers: gentle bobbing, collection check, float-up animation.
 */
export function updateFlowers(flowers, ollie, dt, elapsed, state) {
  flowers.forEach(flower => {
    if (flower.userData.collected) {
      flower.userData.floatUp += dt;
      flower.position.y = flower.userData.floatUp * 3;
      const s = Math.max(0, 1 - flower.userData.floatUp * 1.5);
      flower.scale.set(s, s, s);
      flower.rotation.y += dt * 3;
      if (flower.userData.floatUp > 1) respawnFlower(flower);
      return;
    }

    // Idle bob
    flower.position.y = Math.sin(elapsed * 1.5 + flower.userData.bobOffset) * 0.05;
    flower.rotation.y += dt * 0.3;

    // Proximity check
    const dx = flower.position.x - ollie.position.x;
    const dz = flower.position.z - ollie.position.z;
    if (Math.sqrt(dx * dx + dz * dz) < 1.2) {
      flower.userData.collected = true;
      state.flowerCount++;
      state.joyLevel = Math.min(1, state.joyLevel + 0.08);
      updateFlowerCount(state.flowerCount);
      updateJoyBar(state.joyLevel);
      showToast(randomToastMessage());
      state.emmaIsBouncing = true;
      state.emmaBounceTime = 0;
    }
  });
}

/** Gradual joy decay over time. */
export function decayJoy(state, dt) {
  state.joyLevel = Math.max(0.15, state.joyLevel - dt * 0.015);
  updateJoyBar(state.joyLevel);
}

/** Animate lazy butterfly flight paths and wing flaps. */
export function updateButterflies(butterflies, elapsed) {
  butterflies.forEach(bf => {
    const t = elapsed * bf.userData.speed + bf.userData.phase;
    bf.position.x = bf.userData.centerX + Math.sin(t) * bf.userData.radius;
    bf.position.z = bf.userData.centerZ + Math.cos(t * 0.7) * bf.userData.radius;
    bf.position.y = bf.userData.baseY + Math.sin(t * 1.5) * 0.5;
    bf.rotation.y = t;
    bf.userData.wingL.rotation.y =  Math.sin(elapsed * 8 + bf.userData.phase) * 0.6 + 0.3;
    bf.userData.wingR.rotation.y = -Math.sin(elapsed * 8 + bf.userData.phase) * 0.6 - 0.3;
  });
}

/** Gentle wind sway on grass tufts. */
export function updateGrass(grassTufts, elapsed) {
  grassTufts.forEach(tuft => {
    tuft.rotation.z = Math.sin(elapsed * 1.5 + tuft.userData.swayOffset) * 0.08;
    tuft.rotation.x = Math.cos(elapsed * 1.2 + tuft.userData.swayOffset) * 0.05;
  });
}

/** Smooth camera that lazily tracks Ollie. */
export function updateCamera(camera, ollie, dt) {
  const tx = ollie.position.x * 0.3;
  const tz = ollie.position.z * 0.2 + 18;
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, dt * 1.5);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, dt * 1.5);
  camera.lookAt(ollie.position.x * 0.4, 0.5, ollie.position.z * 0.3 - 2);
}
