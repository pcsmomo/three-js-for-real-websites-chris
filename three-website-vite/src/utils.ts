import * as THREE from 'three';

// Types
import { PlaneMesh, World } from './types';

export function getNewPosition(arrayToCopy: Array<number>) {
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

export function generatePlane(plane: PlaneMesh, world: World) {
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
