/**
 * Emma — a chubby 6-month-old baby girl sitting on the grass.
 * Long-ish wispy brown hair, hazel eyes, sage green onesie, flower hair accessory.
 * Cel-shaded with inverted-hull outlines.
 */
import { PALETTE } from './palette.js';
import { toon, createSoftGradient, createSmoothGradient, addOutline, createOutlineMaterial } from './materials.js';

export function createEmma(scene) {
  const baby = new THREE.Group();
  const grad       = createSoftGradient();
  const smoothGrad = createSmoothGradient();
  const outlineMat = createOutlineMaterial();

  const skinMat     = toon(PALETTE.skin, smoothGrad);
  const rosyMat     = toon(PALETTE.skinRosy, smoothGrad);
  const onesieMat   = toon(PALETTE.sageOnesie, grad);
  const hairMat     = toon(PALETTE.brownHair, grad);
  const eyeMat      = toon(PALETTE.hazel, smoothGrad);
  const eyeWhiteMat = toon(0xFFFFF8, smoothGrad);
  const pupilMat    = toon(0x1A1008, grad);
  const lipMat      = toon(0xE09090, smoothGrad);

  // ── Onesie body (sitting) ──
  const bodyGeo = new THREE.SphereGeometry(0.5, 12, 10);
  const body = new THREE.Mesh(bodyGeo, onesieMat);
  body.position.y = 0.45;
  body.scale.set(1, 0.9, 0.9);
  body.castShadow = true;
  baby.add(body);
  addOutline(baby, body, 0.05);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), onesieMat);
  belly.position.set(0, 0.4, 0.2);
  baby.add(belly);

  const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), onesieMat);
  bottom.position.set(0, 0.15, -0.05);
  bottom.scale.set(1.2, 0.6, 1);
  baby.add(bottom);

  // ── Legs ──
  [-1, 1].forEach(side => {
    const leg = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), onesieMat);
    leg.position.set(side * 0.25, 0.15, 0.35);
    leg.scale.set(1, 0.8, 1.3);
    baby.add(leg);

    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), skinMat);
    foot.position.set(side * 0.25, 0.1, 0.55);
    baby.add(foot);
  });

  // ── Arms ──
  const arms = [];
  [-1, 1].forEach(side => {
    const armGroup = new THREE.Group();
    const arm = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), onesieMat);
    arm.scale.set(0.9, 1.2, 0.9);
    armGroup.add(arm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), skinMat);
    hand.position.y = -0.18;
    armGroup.add(hand);

    armGroup.position.set(side * 0.45, 0.55, 0.1);
    baby.add(armGroup);
    arms.push(armGroup);
  });
  baby.userData.arms = arms;

  // ── Head ──
  const headGeo = new THREE.SphereGeometry(0.42, 14, 12);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 1.1, 0.05);
  head.castShadow = true;
  baby.add(head);
  addOutline(baby, head, 0.05);

  // Rosy cheeks
  [-1, 1].forEach(side => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), rosyMat);
    cheek.position.set(side * 0.28, 1.02, 0.22);
    baby.add(cheek);
  });

  // ── Eyes ──
  [-1, 1].forEach(side => {
    const ew = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), eyeWhiteMat);
    ew.position.set(side * 0.15, 1.14, 0.35);
    baby.add(ew);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), eyeMat);
    iris.position.set(side * 0.15, 1.14, 0.4);
    baby.add(iris);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), pupilMat);
    pupil.position.set(side * 0.15, 1.14, 0.42);
    baby.add(pupil);

    // Sparkle
    const hl = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
    );
    hl.position.set(side * 0.15 + 0.02, 1.16, 0.43);
    baby.add(hl);
  });

  // Smile
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.015, 6, 8, Math.PI), lipMat,
  );
  smile.position.set(0, 1.02, 0.4);
  smile.rotation.x = 0.2;
  baby.add(smile);

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), rosyMat);
  nose.position.set(0, 1.08, 0.42);
  baby.add(nose);

  // ── Hair ──
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat,
  );
  hairCap.position.set(0, 1.1, 0.02);
  baby.add(hairCap);

  // Wispy strands
  for (let i = 0; i < 12; i++) {
    const strand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), hairMat);
    const angle = (i / 12) * Math.PI * 2;
    strand.position.set(
      Math.cos(angle) * 0.38,
      1.35 + Math.sin(i * 1.7) * 0.08,
      Math.sin(angle) * 0.38 * 0.8 + 0.02,
    );
    strand.scale.set(0.8, 1.8, 0.8);
    strand.rotation.set((Math.random() - 0.5) * 0.5, angle, Math.cos(angle) * 0.4);
    baby.add(strand);
  }
  for (let i = 0; i < 8; i++) {
    const strand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), hairMat);
    const angle = Math.PI * 0.3 + (i / 8) * Math.PI * 1.4;
    strand.position.set(Math.cos(angle) * 0.42, 1.15 + Math.random() * 0.1, Math.sin(angle) * 0.38);
    strand.scale.set(0.7, 2.5, 0.7);
    strand.rotation.z = Math.cos(angle) * 0.5;
    baby.add(strand);
  }

  // ── Hair flower accessory ──
  const acc = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), toon(PALETTE.dustyRoseLight, grad));
  acc.position.set(-0.32, 1.38, 0.15);
  baby.add(acc);
  for (let p = 0; p < 5; p++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), toon(PALETTE.dustyRose, grad));
    const a = (p / 5) * Math.PI * 2;
    petal.position.set(-0.32 + Math.cos(a) * 0.06, 1.38, 0.15 + Math.sin(a) * 0.06);
    baby.add(petal);
  }

  baby.position.set(-5, 0, 1);
  baby.castShadow = true;
  scene.add(baby);
  return baby;
}

/**
 * Per-frame update for Emma: tracks Ollie with her gaze, bounces on flower collection.
 */
export function updateEmma(emma, ollie, dt, elapsed, state) {
  // Look at Ollie
  const ex = ollie.position.x - emma.position.x;
  const ez = ollie.position.z - emma.position.z;
  const target = Math.atan2(ex, ez);
  let diff = target - emma.rotation.y;
  while (diff >  Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  emma.rotation.y += diff * 2.5 * dt;

  // Bouncing (triggered by flower collection)
  if (state.emmaIsBouncing) {
    state.emmaBounceTime += dt;
    emma.position.y = Math.abs(Math.sin(state.emmaBounceTime * 8)) * 0.15;
    emma.userData.arms[0].rotation.z = Math.sin(state.emmaBounceTime * 10) * 0.4 - 0.3;
    emma.userData.arms[1].rotation.z = Math.sin(state.emmaBounceTime * 10 + Math.PI) * 0.4 + 0.3;
    if (state.emmaBounceTime > 1.8) state.emmaIsBouncing = false;
  } else {
    emma.position.y = THREE.MathUtils.lerp(emma.position.y, 0, dt * 3);
    emma.userData.arms[0].rotation.z = Math.sin(elapsed * 1.2) * 0.1 - 0.15;
    emma.userData.arms[1].rotation.z = Math.sin(elapsed * 1.2 + 1) * 0.1 + 0.15;
  }
}
