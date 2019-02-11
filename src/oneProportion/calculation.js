export default class Calculation {
  constructor(noOfCoin, probability) {
    this.binomailBase = this.calculateBinonimalBase(noOfCoin, probability);
    this.dataSet = {
      noOfCoin: noOfCoin,
      probability: probability,
      labels: this.generateLabels(noOfCoin),
      binomail: Array(noOfCoin + 1).fill(0), //caching the binomail base
      sample: Array(noOfCoin + 1).fill(0),
      selected: Array(noOfCoin + 1).fill(NaN),
      mean: 0,
      std: 0,
      sampleSelected: 0,
      noOfSelected: 0,
      totalFlips: 0,
      zoomRange: 0,
      lowerSelected: 0,
      upperSelected: 0
    };
  }
  generateLabels(noOfCoin) {
    const labels = Array(noOfCoin + 1);
    for (let i = 0; i < noOfCoin + 1; i++) {
      labels[i] = i;
    }
    return labels;
  }

  calculateBinonimalBase(noOfCoin, probability) {
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
  }

  drawSamples(noOfDraw) {
    const drawResults = Array(noOfDraw);
    for (let i = 0; i < noOfDraw; i++) {
      const singleDraw = Array(this.dataSet.noOfCoin).fill(NaN);
      drawResults[i] = singleDraw.map(x => {
        return Math.random() < this.dataSet.probability ? 1 : 0;
      });
    }
    console.log(drawResults);
    return drawResults;
  }

  updateCalculation(drawResults, noOfDraw) {
    //update samples array
    for (let i = 0; i < drawResults.length; i++) {
      const heads = drawResults[i].reduce((acc, x) => acc + x, 0);
      this.dataSet.sample[heads]++;
    }

    //update totalFlips
    this.dataSet.totalFlips += noOfDraw;

    //update mean
    this.dataSet.mean =
      this.dataSet.sample.reduce((acc, x, i) => acc + x * i, 0) /
      this.dataSet.totalFlips;

    //update std
    this.dataSet.std = Math.sqrt(
      this.dataSet.sample.reduce(
        (acc, x, i) =>
          acc + (i - this.dataSet.mean) * (i - this.dataSet.mean) * x,
        0
      ) / this.dataSet.totalFlips
    );

    //update binomial
    this.dataSet.binomail = this.binomailBase.map(
      x => x * this.dataSet.totalFlips
    );
  }

  upDateNumberOfSamplesInRange(lower, upper) {
    lower = lower >= 0 ? lower : 0;
    upper = upper <= this.dataSet.noOfCoin ? upper : this.dataSet.noOfCoin;
    let res = 0;
    this.dataSet.selected.fill(NaN);
    for (let i = lower; i <= upper; i++) {
      res += this.dataSet.sample[i];
      this.dataSet.selected[i] = 0;
    }
    this.dataSet.selected[upper + 1] = 0;
    this.dataSet.sampleSelected = res;
    return res;
  }
}
