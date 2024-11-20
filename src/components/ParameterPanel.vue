<template>
    <div class="parameter-panel">
      <h3>Parameters</h3>
      <div class="parameter-list">
        <div class="parameter-item">
          <label for="light-intensity">Light Intensity:</label>
          <input id="light-intensity" type="number" v-model.number="lightIntensity" min="0" max="10" step="0.1" />
        </div>
        <div class="parameter-item">
          <label for="camera-position-x">Camera X Position:</label>
          <input id="camera-position-x" type="number" v-model.number="cameraPositionX" />
        </div>
        <div class="parameter-item">
          <label for="camera-position-y">Camera Y Position:</label>
          <input id="camera-position-y" type="number" v-model.number="cameraPositionY" />
        </div>
        <div class="parameter-item">
          <label for="camera-position-z">Camera Z Position:</label>
          <input id="camera-position-z" type="number" v-model.number="cameraPositionZ" />
        </div>
      </div>
      <div class="code-editor">
        <label for="code-input">Code:</label>
        <textarea id="code-input" v-model="code" rows="10" placeholder="rotate, mixamorig1LeftArm, x, 60"></textarea>
        
        <button @click="resetCode">Reset</button>
        <button @click="saveCode">Save</button>
        <button @click="submitCode">Go</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    setup() {
      const store = useStore();
  
      const lightIntensity = ref(1.0);
      const cameraPositionX = ref(0);
      const cameraPositionY = ref(5);
      const cameraPositionZ = ref(10);
      const code = ref('rotate, mixamorig1LeftArm, x, 60\n');
  
      const submitCode = () => {
        const lines = code.value.split('\n').filter(line => line.trim() !== '');
        // 清空之前的操作
        store.commit('clearOperations');
        
        lines.forEach(line => {
          const [operation, boneName, direction, quantity] = line.split(', ').map(s => s.trim());
          if (operation && boneName && direction && quantity) {
            store.commit('addOperation', { operation, boneName, direction, quantity });
            console.log(line);
          }
        });
        // 获取并打印 store 中的 skeletonOperations
        console.log('Current skeletonOperations:', store.state.skeletonOperations);
      };
  
      watch(lightIntensity, (newVal) => {
        store.dispatch('updateLightIntensity', newVal);
      });
  
      watch(cameraPositionX, (newVal) => {
        store.dispatch('updateCameraPosition', { x: newVal, y: cameraPositionY.value, z: cameraPositionZ.value });
      });
  
      watch(cameraPositionY, (newVal) => {
        store.dispatch('updateCameraPosition', { x: cameraPositionX.value, y: newVal, z: cameraPositionZ.value });
      });
  
      watch(cameraPositionZ, (newVal) => {
        store.dispatch('updateCameraPosition', { x: cameraPositionX.value, y: cameraPositionY.value, z: newVal });
      });
  
      return {
        lightIntensity,
        cameraPositionX,
        cameraPositionY,
        cameraPositionZ,
        code,
        submitCode
      };
    }
  };
  </script>
  
  <style scoped>
  .parameter-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .parameter-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .parameter-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  label {
    flex: 1;
  }
  
  input {
    flex: 1;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .code-editor {
    margin-top: 20px;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: monospace;
    font-size: 14px;
    resize: vertical; /* 允许垂直调整大小 */
  }
  </style>