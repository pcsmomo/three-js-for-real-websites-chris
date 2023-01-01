export type PlaneMesh = THREE.Mesh<
  THREE.PlaneGeometry,
  THREE.MeshPhongMaterial
>;

export interface World {
  plane: {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
    r: number;
    g: number;
    b: number;
  };
}

export interface PlaneMeshExtraInfo {
  originalPosition: ArrayLike<number>;
  randomValues: Array<number>;
}
