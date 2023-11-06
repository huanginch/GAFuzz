function onePoint(parent1, parent2) {
  let n = Math.floor(Math.random() * parent1.length);
  const child1 = parent1.slice(0, n).concat(parent2.slice(n, parent2.length));
  const child2 = parent2.slice(0, n).concat(parent1.slice(n, parent1.length));
  return [child1, child2];
}

export { onePoint };