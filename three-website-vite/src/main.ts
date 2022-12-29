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
// renderer.setClearColor(0x000000, 0.5);

document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);
