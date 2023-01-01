import * as THREE from 'three';

// Types
import { PlaneMesh, World, PlaneMeshExtraInfo } from './types';

// Constants
import { BASE_RGB } from './constants';

function getRandomizedPosition(arrayToCopy: Array<number>) {
  // Modify the position attribute of the geometry
  // const { array } = plane.geometry.attributes.position;  // ArrayLike<number> is ready-only in TypeScript ts(2542)
  // const array = Float32Array.from(plane.geometry.attributes.position.array); // it works
  const array = Float32Array.from(arrayToCopy);
  // let j = 1;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + (Math.random() - 0.5) * 3;
    array[i + 1] = y + (Math.random() - 0.5) * 3;
    array[i + 2] = z + (Math.random() - 0.5) * 10;
    // console.log(j++, [x, y, array[i + 2]]);
  }
  return new THREE.BufferAttribute(array, 3);
}

function getInitialColors(plane: PlaneMesh) {
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

  return new THREE.BufferAttribute(new Float32Array(colors), 3);
}

export function setPlaneAttributes(plane: PlaneMesh) {
  // position
  const position = getRandomizedPosition(
    plane.geometry.attributes.position.array as Array<number>
  );
  plane.geometry.setAttribute('position', position);

  // color
  const colors = getInitialColors(plane);
  plane.geometry.setAttribute('color', colors);
}

export function getPlaneExtraInfo(plane: PlaneMesh) {
  const planePosArr = plane.geometry.attributes.position.array;

  const extInfo = {
    originalPosition: planePosArr,
    randomValues: new Array(planePosArr.length)
      .fill(0)
      .map(() => Math.random() * Math.PI * 2),
  };

  return extInfo;
}

export function generatePlane(
  plane: PlaneMesh,
  world: World,
  extraInfo: PlaneMeshExtraInfo
) {
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  setPlaneAttributes(plane);

  // set extra info
  const { originalPosition, randomValues } = getPlaneExtraInfo(plane);
  extraInfo.originalPosition = originalPosition;
  extraInfo.randomValues = randomValues;
}

export const setPlaneColor = (
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
