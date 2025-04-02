import type { CharacterAI } from '../types/ai';

/**
 * 获取示例角色AI数据
 */
export function getExampleAI(): CharacterAI {
  return {
    id: 'example-character-ai',
    name: '战士AI示例',
    rules: [
      {
        id: 'rule-1',
        priority: 10,
        condition: {
          id: 'condition-1',
          type: 'HEALTH_BELOW',
          params: {
            percent: 30
          }
        },
        action: {
          id: 'action-1',
          type: 'HEAL',
          params: {
            amount: 30
          }
        }
      },
      {
        id: 'rule-2',
        priority: 5,
        condition: {
          id: 'condition-2',
          type: 'ENEMY_NEARBY',
          params: {
            range: 3
          }
        },
        action: {
          id: 'action-2',
          type: 'ATTACK',
          params: {
            target: 'nearest'
          }
        }
      },
      {
        id: 'rule-3',
        priority: 2,
        condition: {
          id: 'condition-3',
          type: 'ENEMY_COUNT',
          params: {
            count: 3,
            range: 5
          }
        },
        action: {
          id: 'action-3',
          type: 'CAST_SKILL',
          params: {
            skillId: 'frost_nova',
            target: 'self'
          }
        }
      }
    ]
  };
}