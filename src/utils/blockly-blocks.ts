import * as Blockly from 'blockly';
import { ConditionType, ActionType } from '../types/ai';

/**
 * 注册自定义Blockly块
 */
export function registerCustomBlocks(): void {
  // 注册规则块
  Blockly.Blocks['rule_block'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("规则")
          .appendField(new Blockly.FieldNumber(0, 0, 100), "PRIORITY")
          .appendField("优先级");
      this.appendValueInput("CONDITION")
          .setCheck(null)
          .appendField("如果");
      this.appendValueInput("ACTION")
          .setCheck(null)
          .appendField("则执行");
      this.setColour('#5C81A6');
      this.setTooltip("定义角色AI规则");
      this.setHelpUrl("");
    }
  };

  // 注册条件块 - 血量低于
  Blockly.Blocks['condition_health_below'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("血量低于")
          .appendField(new Blockly.FieldNumber(50, 0, 100), "PERCENT")
          .appendField("%");
      this.setOutput(true, null);
      this.setColour('#5CA65C');
      this.setTooltip("当角色血量低于指定百分比时触发");
      this.setHelpUrl("");
    }
  };

  // 注册条件块 - 血量高于
  Blockly.Blocks['condition_health_above'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("血量高于")
          .appendField(new Blockly.FieldNumber(80, 0, 100), "PERCENT")
          .appendField("%");
      this.setOutput(true, null);
      this.setColour('#5CA65C');
      this.setTooltip("当角色血量高于指定百分比时触发");
      this.setHelpUrl("");
    }
  };

  // 注册条件块 - 魔法低于
  Blockly.Blocks['condition_mana_below'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("魔法低于")
          .appendField(new Blockly.FieldNumber(30, 0, 100), "PERCENT")
          .appendField("%");
      this.setOutput(true, null);
      this.setColour('#5CA65C');
      this.setTooltip("当角色魔法低于指定百分比时触发");
      this.setHelpUrl("");
    }
  };

  // 注册条件块 - 魔法高于
  Blockly.Blocks['condition_mana_above'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("魔法高于")
          .appendField(new Blockly.FieldNumber(70, 0, 100), "PERCENT")
          .appendField("%");
      this.setOutput(true, null);
      this.setColour('#5CA65C');
      this.setTooltip("当角色魔法高于指定百分比时触发");
      this.setHelpUrl("");
    }
  };

  // 注册条件块 - 敌人在附近
  Blockly.Blocks['condition_enemy_nearby'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("敌人在")
          .appendField(new Blockly.FieldNumber(5, 0, 100), "RANGE")
          .appendField("范围内");
      this.setOutput(true, null);
      this.setColour('#5CA65C');
      this.setTooltip("当敌人在指定范围内时触发");
      this.setHelpUrl("");
    }
  };

  // 注册条件块 - 敌人数量
  Blockly.Blocks['condition_enemy_count'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("在")
          .appendField(new Blockly.FieldNumber(8, 0, 100), "RANGE")
          .appendField("范围内敌人数量大于")
          .appendField(new Blockly.FieldNumber(3, 0, 100), "COUNT");
      this.setOutput(true, null);
      this.setColour('#5CA65C');
      this.setTooltip("当范围内敌人数量大于指定值时触发");
      this.setHelpUrl("");
    }
  };

  // 注册动作块 - 治疗
  Blockly.Blocks['action_heal'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("治疗自身")
          .appendField(new Blockly.FieldNumber(20, 0, 100), "AMOUNT")
          .appendField("点血量");
      this.setOutput(true, null);
      this.setColour('#A65C5C');
      this.setTooltip("使用治疗技能恢复血量");
      this.setHelpUrl("");
    }
  };

  // 注册动作块 - 攻击
  Blockly.Blocks['action_attack'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("攻击")
          .appendField(new Blockly.FieldDropdown([
            ["最近的敌人", "nearest"],
            ["血量最低的敌人", "lowest_health"],
            ["威胁最高的敌人", "highest_threat"]
          ]), "TARGET");
      this.setOutput(true, null);
      this.setColour('#A65C5C');
      this.setTooltip("对目标进行普通攻击");
      this.setHelpUrl("");
    }
  };

  // 注册动作块 - 释放技能
  Blockly.Blocks['action_cast_skill'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("对")
          .appendField(new Blockly.FieldDropdown([
            ["最近的敌人", "nearest"],
            ["血量最低的敌人", "lowest_health"],
            ["威胁最高的敌人", "highest_threat"],
            ["自身", "self"],
            ["友方目标", "ally"]
          ]), "TARGET")
          .appendField("使用技能")
          .appendField(new Blockly.FieldDropdown([
            ["火球术", "fireball"],
            ["冰霜新星", "frost_nova"],
            ["治疗术", "heal"],
            ["闪电链", "chain_lightning"],
            ["嘲讽", "taunt"]
          ]), "SKILL_ID");
      this.setOutput(true, null);
      this.setColour('#A65C5C');
      this.setTooltip("释放指定技能");
      this.setHelpUrl("");
    }
  };

  // 注册动作块 - 移动到
  Blockly.Blocks['action_move_to'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("移动到")
          .appendField(new Blockly.FieldDropdown([
            ["最近的敌人", "nearest"],
            ["血量最低的敌人", "lowest_health"],
            ["威胁最高的敌人", "highest_threat"],
            ["友方目标", "ally"],
            ["安全位置", "safe_spot"]
          ]), "TARGET");
      this.setOutput(true, null);
      this.setColour('#A65C5C');
      this.setTooltip("向目标移动");
      this.setHelpUrl("");
    }
  };

  // 注册动作块 - 撤退
  Blockly.Blocks['action_retreat'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("撤退")
          .appendField(new Blockly.FieldNumber(10, 0, 100), "DISTANCE")
          .appendField("距离");
      this.setOutput(true, null);
      this.setColour('#A65C5C');
      this.setTooltip("远离敌人");
      this.setHelpUrl("");
    }
  };

  console.log('自定义Blockly块注册成功'); // 添加日志以确认注册成功
}