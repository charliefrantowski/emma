/**
 * Meadow environment: ground plane, rolling hills, grass tufts, flowers, butterflies.
 */
import { PALETTE } from './palette.js';
import { toon, createSoftGradient } from './materials.js';

// ── Ground ──────────────────────────────────────────────────────────
export function createGround(scene) {
  const geo = new THREE.CircleGeometry(60, 64);
  const mat = toon(PALETTE.grassGreen);
  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  return ground;
}

// ── Rolling Hills ───────────────────────────────────────────────────
export function createHills(scene) {
  const hillData = [
    { x: -20, z: -25, r: 12, h: 4, color: PALETTE.sage },
    { x:  15, z: -30, r: 15, h: 5, color: PALETTE.sageLight },
    { x: -35, z: -20, r: 10, h: 3, color: PALETTE.sageDark },
    { x:  30, z: -22, r: 11, h: 3.5, color: PALETTE.sage },
    { x:   0, z: -35, r: 18, h: 6, color: PALETTE.sageLight },
    { x: -10, z: -28, r:  8, h: 2.5, color: PALETTE.sage },
  ];
  hillData.forEach(h => {
    const geo = new THREE.SphereGeometry(h.r, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const mesh = new THREE.Mesh(geo, toon(h.color));
    mesh.position.set(h.x, -0.5, h.z);
    mesh.scale.y = h.h / h.r;
    mesh.receiveShadow = true;
    scene.add(mesh);
  });
}

// ── Grass Tufts ─────────────────────────────────────────────────────
export function createGrassTufts(scene) {
  const grad = createSoftGradient();
  const matDark  = toon(PALETTE.grassDark, grad);
  const matLight = toon(PALETTE.sage, grad);
  const tufts = [];

  for (let i = 0; i < 120; i++) {
    const group = new THREE.Group();
    const count = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < count; j++) {
      const h = 0.3 + Math.random() * 0.5;
      const geo = new THREE.ConeGeometry(0.06, h, 4);
      const blade = new THREE.Mesh(geo, Math.random() > 0.5 ? matDark : matLight);
      blade.position.set((Math.random() - 0.5) * 0.3, h / 2, (Math.random() - 0.5) * 0.3);
      blade.rotation.set((Math.random() - 0.5) * 0.3, Math.random() * Math.PI, 0);
      group.add(blade);
    }
    const angle = Math.random() * Math.PI * 2;
    const dist = 2 + Math.random() * 25;
    group.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
    group.userData.swayOffset = Math.random() * Math.PI * 2;
    tufts.push(group);
    scene.add(group);
  }
  return tufts;
}

// ── Flowers ─────────────────────────────────────────────────────────
export function createFlowers(scene) {
  const colors = [
    PALETTE.dustyRose, PALETTE.dustyRoseLight,
    PALETTE.butter, PALETTE.butterLight,
    PALETTE.skyBlue, PALETTE.pink,
  ];
  const grad = createSoftGradient();
  const flowers = [];

  for (let i = 0; i < 25; i++) {
    const flower = new THREE.Group();

    // Stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6),
      toon(PALETTE.sageDark, grad),
    );
    stem.position.y = 0.3;
    flower.add(stem);

    // Centre
    const centre = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      toon(PALETTE.butter, grad),
    );
    centre.position.y = 0.6;
    flower.add(centre);

    // Petals
    const petalColor = colors[Math.floor(Math.random() * colors.length)];
    const petalMat = toon(petalColor, grad);
    const petalCount = 5 + Math.floor(Math.random() * 3);
    for (let p = 0; p < petalCount; p++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), petalMat);
      const a = (p / petalCount) * Math.PI * 2;
      petal.position.set(Math.cos(a) * 0.15, 0.6, Math.sin(a) * 0.15);
      petal.scale.set(1, 0.5, 1);
      flower.add(petal);
    }

    const angle = Math.random() * Math.PI * 2;
    const dist = 3 + Math.random() * 15;
    flower.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
    flower.userData.collected = false;
    flower.userData.floatUp = 0;
    flower.userData.bobOffset = Math.random() * Math.PI * 2;
    flower.castShadow = true;
    flowers.push(flower);
    scene.add(flower);
  }
  return flowers;
}

/** Respawn a collected flower at a random position. */
export function respawnFlower(flower) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 4 + Math.random() * 14;
  flower.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
  flower.userData.collected = false;
  flower.userData.floatUp = 0;
  flower.visible = true;
  flower.scale.set(1, 1, 1);
}

// ── Butterflies ─────────────────────────────────────────────────────
export function createButterflies(scene) {
  const colors = [PALETTE.butter, PALETTE.dustyRoseLight, PALETTE.skyBlue, PALETTE.butterLight];
  const grad = createSoftGradient();
  const butterflies = [];

  for (let i = 0; i < 8; i++) {
    const bf = new THREE.Group();
    const wingColor = colors[Math.floor(Math.random() * colors.length)];
    const wingMat = new THREE.MeshToonMaterial({
      color: wingColor, gradientMap: grad,
      side: THREE.DoubleSide, transparent: true, opacity: 0.85,
    });

    const wingGeo = new THREE.CircleGeometry(0.2, 6);
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    wingL.position.x = -0.12;
    wingL.rotation.y = 0.3;
    bf.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingR.position.x = 0.12;
    wingR.rotation.y = -0.3;
    bf.add(wingR);

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.22, 4),
      toon(PALETTE.brownLight, grad),
    );
    body.rotation.z = Math.PI / 2;
    bf.add(body);

    const angle = Math.random() * Math.PI * 2;
    const dist = 3 + Math.random() * 12;
    bf.position.set(Math.cos(angle) * dist, 1.5 + Math.random() * 2, Math.sin(angle) * dist);
    bf.userData.centerX = bf.position.x;
    bf.userData.centerZ = bf.position.z;
    bf.userData.baseY   = bf.position.y;
    bf.userData.phase   = Math.random() * Math.PI * 2;
    bf.userData.speed   = 0.3 + Math.random() * 0.4;
    bf.userData.radius  = 1.5 + Math.random() * 3;
    bf.userData.wingL   = wingL;
    bf.userData.wingR   = wingR;
    butterflies.push(bf);
    scene.add(bf);
  }
  return butterflies;
}
