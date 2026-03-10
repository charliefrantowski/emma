/**
 * Entry point — sets up the Three.js scene, wires modules together, and runs the game loop.
 */
import { PALETTE } from './palette.js';
import { createGround, createHills, createGrassTufts, createFlowers, createButterflies } from './environment.js';
import { createOllie, updateOllie } from './ollie.js';
import { createEmma, updateEmma } from './emma.js';
import { updateFlowers, decayJoy, updateButterflies, updateGrass, updateCamera } from './game.js';
import { updateMouseTarget } from './input.js';

// ── Mutable game state ──────────────────────────────────────────────
const state = {
  gameStarted: false,
  flowerCount: 0,
  joyLevel: 0.3,
  ollieAngle: 0,
  tailWag: 0,
  emmaBounceTime: 0,
  emmaIsBouncing: false,
};

// ── Scene objects (populated in init) ───────────────────────────────
let scene, camera, renderer, clock;
let ollie, emma;
let flowers, butterflies, grassTufts;
const mouseTarget = new THREE.Vector3(0, 0, 3); // Start at Ollie's initial position

// ── Initialisation ──────────────────────────────────────────────────
function init() {
  clock = new THREE.Clock();

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.fog);
  scene.fog = new THREE.FogExp2(PALETTE.fog, 0.014);

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 12, 18);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.body.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xFFF5E6, 0.6));
  scene.add(new THREE.HemisphereLight(0xC5D8EB, 0x8AAF78, 0.45));

  const sun = new THREE.DirectionalLight(0xFFF0D0, 0.85);
  sun.position.set(8, 15, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
  sun.shadow.camera.left = -20;
  sun.shadow.camera.right = 20;
  sun.shadow.camera.top = 20;
  sun.shadow.camera.bottom = -20;
  sun.shadow.bias = -0.001;
  sun.shadow.radius = 4;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xE8C4C4, 0.3);
  fill.position.set(-5, 8, -3);
  scene.add(fill);

  // World
  createGround(scene);
  createHills(scene);
  grassTufts  = createGrassTufts(scene);
  flowers     = createFlowers(scene);
  butterflies = createButterflies(scene);

  // Characters
  ollie = createOllie(scene);
  emma  = createEmma(scene);

  // Input — mouse
  window.addEventListener('mousemove', e => {
    if (!state.gameStarted) return;
    updateMouseTarget(e.clientX, e.clientY, camera, mouseTarget);
  });

  // Input — touch (iOS + Android)
  function handleTouch(e) {
    if (!state.gameStarted) return;
    e.preventDefault();
    if (e.touches.length > 0) {
      updateMouseTarget(e.touches[0].clientX, e.touches[0].clientY, camera, mouseTarget);
    }
  }
  window.addEventListener('touchstart', handleTouch, { passive: false });
  window.addEventListener('touchmove', handleTouch, { passive: false });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Prevent iOS rubber-band scroll on the document
  document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  // Start button — works for both click and touch without 300ms delay
  const beginBtn = document.getElementById('begin-btn');
  function startGame() {
    if (state.gameStarted) return;
    state.gameStarted = true;
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('hud').classList.add('visible');
  }
  beginBtn.addEventListener('click', startGame);
  beginBtn.addEventListener('touchend', e => {
    e.preventDefault(); // Prevent ghost click / 300ms delay
    startGame();
  });

  // Go!
  animate();
}

// ── Game Loop ───────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  if (!state.gameStarted) {
    renderer.render(scene, camera);
    return;
  }

  updateOllie(ollie, mouseTarget, dt, elapsed, state);
  updateEmma(emma, ollie, dt, elapsed, state);
  updateFlowers(flowers, ollie, dt, elapsed, state);
  decayJoy(state, dt);
  updateButterflies(butterflies, elapsed);
  updateGrass(grassTufts, elapsed);
  updateCamera(camera, ollie, dt);

  renderer.render(scene, camera);
}

// ── Boot ────────────────────────────────────────────────────────────
init();
