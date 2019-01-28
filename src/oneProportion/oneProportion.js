import Chart from 'chart.js';


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
    // caching binomail data
    this.coeff=[];
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
        <input type='number' min=1 id='coins' value='1'>
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
      
      coinsInput.removeAttribute('disabled');
      coinsInput.value = 1;
      drawInput.value = 1;
      probabilityInput.removeAttribute('disabled');
      probabilityInput.value = 0.5;
      probDisplay.textContent = 0.5;
      this.totalFlips = 0;
      this.chartObject.data.datasets[0].data = [];
      this.chartObject.data.datasets[1].data = [];
      this.chartObject.data.labels = [];
      this.chart.update();
      e.preventDefault();
    });
  }

  flipcoins(noOfCoin, probability, drawInput){
    let sampleData = this.chartObject.data.datasets[0].data;
    let theoryData = this.chartObject.data.datasets[1].data;
    if (sampleData.length === 0){
      sampleData = Array(noOfCoin+1).fill(0);
      theoryData = Array(noOfCoin+1).fill(0);
      this.chartObject.data.datasets[0].data = sampleData;
      this.chartObject.data.datasets[1].data = theoryData;
      const label = Array(noOfCoin+1);     
      for (let i = 0; i < noOfCoin+1; i++)
        label[i] = i;
      this.chartObject.data.labels = label;
    }
    for (let i = 0; i < drawInput; i++ ){
      let res = 0;
      for (let j = 0 ; j < noOfCoin; j++)
        res += Math.random() < probability ? 1 : 0;
      sampleData[res]++;
      this.totalFlips++;
    }
    this.updateBinomailData(theoryData, probability, noOfCoin, drawInput);
  }

  updateBinomailData(arr, probability, noOfCoin, drawInput){
    if (this.coeff.length === 0){
      const coeff = Array(noOfCoin+1);
      coeff[0] = 1;
      arr[0] = Math.pow(probability, noOfCoin)*this.totalFlips;
      for (let i = 1; i < noOfCoin+1; i++){
        coeff[i] = coeff[i-1]*(noOfCoin+1-i)/(i);
        arr[i] = coeff[i]
          *Math.pow(probability, noOfCoin-i)
          *Math.pow(1-probability, i)
          *this.totalFlips; 
      }
    } else {
      arr.forEach(x => {
        x += probability*(1-probability)*drawInput; 
      });
    }
  }

  init(){
    this.loadUI();
    this.loadEventListeners();
    this.initChart();
  }

}

export const oneProportion = new OneProportionModule();