import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setClearColor(0xffff00, 0.5);

document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// Plane
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

function animate() {
  requestAnimationFrame(animate);
  // plane.rotation.x += 0.01;

  renderer.render(scene, camera);
}

// if use this, no need to use `requestAnimationFrame(animate);` and `animate()`
// renderer.setAnimationLoop(animate);
animate();
