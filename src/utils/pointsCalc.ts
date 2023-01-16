export function calcDistance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export interface IMoves {
  xunits: number;
  yunits: number;
}

export function calcMoves(
  speed: number,
  distance: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): IMoves {
  const moves = distance / speed;
  const xunits = (x2 - x1) / moves;
  const yunits = (y2 - y1) / moves;

  return {
    xunits,
    yunits,
  };
}

export function getClosestUnitOfPlayer(
  fromUnit,
  player,
  { unitTypeClass = null, ignoreVisionRange = true } = {}
) {
  return player.units
    .filter((unit) => {
      if (unitTypeClass) {
        return unit.isAlive && unit instanceof unitTypeClass;
      }
      return unit.isAlive;
    })
    .map((unit) => ({
      unit,
      distance: calcDistance(fromUnit.x, fromUnit.y, unit.x, unit.y),
    }))
    .filter(
      (unit) => ignoreVisionRange || unit.distance <= fromUnit.visionRange
    )
    .reduce(
      (prev, curr) => (prev?.distance < curr?.distance ? prev : curr),
      null
    );
}

export function getDegree360(x1: number, y1: number, x2: number, y2: number) {
  const radian = Math.atan2(y2 - y1, x2 - x1);
  return radian * (180 / Math.PI) + 180;
}

export function getDegree180(x1: number, y1: number, x2: number, y2: number) {
  const radians = Math.atan2(y2 - y1, x2 - x1);
  const degrees = radians * (180 / Math.PI);
  return degrees;
}

export function getRadian(x1: number, y1: number, x2: number, y2: number) {
  //currently not used
  const radian = Math.atan2(y2 - y1, x2 - x1);
  const degrees = Math.atan(y2 - y1, x2 - x1);
  //console.log('radian = ', radian, radian * (180 / Math.PI));
  return radian + 2 * Math.PI;
  //http://jsfiddle.net/rjCeV/2/
}
