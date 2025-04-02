<!-- Blockly编辑器组件 -->
<template>
  <div class="blockly-editor">
    <div class="editor-toolbar">
      <button class="btn-load-example" @click="loadExample">加载示例</button>
      <button class="btn-save" @click="saveAI">保存AI</button>
      <button class="btn-load" @click="loadAI">加载AI</button>
    </div>
    
    <div class="blockly-container" ref="blocklyContainer"></div>
    
    <div class="blockly-controls">
      <button class="btn-export" @click="exportJSON">导出JSON</button>
      <button class="btn-clear" @click="clearWorkspace">清空工作区</button>
    </div>
    
    <div v-if="showJson" class="json-output">
      <h3>JSON 输出:</h3>
      <pre>{{ jsonOutput }}</pre>
      <button class="btn-copy" @click="copyToClipboard">复制JSON</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as Blockly from 'blockly';
import { initBlockly, exportToJson, importFromJson } from '../../utils/blockly-utils';
import { registerCustomBlocks } from '../../utils/blockly-blocks';
import { getExampleAI } from '../../utils/ai-examples';
import type { CharacterAI } from '../../types/ai';

// 声明Blockly容器引用
const blocklyContainer = ref<HTMLElement | null>(null);

// 定义工作区
let workspace: Blockly.WorkspaceSvg | null = null;

// JSON输出
const jsonOutput = ref<string>('');
const showJson = ref<boolean>(false);

// 导出到JSON
const exportJSON = () => {
  if (!workspace) return;

  const aiData: CharacterAI = exportToJson(workspace);
  jsonOutput.value = JSON.stringify(aiData, null, 2);
  showJson.value = true;
};

// 清空工作区
const clearWorkspace = () => {
  if (workspace) {
    workspace.clear();
    showJson.value = false;
    jsonOutput.value = '';
  }
};

// 加载示例AI
const loadExample = () => {
  if (workspace) {
    if (confirm('这将清除当前工作区并加载示例AI，确定要继续吗？')) {
      const exampleAI = getExampleAI();
      
      // 从示例AI数据创建Blockly块
      importFromJson(workspace, exampleAI);
      
      // 显示JSON输出
      jsonOutput.value = JSON.stringify(exampleAI, null, 2);
      showJson.value = true;
    }
  }
};

// 保存AI数据
const saveAI = () => {
  if (!workspace) return;
  
  const aiData = exportToJson(workspace);
  const dataStr = JSON.stringify(aiData);
  
  try {
    localStorage.setItem('characterAI', dataStr);
    alert('AI数据已成功保存到本地存储！');
  } catch (e) {
    console.error('保存AI数据失败:', e);
    alert('保存AI数据失败，请检查控制台获取更多信息。');
  }
};

// 加载AI数据
const loadAI = () => {
  if (!workspace) return;
  
  try {
    const dataStr = localStorage.getItem('characterAI');
    if (!dataStr) {
      alert('未找到保存的AI数据！');
      return;
    }
    
    if (confirm('这将清除当前工作区并加载保存的AI，确定要继续吗？')) {
      const aiData = JSON.parse(dataStr) as CharacterAI;
      
      // 从保存的AI数据创建Blockly块
      importFromJson(workspace, aiData);
      
      // 显示JSON输出
      jsonOutput.value = JSON.stringify(aiData, null, 2);
      showJson.value = true;
      
      alert('AI数据已加载！');
    }
  } catch (e) {
    console.error('加载AI数据失败:', e);
    alert('加载AI数据失败，请检查控制台获取更多信息。');
  }
};

// 复制JSON到剪贴板
const copyToClipboard = () => {
  navigator.clipboard.writeText(jsonOutput.value)
    .then(() => {
      alert('JSON已复制到剪贴板！');
    })
    .catch(err => {
      console.error('复制失败:', err);
      alert('复制失败，请手动选择并复制。');
    });
};

// 组件挂载时初始化Blockly
onMounted(() => {
  console.log('组件挂载，开始初始化Blockly');
  
  // 注册自定义Blockly块
  registerCustomBlocks();

  // 为确保DOM已完全渲染，使用setTimeout延迟初始化
  setTimeout(() => {
    if (blocklyContainer.value) {
      console.log('开始初始化Blockly工作区');
      try {
        // 确保容器有足够高度
        if (blocklyContainer.value.offsetHeight < 100) {
          console.warn('Blockly容器高度不足，设置为500px');
          blocklyContainer.value.style.height = '500px';
        }
        
        // 初始化工作区
        workspace = initBlockly(blocklyContainer.value);
        console.log('Blockly工作区初始化成功');
        
        // 监听工作区变化时隐藏JSON输出
        workspace.addChangeListener(() => {
          if (showJson.value) {
            showJson.value = false;
          }
        });
        
        // 调整工作区大小以适应容器
        window.addEventListener('resize', () => {
          if (workspace) {
            console.log('调整Blockly工作区大小');
            Blockly.svgResize(workspace);
          }
        });
        
        // 初始调整大小
        Blockly.svgResize(workspace);
        console.log('初始调整Blockly工作区大小完成');
      } catch (error) {
        console.error('初始化Blockly失败:', error);
      }
    } else {
      console.error('Blockly容器元素不存在');
    }
  }, 200); // 增加延迟时间确保DOM完全渲染
});

// 组件卸载时销毁工作区
onUnmounted(() => {
  if (workspace) {
    workspace.dispose();
  }
});
</script>

<style scoped>
.blockly-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.blockly-container {
  flex: 1;
  height: 500px;  /* 强制设置固定高度 */
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
  position: relative;
  overflow: visible;  /* 修改为可见溢出，以确保工具箱可以显示 */
}

/* 确保Blockly SVG元素正确显示 */
:deep(.blocklyToolboxDiv) {
  background-color: #f5f5f5;
  color: #333;
  overflow-y: auto;
  padding: 0.5em;
}

:deep(.blocklyFlyout) {
  background-color: #eaeaea;
}

:deep(.blocklyMainBackground) {
  stroke: none !important;
}

:deep(.blocklyTreeLabel) {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.blockly-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.btn-export, .btn-clear, .btn-save, .btn-load, .btn-load-example, .btn-copy {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.btn-export {
  background-color: #4CAF50;
  color: white;
}

.btn-clear {
  background-color: #f44336;
  color: white;
}

.btn-save {
  background-color: #2196F3;
  color: white;
}

.btn-load, .btn-load-example {
  background-color: #FF9800;
  color: white;
}

.btn-copy {
  background-color: #9C27B0;
  color: white;
  margin-top: 10px;
}

.json-output {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  max-height: 300px;
  overflow: auto;
}

.json-output h3 {
  margin-top: 0;
  margin-bottom: 8px;
}

.json-output pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>