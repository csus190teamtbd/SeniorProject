import Chart from 'chart.js';
import { runInThisContext } from 'vm';


class OneProportionModule{
  constructor(){
    this.mainContent = document.querySelector('#main-content');
    this.totalFlips = 0;
    this.chartObject = {
      type: 'bar',
      data: {
          labels: [],
          datasets: [{
                label: '# of heads in each draw (samples)',
                data: [],
                borderWidth: 1,
              },{
                label: '# of heads in each draw (binomail)',
                data: [],
                type: 'line'
              },
          ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
    };
    this.chart;

    // caching binomail probabilty
    this.theroyProbability=[];
  }
  loadUI(){
    while (this.mainContent.firstChild)
      this.mainContent.firstChild.remove();
    
    const div = document.createElement('div');
    div.setAttribute('id', 'mainpanel');
    div.appendChild(this.generateControlMenu());
    div.appendChild(this.generateView());
    this.mainContent.appendChild(div);
  }

  generateControlMenu(){
    const div = document.createElement('div');
    div.setAttribute('id', 'control');
    div.classList.add('container');
    div.innerHTML = 
    `<form>
      <div class='form-group'>
        <label for='probability'>Head Probability: <span id='probDisplay'>0.5</span></label>
        <input type='range' min=0 max=1 step=0.01 value='0.5' id='probability'>
        <p id='selectedProb'></p>
      </div>
      <div class='form-group'>
        <label for='coins'>Number of Coins</label>
        <input type='number' min=1 id='coins' value='5'>
      </div>
      <div class='form-group'>
        <label for='draws'>No of Draws</label>
        <input type='number' min=1 id='draws' value='1'>
      </div>
      <button type="submit" value="sample" class='btn' id ='sampleBtn'>Draw Samples</button>
      <button type="reset" value="reset" class='btn' id='resetBtn'>Reset</button>
    </div>
    </form>`
    return div;
  }

  generateView(){
    const div = document.createElement('div');
    div.setAttribute('id', 'view');
    div.appendChild(this.generateAnimation());
    div.appendChild(this.generateChart());

    return div;
  }

  generateAnimation(){
    const div = document.createElement('div');
    div.setAttribute('id', 'animation');
    div.classList.add('container');
    div.textContent = "ANIMATION , COMING SOON";
    return div;
  }

  generateChart(){
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'chart');
    canvas.classList.add('container');

    return canvas;
  }

  initChart(){
    var ctx = document.getElementById("chart");
    this.chart = new Chart(ctx, this.chartObject);
  }



  loadEventListeners(){
    const probabilityInput = document.querySelector('#probability');
    const coinsInput = document.querySelector('#coins');
    const probDisplay = document.querySelector('#probDisplay');
    const drawInput = document.querySelector('#draws');

    probabilityInput.addEventListener('input', (e)=>{
      probDisplay.textContent = e.target.value;
    });

    document.querySelector('#sampleBtn').addEventListener('click', (e)=>{
      
      coinsInput.setAttribute('disabled', true);
      probabilityInput.setAttribute('disabled', true);
      this.flipcoins(
        parseInt(coinsInput.value), 
        parseFloat(probabilityInput.value),
        parseInt(drawInput.value));
      this.chart.update();
      e.preventDefault();
    });

    document.querySelector('#resetBtn').addEventListener('click', (e)=>{
      this.reset();
      this.chart.update();
      e.preventDefault();
    });
  }

  reset(){
    const probabilityInput = document.querySelector('#probability');
    const coinsInput = document.querySelector('#coins');
    const probDisplay = document.querySelector('#probDisplay');
    const drawInput = document.querySelector('#draws');
    coinsInput.removeAttribute('disabled');
    coinsInput.value = 5;
    drawInput.value = 1;
    probabilityInput.removeAttribute('disabled');
    probabilityInput.value = 0.5;
    probDisplay.textContent = 0.5;
    this.totalFlips = 0;
    this.chartObject.data.datasets[0].data = [];
    this.chartObject.data.datasets[1].data = [];
    this.chartObject.data.labels = [];
    this.theroyProbability=[];
  }

  flipcoins(noOfCoin, probability, drawInput){
    const samples = Array(noOfCoin+1).fill(0);
    for (let i = 0; i < drawInput; i++ ){
      let res = 0;
      for (let j = 0 ; j < noOfCoin; j++)
        res += Math.random() < probability ? 1 : 0;
      samples[res]++;
      this.totalFlips++;
    }
    this.updatelabel(noOfCoin);
    this.updateSampleData(samples);
    this.updateBinomailData(probability, noOfCoin, drawInput);
  }


  updatelabel(noOfCoin){
    if (this.chartObject.data.labels.length === 0){
      this.chartObject.data.labels = Array(noOfCoin+1);
      for (let i = 0; i < noOfCoin+1; i++)
        this.chartObject.data.labels[i] = i;
    }
  }

  updateSampleData(samples){
    if (this.chartObject.data.datasets[0].data.length === 0){
      this.chartObject.data.datasets[0].data = Array(samples.length).fill(0);
    }
    for (let i = 0; i < samples.length; i++)
      this.chartObject.data.datasets[0].data[i] += samples[i];
  }

  updateBinomailData(probability, noOfCoin){
    if (this.theroyProbability.length === 0){
      this.theroyProbability = Array(noOfCoin+1).fill(0);
      const coeff = Array(noOfCoin+1).fill(0);
      coeff[0] = 1;
      this.theroyProbability[0] = Math.pow(1-probability, noOfCoin);
      console.log(this.theroyProbability);
      for (let i = 1; i < noOfCoin+1; i++){
        coeff[i] = coeff[i-1]*(noOfCoin+1-i)/(i);
        this.theroyProbability[i] = coeff[i]
          *Math.pow(1-probability, noOfCoin-i)
          *Math.pow(probability, i);
      }
      this.chartObject.data.datasets[1].data = Array(noOfCoin+1);
    } 
    for (let i = 0; i < this.theroyProbability.length; i++)
      this.chartObject.data.datasets[1].data[i] = this.theroyProbability[i]*this.totalFlips;

  }

  init(){
    this.loadUI();
    this.loadEventListeners();
    this.reset();
    this.initChart();
  }

}

export const oneProportion = new OneProportionModule();