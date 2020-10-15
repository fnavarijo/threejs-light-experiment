<template>
  <div
    class="jenga-component"
    id="jenga"
  />
</template>

<script>
import * as THREE from 'three';

import { createJengaScene } from '../lib/scene';

export default {
  name: 'JengaComponent',
  mounted () {
    // TODO: Add physics
    const jengaFrame = document.getElementById('jenga');

    const { clientWidth, clientHeight } = jengaFrame;
    const cameraPosition = {
      x: 5,
      y: 5,
      z: 5,
    };

    const jengaScene = createJengaScene({
      clientWidth,
      clientHeight,
      cameraPosition,
      sceneBackground: 0xeef9bf,
      addShadow: true,
      iluminationColor: 0xffffff,
    });

    jengaFrame.appendChild(jengaScene.renderer.domElement);

    const plane = jengaScene.addPlane({
      dimensions: {
        width: 20,
        height: 20,
      },
      color: 0x008080,
      side: THREE.DoubleSide,
    })
    plane.rotateX(degToRad(90));
    jengaScene.camera.lookAt(plane.position);

    const blockGeometry = new THREE.BoxBufferGeometry(1, 1, 4);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0xff7f7f });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.y = 0.8;
    // TODO: Abstract to method
    block.castShadow = true;
    block.receiveShadow = false;
    jengaScene.scene.add(block);

    // let row = 1;
    // for (let blockIndex = 1; blockIndex <= 6; blockIndex++) {
    //   const blockGeometry = new THREE.BoxGeometry(1, 1, 4);
    //   const blockMaterial = new THREE.MeshLambertMaterial({ color: 0x75b79e });
    //   const block = new THREE.Mesh(blockGeometry, blockMaterial);
    //   scene.add(block);
  
    //   // TODO: should add new levels on structure
    //   block.position.y = (0.5 * row);
    //   block.position.x = (1.10 * (blockIndex % 3 + 1)) - 2.30;
    //   if ((blockIndex % 3) === 0) { row++; }
    // }

    jengaScene.addAxesHelper({ size: 5 });

    jengaScene.animate();

    function degToRad (deg) {
      return (deg * Math.PI) / 180;
    }
  },
}
</script>

<style>
.jenga-component {
  height: 100vh;
  width: 100%;
}
</style>