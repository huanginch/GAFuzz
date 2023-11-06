function FittestLinear(pop) {
  this.internalGenState['flr'] = this.internalGenState['flr'] >= pop.length ? 0 : this.internalGenState['flr'] || 0;
  return pop[this.internalGenState['flr']++].entity;
}

export default FittestLinear;