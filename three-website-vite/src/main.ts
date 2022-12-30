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
  flatShading: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const { array } = plane.geometry.attributes.position;
console.log(array);
for (let i = 0, j = 1; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  // console.log(j, [x, y, z]);

  array[i + 2] = z + Math.random();

  console.log(j, [x, y, array[i + 2]]);
  j++;
}
// plane.geometry.attributes.position.array = array;

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  // plane.rotation.x += 0.01;

  renderer.render(scene, camera);
}

// if use this, no need to use `requestAnimationFrame(animate);` and `animate()`
// renderer.setAnimationLoop(animate);
animate();
