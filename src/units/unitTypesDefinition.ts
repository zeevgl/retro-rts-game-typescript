export enum UnitStates {
  IDLE = "IDLE",
  SPAWN = "SPAWN",
  ATTACK = "ATTACK",
  ATTACK_COOLDOWN = "ATTACK_COOLDOWN",
  MOVING_TO_ATTACK = "MOVING_TO_ATTACK",
  MOVING = "MOVING",
  DEFEND = "DEFEND",
  DYING = "DYING",
  SQUASHED = "SQUASHED",
}

export enum UnitClasses {
  LIGHT = "LIGHT",
  MEDIUM = "MEDIUM",
  HEAVY = "HEAVY",
  BUILDING = "BUILDING",
}

export enum UnitGroups {
  fighter = "fighter",
  buildings = "buildings",
  harvesters = "harvesters",
  defenseBuildings = "defenseBuildings",
}

export interface AttackDamage {
  [UnitClasses.LIGHT]: number;
  [UnitClasses.MEDIUM]: number;
  [UnitClasses.HEAVY]: number;
  [UnitClasses.BUILDING]: number;
}
