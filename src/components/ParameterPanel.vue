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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        lightIntensity: 1.0,
        cameraPositionX: 0,
        cameraPositionY: 5,
        cameraPositionZ: 10
      };
    },
    watch: {
      lightIntensity(newVal) {
        this.$emit('update-light-intensity', newVal);
      },
      cameraPositionX(newVal) {
        this.$emit('update-camera-position', { x: newVal, y: this.cameraPositionY, z: this.cameraPositionZ });
      },
      cameraPositionY(newVal) {
        this.$emit('update-camera-position', { x: this.cameraPositionX, y: newVal, z: this.cameraPositionZ });
      },
      cameraPositionZ(newVal) {
        this.$emit('update-camera-position', { x: this.cameraPositionX, y: this.cameraPositionY, z: newVal });
      }
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
  </style>