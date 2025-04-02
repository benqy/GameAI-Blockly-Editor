import * as Blockly from 'blockly';
import 'blockly/javascript';
// 设置语言包 - 中文
// import * as zhHans from 'blockly/msg/zh-hans';
// Blockly.setLocale(zhHans);

import type { CharacterAI, Rule, Condition, Action } from '../types/ai';
import { ConditionType, ActionType } from '../types/ai';

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