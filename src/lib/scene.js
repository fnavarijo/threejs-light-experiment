import enable3d from 'enable3d';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { withPhysics } from './physics';

const THREE = enable3d.THREE;

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const withScene = ({ sceneBackground = 0xffffff } = {}) => sandbox => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(sceneBackground);

  return {
    ...sandbox,
    get scene () {
      return scene;
    },
  }
}

const withCamera = ({
    clientWidth,
    clientHeight,
    position: {
      x = 5,
      y = 5,
      z = 5,
    } = {}
  } = {}) => sandbox => {
  const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
  
  camera.position.x = x;
  camera.position.y = y;
  camera.position.z = z;

  return {
    ...sandbox,
    get camera () {
      return camera;
    }
  }
}

const withRenderer = ({ clientWidth, clientHeight, addShadow = false }) => sandbox => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(clientWidth, clientHeight);

  if (addShadow) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  return {
    ...sandbox,
    get renderer () {
      return renderer;
    }
  }
}

const withAmbientLight = sandbox => {
  const { scene } = sandbox;
  const ambientLight = new THREE.AmbientLight(0x000000);

  scene.add(ambientLight);

  return {
    ...sandbox,
  };
}

const withPointLight = sandbox => {
  const { scene } = sandbox;
  const sceneLight = new THREE.PointLight(0xffffff, 1, 100);
  sceneLight.position.set(5, 5, 5);

  scene.add(sceneLight);

  return {
    ...sandbox,
  };
}

const withSpotLight = ({ lightColor = 0xffffff, addShadow = false, }) => sandbox => {
  const { scene } = sandbox;
  const light = new THREE.SpotLight(lightColor);

  if (addShadow) {
    light.castShadow = true;
  }

  light.position.y = 10;

  scene.add(light);

  return {
    ...sandbox,
    get light () {
      return light;
    },
  };
}

// TODO: Improve this.
const withPlane = ({ addShadow = false }) => sandbox => {
  const { scene } = sandbox;
  let plane = null;

  return {
    ...sandbox,
    addPlane ({
      dimensions: {
        width = 5,
        height = 5,
        widthSegments = 5,
      } = {},
      color = 0xffffff,
      side
    } = {}) {
      const planeGeometry = new THREE.PlaneBufferGeometry(width, height, widthSegments);
      // TODO: validate side and merge to object
      const planeMaterial = new THREE.MeshStandardMaterial({ color, side });
      plane = new THREE.Mesh(planeGeometry, planeMaterial);

      if (addShadow) {
        plane.receiveShadow = true;
      }

      scene.add(plane);
      return plane;
    }
  };
};

const withAxesHelper = sandbox => {
  const { scene } = sandbox;

  return {
    ...sandbox,
    addAxesHelper ({ size = 1 } = {}) {
      const axesHelper = new THREE.AxesHelper(size);
      scene.add(axesHelper);
    }
  }
}

const withCameraHelper = sandbox => {
  const { light, scene } = sandbox;
  const helper = new THREE.CameraHelper(light.shadow.camera)
  scene.add(helper);
  
  return {
    ...sandbox,
  };
}

const withOrbitControls = sandbox => {
  const { camera, renderer } = sandbox;
  const controls = new OrbitControls(camera, renderer.domElement);

  return {
    ...sandbox,
    get controls () {
      return controls;
    }
  }
}

const withAnimation = sandbox => {
  // TODO: validate if controls exist before updating
  const { controls, renderer, scene, camera, physics } = sandbox;
  
  // TODO: find a way to merge animate depending on scene configured.
  const clock = new THREE.Clock();

  return {
    ...sandbox,
    animate () {
      controls.update();

      physics.update(clock.getDelta() * 1000);
      physics.updateDebugger();

      renderer.render(scene, camera);

      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }
  };
}

const createJengaScene = ({
  clientWidth,
  clientHeight,
  cameraPosition,
  sceneBackground,
  addShadow,
  iluminationColor
}) => pipe(
  withScene({ sceneBackground }),
  withCamera({ clientWidth, clientHeight, position: cameraPosition }),
  withRenderer({ clientWidth, clientHeight, addShadow }),
  // withAmbientLight,
  // withPointLight,
  withPhysics,
  withSpotLight({ addShadow, lightColor: iluminationColor }),
  withPlane({ addShadow }),
  withOrbitControls,
  withAnimation,
  withAxesHelper,
  withCameraHelper,
)({});

export {
  createJengaScene,
};

