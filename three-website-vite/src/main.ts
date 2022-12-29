import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

console.log(scene);
console.log(camera);
console.log(renderer);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setClearColor(0xffff00, 0.5);

document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
console.log(boxGeometry);
console.log(boxMaterial);

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  box.rotation.x += 0.001;
  box.rotation.y += 0.005;

  renderer.render(scene, camera);
}

// if use this, no need to use `requestAnimationFrame(animate);` and `animate()`
// renderer.setAnimationLoop(animate);
animate();
