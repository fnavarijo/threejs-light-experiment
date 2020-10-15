<template>
  <!-- <div v-if="!isGameStarted">
    <JengaWelcome  />
    <button class="button" @click="startGame">Start game</button>
  </div> -->
  <!-- TODO: add animation on starting game -->
  <JengaComponent />
</template>

<script>
import { ref } from 'vue';

import JengaWelcome from './components/JengaWelcome.vue';
import JengaComponent from './components/JengaComponent.vue';

export default {
  name: 'App',
  components: {
    JengaWelcome,
    JengaComponent
  },
  setup () {
    let isGameStarted = ref(false);

    function startGame () {
      isGameStarted.value = true;
    }

    return { isGameStarted, startGame };
  }
}
</script>
