import Chart from 'chart.js';

import Calculation from './calculation';

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
                backgroundColor: "rgba(255,0,0,0.6)"
              },{
                label: '# of heads in each draw (binomail)',
                data: [],
                borderWidth: 1,
                backgroundColor: "rgba(0,0,255,0.4)",
                // hidden: true,
              },
          ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }],
              xAxes: [{ barPercentage: 0.8}]
          },
          responsive: true,
          maintainAspectRatio: true
      }
    };
    this.chart;
    this.cal;
    // caching binomail probabilty
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

      if (!this.cal){
        this.cal = new Calculation(
                        parseInt(coinsInput.value),
                        parseFloat(probabilityInput.value),
                        parseInt(drawInput.value));
        this.chartObject.data.datasets[0].data = this.cal.getDataSet().sample;
        this.chartObject.data.datasets[1].data = this.cal.getDataSet().binomail;
        this.chartObject.data.labels = this.cal.getDataSet().label;
        }else{
          this.cal.addSampleDatas(parseInt(drawInput.value));
          this.chartObject.data.datasets[1].data = this.cal.getDataSet().binomail;
      }
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
    this.chartObject.data.datasets[0].data = [];
    this.chartObject.data.datasets[1].data = [];
    this.chartObject.data.labels = [];
    this.cal = null;
  }


  init(){
    this.loadUI();
    this.loadEventListeners();
    this.reset();
    this.initChart();
  }

}

export const oneProportion = new OneProportionModule();