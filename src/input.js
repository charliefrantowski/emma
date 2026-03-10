/**
 * Mouse / touch input — projects screen coordinates onto the ground plane.
 */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function updateMouseTarget(clientX, clientY, camera, target) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, hit);
  if (hit) {
    hit.x = THREE.MathUtils.clamp(hit.x, -20, 20);
    hit.z = THREE.MathUtils.clamp(hit.z, -15, 15);
    target.copy(hit);
  }
}
