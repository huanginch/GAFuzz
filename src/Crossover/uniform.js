function uniform(parent1, parent2) {
  const child1 = [];
  const child2 = [];
  for (let i = 0; i < parent1.length; i++) {
    if (Math.random() < 0.5) {
      child1.push(parent1[i]);
      child2.push(parent2[i]);
    } else {
      child1.push(parent2[i]);
      child2.push(parent1[i]);
    }
  }
  return [child1, child2];
}

export { uniform };