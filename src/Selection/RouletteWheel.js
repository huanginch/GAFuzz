function RouletteWheel(pop) {
  const n = pop.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += pop[i].fitness;
  }
  let r = Math.random() * sum;
  let i = 0;
  while (r > 0 && i < n) {
    r -= pop[i++].fitness;
  }

  return pop[i - 1].entity;
}

export default RouletteWheel;