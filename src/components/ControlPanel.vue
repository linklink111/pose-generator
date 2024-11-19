<template>
    <div class="control-panel">
      <div class="panel-section chat-panel">
        <ChatPanel />
      </div>
      <div class="panel-section parameter-panel">
        <ParameterPanel />
      </div>
    </div>
  </template>
  
  <script>
  import ChatPanel from './ChatPanel.vue';
  import ParameterPanel from './ParameterPanel.vue';
  
  export default {
    components: {
      ChatPanel,
      ParameterPanel
    }
  };
  </script>
  
  <style scoped>
  .control-panel {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%; /* 将宽度设置为100%，以充分利用可用空间 */
    height: 500px;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .panel-section {
    margin: 0 5px;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    overflow: auto; /* 防止内容溢出 */
  }
  
  .chat-panel {
    flex: 2.5; /* ChatPanel 占用更多的宽度 */
  }
  
  .parameter-panel {
    flex: 1; /* ParameterPanel 占用较少的宽度 */
  }
  </style>