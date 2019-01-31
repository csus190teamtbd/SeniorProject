import Chart from 'chart.js';

import Calculation from './calculation';
import {ui} from './ui';
class OneProportionModule{
  constructor(){
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
              xAxes: [{ barPercentage: 1.0}]
          },
          responsive: true,
          maintainAspectRatio: true
      }
    };
    this.chart;
    this.cal;
    // caching binomail probabilty
  }


  initChart(){
    var ctx = ui.getUISelectors().chart;
    this.chart = new Chart(ctx, this.chartObject);
  }

  loadEventListeners(){
    const probabilityInput = ui.getUISelectors().probabilityInput;
    const coinsInput = ui.getUISelectors().coinsInput;
    const probDisplay = ui.getUISelectors().probDisplay;
    const drawInput = ui.getUISelectors().drawInput;
    const totalFlips = ui.getUISelectors().totalFlips;

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
      }
      totalFlips.textContent = this.cal.getDataSet().totalFlips;
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

    ui.getUISelectors().coinsInput.removeAttribute('disabled');
    ui.getUISelectors().coinsInput.value = 5;
    ui.getUISelectors().drawInput.value = 1;
    ui.getUISelectors().probabilityInput.removeAttribute('disabled');
    ui.getUISelectors().probabilityInput.value = 0.5;
    ui.getUISelectors().probDisplay.textContent = 0.5;
    ui.getUISelectors().totalFlips.textContent = 0;
    this.chartObject.data.datasets[0].data = [];
    this.chartObject.data.datasets[1].data = [];
    this.chartObject.data.labels = [];
    this.cal = null;
  }

  init(){
    ui.loadUI();
    this.loadEventListeners();
    this.reset();
    this.initChart();
  }

}

export const oneProportion = new OneProportionModule();