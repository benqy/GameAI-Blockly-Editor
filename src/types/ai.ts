/**
 * 角色AI类型定义
 */

// 条件类型
export interface Condition {
  id: string;
  type: string;
  params: Record<string, any>;
}

// 动作类型
export interface Action {
  id: string;
  type: string;
  params: Record<string, any>;
}

// 规则类型
export interface Rule {
  id: string;
  condition: Condition;
  action: Action;
  priority: number;
}

// 角色AI类型
export interface CharacterAI {
  id: string;
  name: string;
  rules: Rule[];
}

// 条件类型枚举
export enum ConditionType {
  HEALTH_BELOW = 'HEALTH_BELOW',
  HEALTH_ABOVE = 'HEALTH_ABOVE',
  MANA_BELOW = 'MANA_BELOW',
  MANA_ABOVE = 'MANA_ABOVE',
  ENEMY_NEARBY = 'ENEMY_NEARBY',
  ENEMY_COUNT = 'ENEMY_COUNT',
  COOLDOWN_READY = 'COOLDOWN_READY',
  HAS_BUFF = 'HAS_BUFF',
  HAS_DEBUFF = 'HAS_DEBUFF',
  DISTANCE_TO_ENEMY = 'DISTANCE_TO_ENEMY',
}

// 动作类型枚举
export enum ActionType {
  HEAL = 'HEAL',
  ATTACK = 'ATTACK',
  CAST_SKILL = 'CAST_SKILL',
  MOVE_TO = 'MOVE_TO',
  RETREAT = 'RETREAT',
  USE_ITEM = 'USE_ITEM',
  ACTIVATE_BUFF = 'ACTIVATE_BUFF',
}