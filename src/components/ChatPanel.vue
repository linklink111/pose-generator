<template>
    <div class="chat-panel">
      <h3>Chat with Language Model</h3>
      <div class="model-selection">
        <label for="model-select">Select Model:</label>
        <select id="model-select" v-model="selectedModel">
          <option value="command-r-plus-08-2024" selected>Command-R-Plus-08-2024</option>
          <option value="chatgpt">ChatGPT</option>
        </select>
      </div>
      <div class="chat-history">
        <div v-for="(message, index) in chatHistory" :key="index" :class="['chat-message', message.role]">
          {{ message.content }}
        </div>
      </div>
      <div class="input-container">
        <input v-model="userPrompt" type="text" placeholder="Enter your prompt..." @keyup.enter="sendPrompt" />
        <button @click="sendPrompt">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  import generatePose from '@/utils/poseGenerator.js'; // 引入生成姿势的模块
  
  export default {
    data() {
      return {
        userPrompt: '',
        chatHistory: [],
        selectedModel: 'command-r-plus-08-2024', // 默认选择的模型
      };
    },
    methods: {
      async sendPrompt() {
        if (this.userPrompt.trim() === '') return;
  
        // 添加用户消息到聊天历史
        this.chatHistory.push({ role: 'user', content: this.userPrompt });
  
        // 发送用户提示到语言模型
        try {
          const responseText = await generatePose(this.userPrompt, this.selectedModel);
          this.chatHistory.push({ role: 'assistant', content: responseText });
        } catch (error) {
          this.chatHistory.push({ role: 'assistant', content: 'Error: ' + error.message });
        }
  
        // 清空输入框
        this.userPrompt = '';
  
        // 自动滚动到底部
        this.$nextTick(() => {
          const chatHistoryContainer = this.$el.querySelector('.chat-history');
          chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-panel {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
    /* 防止横向滚动条 */
  }
  
  h3 {
    margin-bottom: 20px;
  }
  
  .model-selection {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    width: 100%;
    /* 确保内容不会超出容器宽度 */
  }
  
  .model-selection label {
    display: block;
    margin-bottom: 5px;
  }
  
  .model-selection select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .chat-history {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
  }
  
  .chat-message {
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 4px;
  }
  
  .chat-message.user {
    background-color: #e6f7ff;
  }
  
  .chat-message.assistant {
    background-color: #f7f7f7;
  }
  
  .input-container {
    display: flex;
    gap: 10px;
  }
  
  .input-container input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .input-container button {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .input-container button:hover {
    background-color: #0056b3;
  }
  </style>