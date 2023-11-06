function FittestRandom(pop) {
  return pop[Math.floor(Math.random() * pop.length * 0.2)].entity;
}

export default FittestRandom;