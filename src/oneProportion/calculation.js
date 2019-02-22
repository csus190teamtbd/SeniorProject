const cal = {
  generateLabels: noOfCoin => {
    const labels = Array(noOfCoin + 1);
    for (let i = 0; i < noOfCoin + 1; i++) {
      labels[i] = i;
    }
    return labels;
  },

  calculateBinonimalForOne: (noOfCoin, probability) => {
    const coeff = Array(noOfCoin + 1).fill(0);
    coeff[0] = 1;
    const binomailBase = Array(noOfCoin + 1);
    /**
     * dynamic programming
     */
    binomailBase[0] = Math.pow(1 - probability, noOfCoin);
    for (let i = 1; i < noOfCoin + 1; i++) {
      coeff[i] = (coeff[i - 1] * (noOfCoin + 1 - i)) / i;
      binomailBase[i] =
        coeff[i] *
        Math.pow(1 - probability, noOfCoin - i) *
        Math.pow(probability, i);
    }
    return binomailBase;
  },

  drawSamples: (probability, noOfCoin, noOfDraw) => {
    const drawResults = Array(noOfDraw);
    for (let i = 0; i < noOfDraw; i++) {
      const singleDraw = Array(noOfCoin).fill(NaN);
      drawResults[i] = singleDraw.map(x => {
        return Math.random() < probability ? 1 : 0;
      });
    }
    return drawResults;
  },

  calculateMean: sampleData => {
    return (
      // i = no of heads
      // x = frequency
      sampleData.reduce((acc, x, i) => acc + x * i, 0) /
      sampleData.reduce((acc, x) => acc + x, 0)
    );
  },

  calucalteStd: sampleData => {
    const mean = cal.calculateMean(sampleData);
    return (
      sampleData.reduce((acc, x, i) => acc + (i - mean) * (i - mean) * x, 0) /
      sampleData.reduce((acc, x) => acc + x, 0)
    );
  },

  calculateSamplesSelected: (lower, upper, samples) => {
    lower = lower >= 0 ? lower : 0;
    upper = upper <= samples.length ? upper : samples.length;
    return samples.reduce((acc, x, i) => {
      if (i >= lower && i <= upper) return acc + x;
      return acc;
    });
  },

  /**
   * Useed for chartJS, selected heads will be zero,
   * 'fill end' method in chartJS will fill the whole area.
   * , othereise will be NaN
   */
  generateSelectedArray: (lower, upper, noOfCoin) => {
    lower = lower >= 0 ? lower : 0;
    upper = upper <= noOfCoin + 2 ? upper : noOfCoin + 2;
    const selected = Array(noOfCoin + 2).fill(NaN);
    return selected.map((x, i) => {
      if (i >= lower && i <= upper + 1) return 0;
      return x;
    });
  },

  /**
   * drawResults is in format [[a,a...], [a,a...]]
   *   where each subArray is a single draw, 0 is tail, 1 is head
   *   where a is 0 or 1
   */
  addSamples: (originalSamples, drawResults) => {
    const summary = Array(originalSamples.length).fill(0);
    for (let i = 0; i < drawResults.length; i++) {
      const heads = drawResults[i].reduce((acc, x) => acc + x, 0);
      summary[heads]++;
    }
    return originalSamples.map((x, i) => {
      return x + summary[i];
    }, 0);
  },

  calculateSelectedProportion: (selected, total) => {
    return selected / total;
  }
};

export { cal };
