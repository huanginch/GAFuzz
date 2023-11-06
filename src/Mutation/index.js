import strMutator from './strMutator.js';

function Mutation(selectedArm, entity) {
  const methodMap = {
    0: 'flip',
    1: 'delete',
    2: 'insert',
    3: 'swap',
    4: 'duplicate',
    5: 'copy',
  }
  // selectedArm = Math.floor(Math.random() * 5); //use MBATS or not
  entity[0] = strMutator[selectedArm](entity[0]); //cosname, mutate string

  entity[36] = methodMap[selectedArm];

  return entity;
}

export { Mutation };