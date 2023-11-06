function Tournament3(pop) {
  const n = pop.length;
  const a = pop[Math.floor(Math.random() * n)];
  const b = pop[Math.floor(Math.random() * n)];
  const c = pop[Math.floor(Math.random() * n)];
  let best = this.options.optimize(a, b) ? a : b;
  best = this.options.optimize(best, c) ? best : c;
  return best.entity;
}

export default Tournament3;