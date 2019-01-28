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
              label: '# of heads in each draw',
              data: [],
              borderWidth: 1
          }]
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
        <label for='coins'>Number of Coins</label>
        <input type='number' min=1 id='coins' value='1'>
      </div>
      <div class='form-group'>
        <label for='probability'>Head Probability: <span id='probDisplay'>0.5</span></label>
        <input type='range' min=0 max=1 step=0.01 value='0.5' id='probability'>
        <p id='selectedProb'></p>
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
    const probDisplay = document.querySelector('#probDisplay')

    probabilityInput.addEventListener('input', (e)=>{
      probDisplay.textContent = e.target.value;
    });

    document.querySelector('#sampleBtn').addEventListener('click', (e)=>{
      
      coinsInput.setAttribute('disabled', true);
      probabilityInput.setAttribute('disabled', true);
      this.flipcoins(parseInt(coinsInput.value), parseFloat(probabilityInput.value));
      this.chart.update();
      e.preventDefault();
    });

    document.querySelector('#resetBtn').addEventListener('click', (e)=>{
      
      coinsInput.removeAttribute('disabled');
      coinsInput.value = 1;
      probabilityInput.removeAttribute('disabled');
      probabilityInput.value = 0.5;
      probDisplay.textContent = 0.5;
      this.totalFlips = 0;
      this.chartObject.data.datasets[0].data = [];
      this.chartObject.data.labels = [];
      this.chart.update();
      e.preventDefault();
    });
  }

  flipcoins(noOfCoin, probability){
    let data = this.chartObject.data.datasets[0].data;
    let res = 0;
    for (let i = 0 ; i < noOfCoin; i++)
      res += Math.random() < probability ? 1 : 0;

    if (data.length === 0){
      data = this.chartObject.data.datasets[0].data;
      data = Array(noOfCoin+1).fill(0);
      this.chartObject.data.datasets[0].data = data;
      const label = Array(noOfCoin+1);     
      for (let i = 0; i < noOfCoin+1; i++)
        label[i] = i;
      this.chartObject.data.labels = label;
    }
    data[res]++;
    this.totalFlips++;
  }
  init(){
    this.loadUI();
    this.loadEventListeners();
    this.initChart();
  }

}

export const oneProportion = new OneProportionModule();