/**
 * Ollie — a fluffy golden doodle built from Three.js primitives.
 * More anatomically realistic: proper dog proportions, muscular structure,
 * layered fur, defined muzzle, and natural joint positions.
 */
import { PALETTE } from './palette.js';
import { toon, createSoftGradient, createSmoothGradient, addOutline } from './materials.js';

export function createOllie(scene) {
  const dog = new THREE.Group();
  const grad       = createSoftGradient();
  const smoothGrad = createSmoothGradient();

  // Shared materials
  const furMat       = toon(PALETTE.golden, grad);
  const furLightMat  = toon(PALETTE.goldenLight, grad);
  const furDarkMat   = toon(PALETTE.goldenDark, grad);
  const noseMat      = toon(PALETTE.brown, grad);
  const eyeMat       = toon(0x2A1A0A, grad);
  const eyeWhiteMat  = toon(0xFFFFF0, smoothGrad);
  const bandanaMat   = toon(PALETTE.pinkBandana, grad);
  const tongueMat    = toon(0xF07080, smoothGrad);
  const gumMat       = toon(0x3A2A1A, grad);

  // ── Torso (elongated, barrel-shaped) ──
  const torso = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    furMat,
  );
  torso.position.y = 1.05;
  torso.scale.set(0.85, 0.8, 1.35);
  torso.castShadow = true;
  dog.add(torso);
  addOutline(dog, torso, 0.04);

  // Chest (broader, muscular front)
  const chest = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 12, 10),
    furLightMat,
  );
  chest.position.set(0, 1.0, 0.45);
  chest.scale.set(0.95, 0.9, 0.8);
  dog.add(chest);

  // Belly (lighter underside)
  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 10, 8),
    furLightMat,
  );
  belly.position.set(0, 0.8, 0.05);
  belly.scale.set(0.8, 0.5, 1.1);
  dog.add(belly);

  // Shoulders
  [-1, 1].forEach(side => {
    const shoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 8),
      furMat,
    );
    shoulder.position.set(side * 0.32, 1.1, 0.35);
    dog.add(shoulder);
  });

  // Hips
  [-1, 1].forEach(side => {
    const hip = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 10, 8),
      furMat,
    );
    hip.position.set(side * 0.28, 1.05, -0.45);
    dog.add(hip);
  });

  // Fur tufts along body (layered, varied sizes for realism)
  const tuftPositions = [
    [0, 1.35, 0.1], [0, 1.35, -0.2],
    [-0.35, 1.1, 0.1], [0.35, 1.1, 0.1],
    [-0.3, 1.1, -0.3], [0.3, 1.1, -0.3],
    [0, 0.85, 0.5], [0, 0.85, -0.4],
    [-0.25, 1.25, 0.3], [0.25, 1.25, 0.3],
  ];
  tuftPositions.forEach(([x, y, z], i) => {
    const size = 0.1 + (i % 3) * 0.04;
    const tuft = new THREE.Mesh(
      new THREE.SphereGeometry(size, 6, 5),
      i % 2 === 0 ? furLightMat : furMat,
    );
    tuft.position.set(x, y, z);
    dog.add(tuft);
  });

  // ── Neck (connecting torso to head) ──
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.28, 0.35, 10),
    furMat,
  );
  neck.position.set(0, 1.35, 0.45);
  neck.rotation.x = 0.4;
  dog.add(neck);

  // Neck fur ruff
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const ruff = new THREE.Mesh(
      new THREE.SphereGeometry(0.1 + Math.random() * 0.05, 6, 5),
      furLightMat,
    );
    ruff.position.set(
      Math.cos(a) * 0.22,
      1.28 + Math.sin(a) * 0.05,
      0.45 + Math.sin(a) * 0.1,
    );
    dog.add(ruff);
  }

  // ── Head (slightly more elongated for a doodle) ──
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 14, 12),
    furMat,
  );
  head.position.set(0, 1.6, 0.6);
  head.scale.set(1, 0.95, 1.05);
  head.castShadow = true;
  dog.add(head);
  addOutline(dog, head, 0.04);

  // Forehead / crown (higher fur)
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 10, 8),
    furLightMat,
  );
  crown.position.set(0, 1.78, 0.55);
  dog.add(crown);

  // Cheeks
  [-1, 1].forEach(side => {
    const cheek = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 6),
      furLightMat,
    );
    cheek.position.set(side * 0.22, 1.52, 0.72);
    cheek.scale.set(0.8, 0.7, 0.9);
    dog.add(cheek);
  });

  // Head tufts (curly doodle fur)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tuft = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + Math.random() * 0.04, 6, 5),
      i % 2 === 0 ? furLightMat : furMat,
    );
    tuft.position.set(
      Math.cos(a) * 0.28 + 0,
      1.7 + Math.sin(a * 2) * 0.08,
      Math.sin(a) * 0.22 + 0.6,
    );
    dog.add(tuft);
  }

  // ── Muzzle (more defined, longer snout) ──
  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 10, 8),
    furLightMat,
  );
  muzzle.position.set(0, 1.48, 0.92);
  muzzle.scale.set(0.85, 0.65, 1.1);
  dog.add(muzzle);

  // Lower jaw
  const jaw = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 8, 6),
    furLightMat,
  );
  jaw.position.set(0, 1.42, 0.88);
  jaw.scale.set(0.8, 0.45, 0.9);
  dog.add(jaw);

  // Nose (larger, more defined)
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 10, 8),
    noseMat,
  );
  nose.position.set(0, 1.5, 1.05);
  nose.scale.set(1.2, 0.9, 1);
  dog.add(nose);

  // Nostrils
  [-1, 1].forEach(side => {
    const nostril = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 6, 4),
      gumMat,
    );
    nostril.position.set(side * 0.035, 1.49, 1.07);
    dog.add(nostril);
  });

  // Mouth line
  const mouth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.08, 4),
    gumMat,
  );
  mouth.position.set(0, 1.44, 1.02);
  mouth.rotation.z = Math.PI / 2;
  dog.add(mouth);

  // Tongue (hanging out happily)
  const tongue = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 8, 6),
    tongueMat,
  );
  tongue.position.set(0.02, 1.38, 0.98);
  tongue.scale.set(0.8, 0.35, 1.3);
  dog.add(tongue);
  dog.userData.tongue = tongue;

  // ── Eyes (more realistic with iris detail) ──
  [-1, 1].forEach(side => {
    // Eye socket shadow
    const socket = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 6),
      furDarkMat,
    );
    socket.position.set(side * 0.15, 1.62, 0.84);
    socket.scale.set(1, 0.9, 0.5);
    dog.add(socket);

    // Eye white
    const ew = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 10, 8),
      eyeWhiteMat,
    );
    ew.position.set(side * 0.15, 1.63, 0.87);
    dog.add(ew);

    // Iris (warm brown)
    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 8),
      toon(PALETTE.hazel, smoothGrad),
    );
    iris.position.set(side * 0.15, 1.63, 0.91);
    dog.add(iris);

    // Pupil
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 6),
      eyeMat,
    );
    pupil.position.set(side * 0.15, 1.63, 0.93);
    dog.add(pupil);

    // Sparkle highlight
    const hl = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
    );
    hl.position.set(side * 0.15 + side * 0.015, 1.65, 0.94);
    dog.add(hl);

    // Brow ridge
    const brow = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 6, 5),
      furMat,
    );
    brow.position.set(side * 0.16, 1.72, 0.82);
    brow.scale.set(1.3, 0.6, 0.8);
    dog.add(brow);
  });

  // ── Floppy ears (longer, more realistic) ──
  [-1, 1].forEach(side => {
    const earGroup = new THREE.Group();

    // Ear base
    const earBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      furDarkMat,
    );
    earBase.scale.set(0.6, 0.8, 0.7);
    earGroup.add(earBase);

    // Ear mid (floppy part)
    const earMid = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 8, 8),
      furDarkMat,
    );
    earMid.position.y = -0.18;
    earMid.scale.set(0.55, 1.0, 0.7);
    earGroup.add(earMid);

    // Ear tip
    const earTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      furDarkMat,
    );
    earTip.position.y = -0.34;
    earTip.scale.set(0.5, 0.7, 0.6);
    earGroup.add(earTip);

    // Ear fur tufts
    for (let i = 0; i < 3; i++) {
      const ef = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 5, 4),
        furMat,
      );
      ef.position.set(
        (Math.random() - 0.5) * 0.06,
        -0.1 - i * 0.1,
        0.05,
      );
      earGroup.add(ef);
    }

    earGroup.position.set(side * 0.32, 1.7, 0.5);
    earGroup.rotation.z = side * 0.35;
    earGroup.rotation.x = 0.15;
    dog.add(earGroup);

    if (side === -1) dog.userData.earL = earGroup;
    else dog.userData.earR = earGroup;
  });

  // ── Legs (jointed, with upper/lower segments) ──
  const legConfigs = [
    { x: -0.28, z: 0.35, isFront: true },
    { x:  0.28, z: 0.35, isFront: true },
    { x: -0.25, z: -0.4, isFront: false },
    { x:  0.25, z: -0.4, isFront: false },
  ];
  dog.userData.legs = [];

  legConfigs.forEach(({ x, z, isFront }) => {
    const legGroup = new THREE.Group();

    // Upper leg
    const upperLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.085, isFront ? 0.35 : 0.38, 8),
      furMat,
    );
    upperLeg.position.y = -0.1;
    legGroup.add(upperLeg);

    // Lower leg
    const lowerLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.07, 0.3, 8),
      furMat,
    );
    lowerLeg.position.y = -0.35;
    legGroup.add(lowerLeg);

    // Fur around joint
    const jointFur = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 6, 5),
      furLightMat,
    );
    jointFur.position.y = -0.22;
    legGroup.add(jointFur);

    // Paw (more defined)
    const paw = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 6),
      furLightMat,
    );
    paw.position.set(0, -0.5, 0.02);
    paw.scale.set(1, 0.5, 1.2);
    legGroup.add(paw);

    // Toe bumps
    for (let t = 0; t < 3; t++) {
      const toe = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 5, 4),
        furLightMat,
      );
      const ta = ((t - 1) / 2) * 0.6;
      toe.position.set(Math.sin(ta) * 0.06, -0.52, 0.06 + Math.cos(ta) * 0.03);
      legGroup.add(toe);
    }

    legGroup.position.set(x, 0.65, z);
    legGroup.castShadow = true;
    dog.add(legGroup);
    dog.userData.legs.push(legGroup);
  });

  // ── Bandana ──
  const bandana = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.3, 3),
    bandanaMat,
  );
  bandana.position.set(0, 1.2, 0.58);
  bandana.rotation.x = 0.35;
  bandana.rotation.z = Math.PI;
  dog.add(bandana);

  const bandanaWrap = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.035, 6, 14),
    bandanaMat,
  );
  bandanaWrap.position.set(0, 1.3, 0.5);
  bandanaWrap.rotation.x = Math.PI / 2 + 0.35;
  dog.add(bandanaWrap);

  // ── Tail (longer, curving, feathered) ──
  const tailGroup = new THREE.Group();

  // Tail base
  const tailBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.05, 0.25, 6),
    furMat,
  );
  tailBase.position.y = 0.12;
  tailGroup.add(tailBase);

  // Tail mid
  const tailMid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.25, 6),
    furMat,
  );
  tailMid.position.set(0, 0.32, -0.05);
  tailMid.rotation.x = 0.3;
  tailGroup.add(tailMid);

  // Tail tip with fur plume
  const tailTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 8, 6),
    furLightMat,
  );
  tailTip.position.set(0, 0.48, -0.1);
  tailGroup.add(tailTip);

  // Feathery fur along tail
  for (let i = 0; i < 5; i++) {
    const feather = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + i * 0.008, 5, 4),
      furLightMat,
    );
    feather.position.set(
      (Math.random() - 0.5) * 0.06,
      0.1 + i * 0.08,
      -0.02 * i,
    );
    tailGroup.add(feather);
  }

  tailGroup.position.set(0, 1.1, -0.6);
  tailGroup.rotation.x = -0.7;
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

  // Bounce (subtler, more natural gait)
  ollie.position.y = isMoving
    ? Math.abs(Math.sin(elapsed * 8)) * 0.08
    : THREE.MathUtils.lerp(ollie.position.y, 0, dt * 5);

  // Tail wag (curves more naturally)
  state.tailWag += dt * (isMoving ? 14 : 8);
  ollie.userData.tail.rotation.z = Math.sin(state.tailWag) * (isMoving ? 0.5 : 0.3);
  ollie.userData.tail.rotation.x = -0.7 + Math.sin(state.tailWag * 0.5) * 0.1;

  // Ears (natural flop with bounce)
  const earBounce = isMoving ? Math.sin(elapsed * 8) * 0.12 : 0;
  ollie.userData.earL.rotation.x = 0.15 + Math.sin(elapsed * 2) * 0.08 + earBounce;
  ollie.userData.earR.rotation.x = 0.15 + Math.sin(elapsed * 2 + 0.8) * 0.08 + earBounce;

  // Tongue (gentle bob)
  ollie.userData.tongue.position.y = 1.38 + Math.sin(elapsed * 3) * 0.015;

  // Legs (walk cycle with natural stride)
  ollie.userData.legs.forEach((leg, i) => {
    leg.rotation.x = isMoving
      ? Math.sin(elapsed * 10 + i * Math.PI * 0.5) * 0.25
      : THREE.MathUtils.lerp(leg.rotation.x, 0, dt * 5);
  });

  return isMoving;
}
