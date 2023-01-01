import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';
import gsap from 'gsap';

// Constants
const PLN_W = 5;
const PLN_H = 5;
const PLN_SEG_W = 10;
const PLN_SEG_H = 10;

const BASE_RGB = [0, 0.19, 0.4];
const HOVER_RGB = [0.1, 0.5, 1.0] as const;

// GUI controls
const gui = new dat.GUI();
const world = {
  plane: {
    width: PLN_W,
    height: PLN_H,
    widthSegments: PLN_SEG_W,
    heightSegments: PLN_SEG_H,
    r: HOVER_RGB[0],
    g: HOVER_RGB[1],
    b: HOVER_RGB[2],
  },
};

gui.add(world.plane, 'width', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'r', 0, 1);
gui.add(world.plane, 'g', 0, 1);
gui.add(world.plane, 'b', 0, 1);

function getNewPosition(arrayToCopy: Array<number>) {
  const array = Float32Array.from(arrayToCopy);
  // let j = 1;
  for (let i = 0; i < array.length; i += 3) {
    // const x = array[i];
    // const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
    // console.log(j++, [x, y, array[i + 2]]);
  }
  return new THREE.BufferAttribute(array, 3, false);
}

function generatePlane() {
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  plane.geometry.setAttribute(
    'position',
    getNewPosition(plane.geometry.attributes.position.array as Array<number>)
  );
}

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

camera.position.z = 5;

// Plane
const planeGeometry = new THREE.PlaneGeometry(
  PLN_W,
  PLN_H,
  PLN_SEG_W,
  PLN_SEG_H
);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000, // this default color will affect plan 'color' attribute (=vertex color?)
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Modify the position attribute of the geometry
// const { array } = plane.geometry.attributes.position;  // ArrayLike<number> is ready-only in TypeScript ts(2542)
// const array = Float32Array.from(plane.geometry.attributes.position.array); // it works
plane.geometry.setAttribute(
  'position',
  getNewPosition(plane.geometry.attributes.position.array as Array<number>)
);

const colors = [];
for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
  colors.push(...BASE_RGB); // RGB
}
// Colorful base colors
// for (let i = 0; i < plane.geometry.attributes.position.count / 3; i++) {
//   colors.push(0, 0, 1); // RGB -> blue
//   colors.push(0, 1, 0); // green
//   colors.push(1, 0, 0); // red
// }

plane.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// normalized mouse coordinates
const mouse = {
  x: 10, // set the default value out of the range (-1 to 1)
  y: 10,
};

const setPlaneColor = (
  intersect: THREE.Intersection<THREE.Object3D<THREE.Event>>,
  hoverColor: { r: number; g: number; b: number }
) => {
  if (intersect.face) {
    const obj = intersect.object as PlaneMesh;
    const { color } = obj.geometry.attributes;
    const hoveredColor = [hoverColor.r, hoverColor.g, hoverColor.b] as const; // cobalt-blueish
    // XYZ = RGB
    color.setXYZ(intersect.face.a, ...hoveredColor); // vertex 1
    color.setXYZ(intersect.face.b, ...hoveredColor); // vertex 2
    color.setXYZ(intersect.face.c, ...hoveredColor); // vertex 3

    // a way to use defined Array
    // type FaceArrayType = 'a' | 'b' | 'c';
    // const faceArray: FaceArrayType[] = ['a', 'b', 'c'];
    // faceArray.forEach((c: FaceArrayType) => {
    //   if (!intersect.face) return;
    //   color.setXYZ(intersect.face[c], hoverColor.r, hoverColor.g, hoverColor.b);
    // });

    color.needsUpdate = true;
  }
};

type PlaneMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>;
function animate() {
  requestAnimationFrame(animate);
  // plane.rotation.x += 0.01;

  renderer.render(scene, camera);

  // set colors when hovering
  raycaster.setFromCamera(mouse, camera);
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
