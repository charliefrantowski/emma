/**
 * Cel-shading material helpers.
 *
 * Uses Three.js MeshToonMaterial with stepped DataTexture gradients
 * to produce that soft, painterly indie-game look.
 */
import { PALETTE } from './palette.js';

/**
 * Create a stepped luminance gradient texture for MeshToonMaterial.
 * Fewer steps → harder cel edges. More steps → softer watercolour feel.
 */
export function createToonGradient(steps = 4) {
  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) {
    data[i] = Math.floor(100 + 155 * Math.pow(i / (steps - 1), 0.7));
  }
  const tex = new THREE.DataTexture(data, steps, 1, THREE.LuminanceFormat);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

/** Hard 3-step gradient — classic cel look. */
export function createSoftGradient() {
  return createToonGradient(3);
}

/** Smoother 5-step gradient — nice for skin / delicate surfaces. */
export function createSmoothGradient() {
  return createToonGradient(5);
}

/** Shortcut: create a MeshToonMaterial with a given colour and gradient. */
export function toon(color, gradientMap) {
  return new THREE.MeshToonMaterial({
    color,
    gradientMap: gradientMap || createSoftGradient(),
  });
}

/** BackSide outline material for the inverted-hull cel outline technique. */
export function createOutlineMaterial(color) {
  return new THREE.MeshBasicMaterial({
    color: color || PALETTE.outline,
    side: THREE.BackSide,
  });
}

/**
 * Add an outline shell (inverted-hull method) to a parent group.
 * Clones the mesh geometry, renders on BackSide at a slightly larger scale.
 */
export function addOutline(parent, mesh, thickness = 0.04, color) {
  const geo = mesh.geometry;
  const mat = createOutlineMaterial(color);
  const outline = new THREE.Mesh(geo, mat);
  outline.position.copy(mesh.position);
  outline.rotation.copy(mesh.rotation);
  // Scale up slightly beyond the original mesh's scale
  const s = 1 + thickness;
  outline.scale.set(
    mesh.scale.x * s,
    mesh.scale.y * s,
    mesh.scale.z * s,
  );
  outline.renderOrder = -1;
  parent.add(outline);
  return outline;
}
