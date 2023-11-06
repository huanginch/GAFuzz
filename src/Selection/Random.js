function Random(pop) {
  return pop[Math.floor(Math.random() * pop.length)].entity;
}

export default Random;