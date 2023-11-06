function Tournament2(pop) {
  const n = pop.length;
  const a = pop[Math.floor(Math.random() * n)];
  const b = pop[Math.floor(Math.random() * n)];
  return this.options.optimize(a, b) ? a.entity : b.entity;
}

export default Tournament2;