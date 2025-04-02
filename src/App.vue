<script setup lang="ts">
import BlocklyEditor from './components/blockly/BlocklyEditor.vue';
import HelpGuide from './components/blockly/HelpGuide.vue';
import { ref } from 'vue';

const showHelp = ref(true);
const toggleHelp = () => {
  showHelp.value = !showHelp.value;
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>2D ARPG 角色AI编辑器</h1>
      <p class="app-description">使用Blockly可视化编辑角色AI行为，配置完成后可导出为JSON格式</p>
      <button class="btn-help" @click="toggleHelp">帮助</button>
    </header>
    
    <main class="app-content">
      <BlocklyEditor />
    </main>
    
    <footer class="app-footer">
      <p>© 2025 ARPG游戏AI编辑器 - 基于Vue3 + TypeScript + UnoCSS + Blockly构建</p>
    </footer>
    
    <HelpGuide v-if="showHelp" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.app-header {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.app-header h1 {
  font-size: 2.5rem;
  color: #3a3a3a;
  margin-bottom: 10px;
}

.app-description {
  color: #666;
  font-size: 1.2rem;
}

.btn-help {
  position: absolute;
  right: 0;
  top: 0;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-footer {
  margin-top: 20px;
  text-align: center;
  padding: 20px 0;
  color: #888;
  font-size: 0.9rem;
}
</style>
