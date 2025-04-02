import * as Blockly from 'blockly';
import 'blockly/javascript';
// 设置语言包 - 中文
// import * as zhHans from 'blockly/msg/zh-hans';
// Blockly.setLocale(zhHans);

import type { CharacterAI, Rule, Condition, Action } from '../types/ai';
// import { ConditionType, ActionType } from '../types/ai';

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * 初始化Blockly工作区
 */
export function initBlockly(container: HTMLElement): Blockly.WorkspaceSvg {
  return Blockly.inject(container, {
    toolbox: getToolbox(),
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true
  });
}

/**
 * 获取工具箱配置
 */
export function getToolbox(): string {
  return `
    <xml id="toolbox" style="display: none">
      <category name="规则" colour="#5C81A6">
        <block type="rule_block"></block>
      </category>
      <category name="条件" colour="#5CA65C">
        <block type="condition_health_below"></block>
        <block type="condition_health_above"></block>
        <block type="condition_mana_below"></block>
        <block type="condition_mana_above"></block>
        <block type="condition_enemy_nearby"></block>
        <block type="condition_enemy_count"></block>
      </category>
      <category name="动作" colour="#A65C5C">
        <block type="action_heal"></block>
        <block type="action_attack"></block>
        <block type="action_cast_skill"></block>
        <block type="action_move_to"></block>
        <block type="action_retreat"></block>
      </category>
    </xml>
  `;
}

/**
 * 将Blockly工作区导出为JSON
 */
export function exportToJson(workspace: Blockly.WorkspaceSvg): CharacterAI {
  const topBlocks = workspace.getTopBlocks(false);
  const rules: Rule[] = [];
  
  topBlocks.forEach(block => {
    if (block.type === 'rule_block') {
      const ruleId = generateId();
      
      // 获取条件块
      const conditionBlock = block.getInputTargetBlock('CONDITION');
      if (!conditionBlock) return;
      
      // 获取动作块
      const actionBlock = block.getInputTargetBlock('ACTION');
      if (!actionBlock) return;
      
      // 解析条件
      const condition = parseConditionBlock(conditionBlock);
      
      // 解析动作
      const action = parseActionBlock(actionBlock);
      
      // 获取优先级
      const priorityField = block.getFieldValue('PRIORITY');
      const priority = parseInt(priorityField, 10) || 0;
      
      // 创建规则并添加到列表
      rules.push({
        id: ruleId,
        condition,
        action,
        priority
      });
    }
  });
  
  // 按优先级排序规则
  rules.sort((a, b) => b.priority - a.priority);
  
  return {
    id: generateId(),
    name: '角色AI',
    rules
  };
}

/**
 * 解析条件块
 */
function parseConditionBlock(block: Blockly.Block): Condition {
  const conditionId = generateId();
  const type = block.type.replace('condition_', '').toUpperCase();
  const params: Record<string, any> = {};
  
  switch (type) {
    case 'HEALTH_BELOW':
    case 'HEALTH_ABOVE':
    case 'MANA_BELOW':
    case 'MANA_ABOVE':
      params.percent = parseFloat(block.getFieldValue('PERCENT')) || 0;
      break;
    case 'ENEMY_NEARBY':
      params.range = parseFloat(block.getFieldValue('RANGE')) || 0;
      break;
    case 'ENEMY_COUNT':
      params.count = parseInt(block.getFieldValue('COUNT'), 10) || 0;
      params.range = parseFloat(block.getFieldValue('RANGE')) || 0;
      break;
    default:
      break;
  }
  
  return {
    id: conditionId,
    type,
    params
  };
}

/**
 * 解析动作块
 */
function parseActionBlock(block: Blockly.Block): Action {
  const actionId = generateId();
  const type = block.type.replace('action_', '').toUpperCase();
  const params: Record<string, any> = {};
  
  switch (type) {
    case 'HEAL':
      params.amount = parseFloat(block.getFieldValue('AMOUNT')) || 0;
      break;
    case 'ATTACK':
      params.target = block.getFieldValue('TARGET') || 'nearest';
      break;
    case 'CAST_SKILL':
      params.skillId = block.getFieldValue('SKILL_ID') || '';
      params.target = block.getFieldValue('TARGET') || 'nearest';
      break;
    case 'MOVE_TO':
      params.target = block.getFieldValue('TARGET') || 'nearest';
      break;
    case 'RETREAT':
      params.distance = parseFloat(block.getFieldValue('DISTANCE')) || 0;
      break;
    default:
      break;
  }
  
  return {
    id: actionId,
    type,
    params
  };
}

/**
 * 从JSON导入到Blockly工作区
 */
export function importFromJson(workspace: Blockly.WorkspaceSvg, data: CharacterAI): void {
  // 先清空工作区
  workspace.clear();
  
  // 遍历规则并创建对应的积木块
  if (data.rules && Array.isArray(data.rules)) {
    data.rules.forEach((rule, index) => {
      try {
        console.log(`开始加载规则 ${index + 1}:`, rule);
        
        // 创建规则块
        const ruleBlock = workspace.newBlock('rule_block');
        ruleBlock.setFieldValue(rule.priority.toString(), 'PRIORITY');
        
        // 创建条件块
        if (rule.condition) {
          console.log(`加载条件:`, rule.condition);
          const conditionType = rule.condition.type.toLowerCase();
          const conditionBlockType = `condition_${conditionType}`;
          console.log(`创建条件块类型:`, conditionBlockType);
          
          try {
            const conditionBlock = workspace.newBlock(conditionBlockType);
            
            // 设置条件块的参数
            setConditionBlockFields(conditionBlock, rule.condition);
            
            // 初始化条件块
            conditionBlock.initSvg();
            conditionBlock.render();
            
            // 连接条件块到规则块
            const conditionConnection = ruleBlock.getInput('CONDITION')?.connection;
            const conditionOutputConnection = conditionBlock.outputConnection;
            if (conditionConnection && conditionOutputConnection) {
              conditionConnection.connect(conditionOutputConnection);
            } else {
              console.error('无法连接条件块到规则块', { 
                conditionConnection, 
                conditionOutputConnection 
              });
            }
          } catch (e) {
            console.error(`创建条件块 ${conditionBlockType} 时出错:`, e);
          }
        }
        
        // 创建动作块
        if (rule.action) {
          console.log(`加载动作:`, rule.action);
          const actionType = rule.action.type.toLowerCase();
          const actionBlockType = `action_${actionType}`;
          console.log(`创建动作块类型:`, actionBlockType);
          
          try {
            const actionBlock = workspace.newBlock(actionBlockType);
            
            // 设置动作块的参数
            setActionBlockFields(actionBlock, rule.action);
            
            // 初始化动作块
            actionBlock.initSvg();
            actionBlock.render();
            
            // 连接动作块到规则块
            const actionConnection = ruleBlock.getInput('ACTION')?.connection;
            const actionOutputConnection = actionBlock.outputConnection;
            if (actionConnection && actionOutputConnection) {
              actionConnection.connect(actionOutputConnection);
            } else {
              console.error('无法连接动作块到规则块', { 
                actionConnection, 
                actionOutputConnection 
              });
            }
          } catch (e) {
            console.error(`创建动作块 ${actionBlockType} 时出错:`, e);
          }
        }
        
        // 放置规则块
        ruleBlock.initSvg();
        ruleBlock.render();
        ruleBlock.moveBy(20, 20 + index * 100);
        
        console.log(`规则 ${index + 1} 加载完成`);
      } catch (error) {
        console.error(`加载规则 ${index + 1} 时出错:`, error);
      }
    });
  }
}

/**
 * 设置条件块的字段值
 */
function setConditionBlockFields(block: Blockly.Block, condition: Condition): void {
  switch (condition.type) {
    case 'HEALTH_BELOW':
    case 'HEALTH_ABOVE':
    case 'MANA_BELOW':
    case 'MANA_ABOVE':
      if (condition.params.percent !== undefined) {
        block.setFieldValue(condition.params.percent.toString(), 'PERCENT');
      }
      break;
    case 'ENEMY_NEARBY':
      if (condition.params.range !== undefined) {
        block.setFieldValue(condition.params.range.toString(), 'RANGE');
      }
      break;
    case 'ENEMY_COUNT':
      if (condition.params.count !== undefined) {
        block.setFieldValue(condition.params.count.toString(), 'COUNT');
      }
      if (condition.params.range !== undefined) {
        block.setFieldValue(condition.params.range.toString(), 'RANGE');
      }
      break;
  }
}

/**
 * 设置动作块的字段值
 */
function setActionBlockFields(block: Blockly.Block, action: Action): void {
  switch (action.type) {
    case 'HEAL':
      if (action.params.amount !== undefined) {
        block.setFieldValue(action.params.amount.toString(), 'AMOUNT');
      }
      break;
    case 'ATTACK':
      if (action.params.target !== undefined) {
        block.setFieldValue(action.params.target, 'TARGET');
      }
      break;
    case 'CAST_SKILL':
      if (action.params.skillId !== undefined) {
        block.setFieldValue(action.params.skillId, 'SKILL_ID');
      }
      if (action.params.target !== undefined) {
        block.setFieldValue(action.params.target, 'TARGET');
      }
      break;
    case 'MOVE_TO':
      if (action.params.target !== undefined) {
        block.setFieldValue(action.params.target, 'TARGET');
      }
      break;
    case 'RETREAT':
      if (action.params.distance !== undefined) {
        block.setFieldValue(action.params.distance.toString(), 'DISTANCE');
      }
      break;
  }
}