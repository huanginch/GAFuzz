import strMutator from './strMutator.js';
import target from '../../fuzztarget.json' assert { type: "json" };

function Mutation(selectedArm, entity) {
  const methodMap = {
    0: 'flip',
    1: 'delete',
    2: 'insert',
    3: 'swap',
    4: 'duplicate',
    5: 'insertPercent',
    6: 'insertUnderline',
  }
  // selectedArm = Math.floor(Math.random() * 5); //use MBATS or not
  entity[0] = strMutator[selectedArm](entity[0]); //cosname, mutate string
  // while (entity[0].length > 20) {
  //   entity[0] = strMutator[1](entity[0]); // cosname, delete string if length > 20
  // }
  entity[target.paramNum] = methodMap[selectedArm];

  return entity;
}

export { Mutation };