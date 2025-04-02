# GameAI-Blockly-Editor

一个基于Blockly的2D ARPG游戏角色AI可视化编辑器，使用Vue3、TypeScript和UnoCSS构建。

## 功能特点

- 使用Blockly可视化编辑界面，拖拽式设计游戏角色AI行为
- 支持多种条件判断（生命值、魔法值、敌人距离等）
- 支持多种行动指令（攻击、施法、移动、撤退等）
- 规则优先级设置，实现复杂AI决策逻辑
- 导出为JSON格式，方便游戏集成
- 支持本地保存和加载AI配置

## 技术栈

- Vue 3
- TypeScript
- UnoCSS
- Blockly

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 构建项目
npm run build
```

## 使用说明

1. 从左侧工具箱拖拽"规则"块到中间工作区
2. 添加条件和动作块到规则中
3. 设置条件参数和动作参数
4. 添加多个规则并设置优先级
5. 点击"导出JSON"获取AI配置数据

## JSON格式

```json
{
  "id": "unique-id",
  "name": "角色AI",
  "rules": [
    {
      "id": "rule-id",
      "priority": 10,
      "condition": {
        "id": "condition-id",
        "type": "HEALTH_BELOW",
        "params": {
          "percent": 30
        }
      },
      "action": {
        "id": "action-id",
        "type": "HEAL",
        "params": {
          "amount": 20
        }
      }
    }
  ]
}
```

## 许可证

MIT
