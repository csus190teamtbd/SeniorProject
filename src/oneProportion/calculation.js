
export default class Calculation{

  constructor(noOfCoin, probability, firstInput){
    // this.dataSet = [];
    this.noOfCoin = noOfCoin;
    this.probability = probability;
    this.binomailBase = Array(noOfCoin+1);
    const coeff = Array(noOfCoin+1).fill(0);
    coeff[0] = 1;

    this.dataSet = {
      label : Array(noOfCoin+1).fill(0),
      binomail: Array(noOfCoin+1).fill(0),
      sample : Array(noOfCoin+1).fill(0),
      totalFlips : 0
    }
    this.binomailBase[0] = Math.pow(1-probability, noOfCoin);
    for (let i = 1; i < noOfCoin+1; i++){
      this.dataSet.label[i] = i;
      coeff[i] = coeff[i-1]*(noOfCoin+1-i)/(i);
      this.binomailBase[i] = coeff[i]*Math.pow(1-probability, noOfCoin-i)*Math.pow(probability, i);
    };
    console.log(this.binomailBase);
    this.addSampleDatas(firstInput);
  }

  addSampleDatas(drawInput){
    for (let i = 0; i < drawInput; i++ ){
      let res = 0;
      for (let j = 0 ; j < this.noOfCoin; j++){
        res += Math.random() < this.probability ? 1 : 0;
      }
      this.dataSet.sample[res]++;
    }
    this.dataSet.totalFlips += drawInput;

    //update binomial
    for (let i = 0; i < this.noOfCoin+1; i++)
      this.dataSet.binomail[i] = (this.binomailBase[i]*this.dataSet.totalFlips).toFixed(2);
  }

  getDataSet(){
    return this.dataSet;
  }
  getNumberOfSamplesInRange(lower, upper){
    lower = lower >= 0 ? lower : 0;
    upper = upper <= this.noOfCoin ? upper :this.noOfCoin;
    let res = 0;
    for (let i = lower; i <= upper; i++)
      res += this.dataSet.sample[i]
    return res;
  }
  getMean(){
    return this.noOfCoin * this.probability;
  }
  getSTD(){
    return Math.sqrt(this.noOfCoin * this.probability * (1-this.probability));
  }
}
