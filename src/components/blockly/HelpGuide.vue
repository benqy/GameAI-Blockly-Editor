<!-- 帮助指南组件 -->
<template>
  <div class="help-guide" v-if="isVisible">
    <div class="help-content">
      <h2>角色AI编辑器使用指南</h2>
      
      <div class="help-section">
        <h3>基本操作</h3>
        <ul>
          <li>从左侧工具箱拖拽积木块到工作区</li>
          <li>先拖拽一个"规则"块，然后在规则块中添加"条件"和"动作"</li>
          <li>设置规则的优先级（数字越大优先级越高）</li>
          <li>可以添加多个规则，系统会按优先级顺序执行</li>
        </ul>
      </div>
      
      <div class="help-section">
        <h3>条件说明</h3>
        <ul>
          <li><strong>血量低于/高于</strong>: 角色当前血量百分比低于/高于指定值时触发</li>
          <li><strong>魔法低于/高于</strong>: 角色当前魔法值百分比低于/高于指定值时触发</li>
          <li><strong>敌人在范围内</strong>: 当有敌人在指定范围内时触发</li>
          <li><strong>敌人数量</strong>: 当指定范围内敌人数量大于指定值时触发</li>
        </ul>
      </div>
      
      <div class="help-section">
        <h3>动作说明</h3>
        <ul>
          <li><strong>治疗</strong>: 恢复指定数量的生命值</li>
          <li><strong>攻击</strong>: 对指定目标进行普通攻击</li>
          <li><strong>释放技能</strong>: 对指定目标使用特定技能</li>
          <li><strong>移动到</strong>: 移动到指定目标位置</li>
          <li><strong>撤退</strong>: 远离敌人指定距离</li>
        </ul>
      </div>
      
      <div class="help-section">
        <h3>例子</h3>
        <p>创建一个简单的战斗AI规则：</p>
        <ol>
          <li>如果血量低于30%，则治疗自身</li>
          <li>如果敌人在3格范围内，则攻击最近的敌人</li>
          <li>如果5格范围内敌人数量大于3，则使用冰霜新星</li>
        </ol>
        <p>点击"加载示例"按钮可以查看预设的AI示例。</p>
      </div>
      
      <button class="btn-close" @click="close">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(true);

const close = () => {
  isVisible.value = false;
};
</script>

<style scoped>
.help-guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.help-content {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.help-content h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 8px;
}

.help-section {
  margin-bottom: 20px;
}

.help-section h3 {
  color: #4CAF50;
  margin-bottom: 8px;
}

.help-section ul, .help-section ol {
  padding-left: 20px;
}

.help-section li {
  margin-bottom: 4px;
}

.btn-close {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
  font-weight: bold;
}

.btn-close:hover {
  background-color: #3d8b40;
}
</style>