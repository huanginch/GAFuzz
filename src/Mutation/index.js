import { dept_no } from './data.js';
import strMutator from './strMutator.js';

function Mutation(entity) {
  let n = Math.floor(Math.random() * 3);
  entity[0] = strMutator[n](entity[0]); //cosname, mutate string
  while (entity[0].length > 20) {
    entity[0] = strMutator[1](entity[0]); // cosname, delete string if length > 20
  }

  n = Math.floor(Math.random() * 3);
  entity[1] = strMutator[n](entity[1]); //teaname, mutate string
  while (entity[1].length > 6) {
    entity[1] = strMutator[1](entity[1]); // teaname, delete string if length > 6
  }

  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[3] = dept_no[Math.floor(Math.random() * dept_no.length)]; //dept_no, random select one
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for (let i = 0; i < 16; i++) {
    if (Math.random() < 0.5) {
      entity[5 + i] = 1 - entity[5 + i];
    }
  }

  return entity;
}

export { Mutation };