
class Data{
  constructor(){
    this.label = 0;
    this.sample = 0;
    this.binomail = 0;
    this.normal = 0;
  }
}


export default class Calculation{

  constructor(noOfCoin, probability, firstInput){
    this.dataSet = [];
    this.noOfCoin = noOfCoin;
    this.probability = probability;
    this.dataSet = Array(noOfCoin+1);

    const coeff = Array(noOfCoin+1).fill(0);
    coeff[0] = 1;
    this.dataSet[0] = new Data();
    this.dataSet[0].label = 0;
    this.dataSet[0].binomail = Math.pow(1-probability, noOfCoin);
    for (let i = 1; i < noOfCoin+1; i++){
      this.dataSet[i] = new Data();
      this.dataSet[i].label = i;
      coeff[i] = coeff[i-1]*(noOfCoin+1-i)/(i);
      this.dataSet[i].binomail = coeff[i]*Math.pow(1-probability, noOfCoin-i)*Math.pow(probability, i);
    };
    this.totalFlips = 0;
    this.addSampleDatas(firstInput);
  }

  addSampleDatas(drawInput){
    for (let i = 0; i < drawInput; i++ ){
      let res = 0;
      for (let j = 0 ; j < this.noOfCoin; j++)
        res += Math.random() < this.probability ? 1 : 0;
      this.dataSet[res].sample++;
    }
    this.totalFlips += drawInput;
  }

  getDataSet(){
    return this.dataSet;
  }

}
