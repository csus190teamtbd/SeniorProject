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
      sampleData.reduce((acc, x, i) => acc + x * i, 0) /
      sampleData.reduce((acc, x) => acc + x, 0)
    );
  },

  calucalteStd: (sampleData, mean, totalFlips) => {
    return (
      sampleData.reduce((acc, x, i) => acc + (i - mean) * (i - mean) * x, 0) /
      totalFlips
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

  generateSelectedArray: (lower, upper, noOfCoin) => {
    lower = lower >= 0 ? lower : 0;
    upper = upper <= noOfCoin + 2 ? upper : noOfCoin + 2;
    const selected = Array(noOfCoin + 2).fill(NaN);
    return selected.map((x, i) => {
      if (i >= lower && i <= upper + 1) return 0;
      return x;
    });
  },

  addSamples: (originalSamples, newSamples) => {
    const temp = Array(originalSamples.length).fill(0);
    for (let i = 0; i < newSamples.length; i++) {
      const heads = newSamples[i].reduce((acc, x) => acc + x, 0);
      temp[heads]++;
    }
    return originalSamples.map((x, i) => {
      return x + temp[i];
    }, 0);
  },

  calculateSelectedProportion: (selected, total) => {
    return selected / total;
  }
};

export { cal };
