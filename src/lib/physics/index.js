import enable3d from 'enable3d';
import enable3dAmmo from '@enable3d/ammo-physics';

const PhysicsLoader = enable3d.PhysicsLoader;
const AmmoPhysics = enable3dAmmo.AmmoPhysics;

export const withPhysics = sandbox => {
  const { scene } = sandbox;
  const physics = new AmmoPhysics(scene);
  physics.debug.enable(true);
  
  return {
    ...sandbox,
    get physics () {
      return physics;
    }
  };
}

// TODO: order better
// export const initPhysics = ammoPath => sceneCreator => {
//   PhysicsLoader(ammoPath, () => sceneCreator())
// }


