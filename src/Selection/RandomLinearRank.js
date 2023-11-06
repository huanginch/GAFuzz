function RandomLinearRank(pop) {
  return pop[Math.floor(Math.random() * Math.min(pop.length, this.internalGenState['rlr']++))].entity;
}

export default RandomLinearRank;