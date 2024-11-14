<template>
  <div class="generator">
    <div class="content">
      <CharacterPreview />
    </div>
    <ControlPanel />
  </div>
</template>

<script>
import CharacterPreview from '@/components/CharacterPreview.vue';
import ControlPanel from '@/components/ControlPanel.vue';

export default {
  name: 'PoseGenerator',
  components: {
    CharacterPreview,
    ControlPanel
  }
};
</script>

<style scoped>
.generator {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 1rem;
  background-color: #f0f0f0; /* 背景颜色可以根据需要调整 */
}

.content {
  flex: 1;
  position: relative;
  padding-right: 1050px; /* 为 ControlPanel 留出更多空间 */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-panel {
  position: fixed;
  top: 100px; /* 距离顶部的距离 */
  right: 20px; /* 距离右侧的距离 */
  width: 1000px; /* 控制面板的宽度增加 */
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 确保控制面板在其他内容之上 */
}
</style>