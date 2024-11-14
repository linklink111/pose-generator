<template>
    <div class="app-container">
      <!-- Chat Interface okay-->
      <div class="chat-interface">
        <h2>Chat Interface</h2>
        <!-- 这里可以放置聊天消息列表、输入框等元素 -->
        <div class="messages">
          <p>Message 1</p>
          <p>Message 2</p>
          <!-- 更多消息... -->
        </div>
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
  
      <!-- Control Panel -->
      <div class="control-panel">
        <h2>Control Panel</h2>
        <div class="section">
          <label for="pose-input">Pose Input:</label>
          <input type="text" id="pose-input" v-model="poseInput" />
          <button @click="generatePose">Generate Pose</button>
        </div>
        <div class="section">
          <label for="character-select">Character:</label>
          <select id="character-select" v-model="selectedCharacter">
            <option value="character1">Character 1</option>
            <option value="character2">Character 2</option>
          </select>
        </div>
        <div class="section">
          <label for="outfit-select">Outfit:</label>
          <select id="outfit-select" v-model="selectedOutfit">
            <option value="outfit1">Outfit 1</option>
            <option value="outfit2">Outfit 2</option>
          </select>
        </div>
        <div class="section">
          <label for="expression-select">Expression:</label>
          <select id="expression-select" v-model="selectedExpression">
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
          </select>
        </div>
        <div class="section">
          <button @click="savePose">Save Pose</button>
          <button @click="sharePose">Share Pose</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        poseInput: '',
        selectedCharacter: 'character1',
        selectedOutfit: 'outfit1',
        selectedExpression: 'happy'
      };
    },
    methods: {
      generatePose() {
        console.log('Generating pose with input:', this.poseInput);
      },
      savePose() {
        console.log('Saving pose');
      },
      sharePose() {
        console.log('Sharing pose');
      }
    }
  };
  </script>
  
  <style scoped>
  .app-container {
    display: flex; /* 使用 Flexbox */
    justify-content: space-between; /* 两端对齐 */
    gap: 20px; /* 两栏之间的间距 */
  }
  
  .chat-interface, .control-panel {
    flex: 1; /* 让每个子元素占据相等的空间 */
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .chat-interface {
    background-color: #f9f9f9; /* 可选：为 chat 面板设置背景色 */
  }
  
  .control-panel {
    width: 300px; /* 设置 control panel 的宽度 */
  }
  
  .section {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input, select, button {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
  </style>