export default class Calculation {
  constructor(noOfCoin, probability, firstInput) {
    this.binomailBase = Array(noOfCoin + 1);
    const coeff = Array(noOfCoin + 1).fill(0);
    coeff[0] = 1;

    this.dataSet = {
      noOfCoin: noOfCoin,
      probability: probability,
      labels: Array(noOfCoin + 1).fill(0),
      binomail: Array(noOfCoin + 1).fill(0),
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
    this.binomailBase[0] = Math.pow(1 - probability, noOfCoin);
    for (let i = 1; i < noOfCoin + 1; i++) {
      this.dataSet.labels[i] = i;
      coeff[i] = (coeff[i - 1] * (noOfCoin + 1 - i)) / i;
      this.binomailBase[i] =
        coeff[i] *
        Math.pow(1 - probability, noOfCoin - i) *
        Math.pow(probability, i);
    }
    console.log(this.binomailBase);
    this.addSampleDatas(firstInput);
  }

  addSampleDatas(drawInput) {
    for (let i = 0; i < drawInput; i++) {
      let res = 0;
      for (let j = 0; j < this.dataSet.noOfCoin; j++) {
        res += Math.random() < this.dataSet.probability ? 1 : 0;
      }
      this.dataSet.sample[res]++;
    }
    this.dataSet.totalFlips += drawInput;
    this.dataSet.mean =
      this.dataSet.sample.reduce((acc, x, i) => acc + x * i, 0) /
      this.dataSet.totalFlips;

    this.dataSet.std = Math.sqrt(
      this.dataSet.sample.reduce(
        (acc, x, i) =>
          acc + (i - this.dataSet.mean) * (i - this.dataSet.mean) * x,
        0
      ) / this.dataSet.totalFlips
    );

    //update binomial
    for (let i = 0; i < this.dataSet.noOfCoin + 1; i++)
      this.dataSet.binomail[i] = (
        this.binomailBase[i] * this.dataSet.totalFlips
      ).toFixed(2);
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
