function twoPoint(parent1, parent2) {
  let m = Math.floor(Math.random() * parent1.length);
  let n = Math.floor(Math.random() * parent1.length);
  if (m > n) {
    let tmp = n;
    n = m;
    m = tmp;
  }
  const child1 = parent1.slice(0, m).concat(parent2.slice(m, n)).concat(parent1.slice(n, parent1.length));
  const child2 = parent2.slice(0, m).concat(parent1.slice(m, n)).concat(parent2.slice(n, parent2.length));
  return [child1, child2];
}

export { twoPoint };