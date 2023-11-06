function Rank(pop) {
  const n = pop.length;
  const sum = (n * (n + 1)) / 2;
  let i = 0;
  let r = Math.random() * sum;
  while (r > 0 && i < n) {
    r -= ++i;
  }
  return pop[i - 1].entity;
}

export default Rank;