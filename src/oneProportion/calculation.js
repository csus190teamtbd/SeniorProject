const cal = {
  generateLabels: noOfCoin => {
    const labels = Array(noOfCoin + 1);
    for (let i = 0; i < noOfCoin + 1; i++) {
      labels[i] = i;
    }
    return labels;
  },

  calculateBinonimal: (noOfCoin, probability, totalSamples) => {
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
    return binomailBase.map(x => x * totalSamples);
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
    }, 0);
  },

  /**
   * Useed for chartJS, selected heads will be zero,
   * 'fill end' method in chartJS will fill the whole area.
   * , othereise will be NaN. return array size = noOfCoin +2
   *  so the the chart will extend to end.
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
   * eg. originalSamples = [1, 2, 3, 4, 5, 6];
  * eg.  const drawResults = [
          [0, 0, 0, 1, 1], // total heads 2
          [0, 1, 0, 1, 1], // total heads 3
          [0, 0, 1, 1, 1], // total heads 3
          [1, 0, 0, 1, 1] // total heads 3
        ];
        return [1, 2, 4, 7, 5, 6];
   */
  addSamples: (originalSamples, drawResults) => {
    const summary = drawResults.reduce((acc, eachDraw) => {
      const noOfHead = eachDraw.reduce((accHeads, head) => accHeads + head, 0);
      const headsCount = acc[noOfHead] + 1 || 1;
      return { ...acc, [noOfHead]: headsCount };
    }, {});

    return originalSamples.map((x, i) => x + (summary[i] || 0));
  },

  calculateSelectedProportion: (selected, total) => {
    return selected / total;
  }
};

export { cal };
