/**Multi-Armed Bandit Algorithm - Thompson Sampling */
import PD from 'probability-distributions';

class TS {
  constructor() {
    this.successes = [];
    this.failures = [];
    this.numArms = 0;
  }

  /**
   * Initialize the algorithm with the number of arms
   * @param {number} numArms Number of arms
   */
  initialize(numArms) {
    this.numArms = numArms;
    this.successes = Array(numArms).fill(0);
    this.failures = Array(numArms).fill(0);
  }

  /**
   * Find max value from a beta distribution with parameters alpha and beta
   * @returns {number} Max sample value from beta distribution
   */
  _sampleBeta(alphaArray, betaArray) {
    const samples = [];
    for (let i = 0; i < this.numArms; i++) {
      samples.push(this._sampleBetaSingle(alphaArray[i], betaArray[i]));
    }
    let maxIndex = Math.floor(Math.random() * this.numArms) //to avoid always select the first arm in round 1
    samples.forEach((sample, index) => {
      // console.log(`sample${index}: ${sample}`);
      if (sample > samples[maxIndex]) {
        maxIndex = index;
      }
    })
    return maxIndex;
  }

  /**
   * Sample from a beta distribution with parameters alpha and beta
   * @returns {number} Sample from beta distribution
   */
  _sampleBetaSingle(alpha, beta) {
    return PD.rbeta(2, alpha, beta)[0];
  }

  selectArm() {
    return this._sampleBeta(this.numArms, this.successes, this.failures);
  }

  /**
   * Update the trial results for the selected arm
   */
  updateArm(selectedArm, success) {
    if (success) {
      this.successes[selectedArm]++;
    } else {
      this.failures[selectedArm]++;
    }
  }
}

export default TS;