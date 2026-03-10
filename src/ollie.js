/**
 * Ollie — a fluffy golden doodle built from Three.js primitives.
 * Cel-shaded with inverted-hull outlines on key parts.
 */
import { PALETTE } from './palette.js';
import { toon, createSoftGradient, createSmoothGradient, addOutline, createOutlineMaterial } from './materials.js';

export function createOllie(scene) {
  const dog = new THREE.Group();
  const grad       = createSoftGradient();
  const smoothGrad = createSmoothGradient();
  const outlineMat = createOutlineMaterial();

  // Shared materials
  const bodyMat      = toon(PALETTE.golden, grad);
  const bodyLightMat = toon(PALETTE.goldenLight, grad);
  const noseMat      = toon(PALETTE.brown, grad);
  const eyeMat       = toon(0x2A1A0A, grad);
  const eyeWhiteMat  = toon(0xFFFFF0, smoothGrad);
  const bandanaMat   = toon(PALETTE.pinkBandana, grad);
  const tongueMat    = toon(0xF07080, smoothGrad);

  // ── Body ──
  const bodyGeo = new THREE.SphereGeometry(0.6, 12, 10);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.0;
  body.scale.set(1, 0.85, 1.2);
  body.castShadow = true;
  dog.add(body);
  addOutline(dog, body, 0.05);

  // Fluffy chest
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), bodyLightMat);
  chest.position.set(0, 0.95, 0.4);
  dog.add(chest);

  // Body tufts
  for (let i = 0; i < 6; i++) {
    const tuft = new THREE.Mesh(
      new THREE.SphereGeometry(0.15 + Math.random() * 0.1, 8, 6), bodyLightMat,
    );
    const a = (i / 6) * Math.PI * 2;
    tuft.position.set(Math.cos(a) * 0.45, 0.9 + Math.random() * 0.3, Math.sin(a) * 0.3);
    dog.add(tuft);
  }

  // ── Head ──
  const headGeo = new THREE.SphereGeometry(0.42, 12, 10);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(0, 1.55, 0.5);
  head.castShadow = true;
  dog.add(head);
  addOutline(dog, head, 0.05);

  // Head tufts
  for (let i = 0; i < 5; i++) {
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), bodyLightMat);
    const a = (i / 5) * Math.PI * 2;
    tuft.position.set(Math.cos(a) * 0.3, 1.7 + Math.sin(i) * 0.1, Math.sin(a) * 0.25 + 0.5);
    dog.add(tuft);
  }

  // ── Snout / nose / tongue ──
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), bodyLightMat);
  snout.position.set(0, 1.45, 0.85);
  snout.scale.set(1, 0.75, 1);
  dog.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), noseMat);
  nose.position.set(0, 1.48, 0.98);
  dog.add(nose);

  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), tongueMat);
  tongue.position.set(0.03, 1.38, 0.93);
  tongue.scale.set(1, 0.5, 1.2);
  dog.add(tongue);
  dog.userData.tongue = tongue;

  // ── Eyes ──
  [-1, 1].forEach(side => {
    const ew = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), eyeWhiteMat);
    ew.position.set(side * 0.16, 1.62, 0.8);
    dog.add(ew);

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), eyeMat);
    eye.position.set(side * 0.16, 1.62, 0.85);
    dog.add(eye);

    // Anime sparkle
    const hl = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
    );
    hl.position.set(side * 0.16 + 0.02, 1.64, 0.87);
    dog.add(hl);

    // Brow tuft
    const brow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), bodyMat);
    brow.position.set(side * 0.18, 1.72, 0.78);
    dog.add(brow);
  });

  // ── Floppy ears ──
  const earGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const earMat = toon(PALETTE.goldenDark, grad);

  const earL = new THREE.Mesh(earGeo, earMat);
  earL.scale.set(0.6, 1.2, 0.8);
  earL.position.set(-0.35, 1.5, 0.4);
  earL.rotation.z = 0.3;
  dog.add(earL);
  dog.userData.earL = earL;

  const earR = earL.clone();
  earR.position.set(0.35, 1.5, 0.4);
  earR.rotation.z = -0.3;
  dog.add(earR);
  dog.userData.earR = earR;

  // ── Legs + paws ──
  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.5, 8);
  const pawGeo = new THREE.SphereGeometry(0.12, 8, 6);
  const legPositions = [[-0.25, 0, 0.3], [0.25, 0, 0.3], [-0.25, 0, -0.3], [0.25, 0, -0.3]];
  dog.userData.legs = [];
  legPositions.forEach(([x, , z]) => {
    const leg = new THREE.Mesh(legGeo, bodyMat);
    leg.position.set(x, 0.4, z);
    leg.castShadow = true;
    dog.add(leg);

    const paw = new THREE.Mesh(pawGeo, bodyLightMat);
    paw.position.set(x, 0.12, z);
    paw.scale.y = 0.6;
    dog.add(paw);
    dog.userData.legs.push(leg);
  });

  // ── Bandana ──
  const bandana = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.35, 3), bandanaMat);
  bandana.position.set(0, 1.15, 0.55);
  bandana.rotation.x = 0.3;
  bandana.rotation.z = Math.PI;
  dog.add(bandana);

  const bandanaWrap = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 6, 12), bandanaMat);
  bandanaWrap.position.set(0, 1.25, 0.45);
  bandanaWrap.rotation.x = Math.PI / 2 + 0.3;
  dog.add(bandanaWrap);

  // ── Tail ──
  const tailGroup = new THREE.Group();
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.55, 6), bodyMat);
  tail.position.y = 0.25;
  tailGroup.add(tail);

  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), bodyLightMat);
  tailTip.position.y = 0.5;
  tailGroup.add(tailTip);

  tailGroup.position.set(0, 1.1, -0.65);
  tailGroup.rotation.x = -0.8;
  dog.add(tailGroup);
  dog.userData.tail = tailGroup;

  dog.position.set(0, 0, 3);
  dog.castShadow = true;
  scene.add(dog);
  return dog;
}

/**
 * Per-frame update for Ollie: movement, bobbing, tail wag, ear flop, leg walk cycle.
 */
export function updateOllie(ollie, mouseTarget, dt, elapsed, state) {
  const dx = mouseTarget.x - ollie.position.x;
  const dz = mouseTarget.z - ollie.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const speed = Math.min(dist * 2.5, 8);
  const isMoving = dist > 0.3;

  // Movement
  if (isMoving) {
    ollie.position.x += (dx / dist) * speed * dt;
    ollie.position.z += (dz / dist) * speed * dt;
    const targetAngle = Math.atan2(dx, dz);
    let diff = targetAngle - state.ollieAngle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    state.ollieAngle += diff * 5 * dt;
    ollie.rotation.y = state.ollieAngle;
  }

  // Bounce
  ollie.position.y = isMoving
    ? Math.abs(Math.sin(elapsed * 8)) * 0.12
    : THREE.MathUtils.lerp(ollie.position.y, 0, dt * 5);

  // Tail wag
  state.tailWag += dt * (isMoving ? 14 : 8);
  ollie.userData.tail.rotation.z = Math.sin(state.tailWag) * (isMoving ? 0.6 : 0.35);

  // Ears
  ollie.userData.earL.rotation.x = Math.sin(elapsed * 2) * 0.1 + (isMoving ? Math.sin(elapsed * 6) * 0.15 : 0);
  ollie.userData.earR.rotation.x = Math.sin(elapsed * 2 + 1) * 0.1 + (isMoving ? Math.sin(elapsed * 6 + 1) * 0.15 : 0);

  // Tongue
  ollie.userData.tongue.position.y = 1.38 + Math.sin(elapsed * 3) * 0.02;

  // Legs
  ollie.userData.legs.forEach((leg, i) => {
    leg.rotation.x = isMoving
      ? Math.sin(elapsed * 10 + i * Math.PI * 0.5) * 0.3
      : THREE.MathUtils.lerp(leg.rotation.x, 0, dt * 5);
  });

  return isMoving;
}
