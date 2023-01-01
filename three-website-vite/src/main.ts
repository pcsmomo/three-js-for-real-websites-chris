import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';
import gsap from 'gsap';

// Types
import { World } from './types';

// Utils
import { generatePlane, setPlaneColor, getPlaneExtraInfo } from './utils';

// Constants
import { BASE_RGB, HOVER_RGB } from './constants';

// GUI controls
const gui = new dat.GUI();
const world: World = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
    r: HOVER_RGB[0],
    g: HOVER_RGB[1],
    b: HOVER_RGB[2],
  },
};

gui
  .add(world.plane, 'width', 1, 500)
  .onChange(() => generatePlane(plane, world, planeExtraInfo));
gui
  .add(world.plane, 'height', 1, 500)
  .onChange(() => generatePlane(plane, world, planeExtraInfo));
gui
  .add(world.plane, 'widthSegments', 1, 100)
  .onChange(() => generatePlane(plane, world, planeExtraInfo));
gui
  .add(world.plane, 'heightSegments', 1, 100)
  .onChange(() => generatePlane(plane, world, planeExtraInfo));
gui.add(world.plane, 'r', 0, 1);
gui.add(world.plane, 'g', 0, 1);
gui.add(world.plane, 'b', 0, 1);

// THREE main objects
const raycaster = new THREE.Raycaster();
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

// Orbit controls
new OrbitControls(camera, renderer.domElement);

camera.position.z = 50;

// Plane
const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000, // this default color will affect plan 'color' attribute (=vertex color?)
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// set extrs variables for position effect
const planeExtraInfo = getPlaneExtraInfo(plane);
generatePlane(plane, world, planeExtraInfo);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// normalized mouse coordinates
const mouse = {
  x: 10, // set the default value out of the range (-1 to 1)
  y: 10,
};

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  // plane.rotation.x += 0.01;

  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);

  // Set position randomly moving
  frame += 0.01;
  const array = Float32Array.from(plane.geometry.attributes.position.array);
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] =
      planeExtraInfo.originalPosition[i] +
      Math.cos(frame + planeExtraInfo.randomValues[i]) * 0.3;
    // y
    array[i + 1] =
      planeExtraInfo.originalPosition[i + 1] +
      Math.sin(frame + planeExtraInfo.randomValues[i + 1]) * 0.3;

    // if (i === 0) {
    //   console.log(array[i], array[i + 1]);
    // }
  }
  const newPos = new THREE.BufferAttribute(array, 3);
  plane.geometry.setAttribute('position', newPos);
  plane.geometry.attributes.position.needsUpdate = true;

  // set colors when hovering
  const intersects = raycaster.intersectObject(plane);
  if (intersects.length > 0 && intersects[0].face) {
    const hoverColor = {
      r: world.plane.r,
      g: world.plane.g,
      b: world.plane.b,
    };
    setPlaneColor(intersects[0], hoverColor);

    // animate the colors back to original
    gsap.to(hoverColor, {
      r: BASE_RGB[0],
      g: BASE_RGB[1],
      b: BASE_RGB[2],
      duration: 1,
      onUpdate: () => {
        // in this callback function, we only can use the object defined with `gasp.to`
        // such as hoveredColorObj
        // console.log('update');
        setPlaneColor(intersects[0], hoverColor);
      },
    });
  }
}

// if use this, no need to use `requestAnimationFrame(animate);` and `animate()`
// renderer.setAnimationLoop(animate);
animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
