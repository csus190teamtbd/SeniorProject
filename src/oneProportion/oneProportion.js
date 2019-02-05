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
                id: 'x-axis-1',
                backgroundColor: "rgba(255,0,0,0.6)",
                hidden: false,
              },{
                label: '# of heads in each draw (binomail)',
                data: [],
                borderWidth: 1,
                id: 'x-axis-2',
                backgroundColor: "rgba(0,0,255,0.4)",
                hidden: false,
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
              xAxes: [
                { 
                  barPercentage: 1.0
                }, 

                ]
          },
          responsive: true,
          maintainAspectRatio: true
      }
    };
    this.chart;
    this.cal;
    
  }


  initChart(){
    var ctx = ui.getUISelectors().chart;
    this.chart = new Chart(ctx, this.chartObject);
  }

  loadEventListeners(){
    const probabilityInput = ui.getUISelectors().probabilityInput;
    const coinsInput = ui.getUISelectors().coinsInput;
    const probDisplay = ui.getUISelectors().probDisplay;
    const totalFlips = ui.getUISelectors().totalFlips;
    

    probabilityInput.addEventListener('input', (e)=>{
      probDisplay.textContent = e.target.value;
    });

    ui.getUISelectors().sampleBtn.addEventListener('click', (e)=>{
      coinsInput.setAttribute('disabled', true);
      probabilityInput.setAttribute('disabled', true);
      this.updateCalculation();
      totalFlips.textContent = this.cal.getDataSet().totalFlips;
      this.updateStatNumbersDisplay();
      this.chart.update();
      e.preventDefault();
    });

    ui.getUISelectors().resetBtn.addEventListener('click', (e)=>{
      this.reset();
      this.chart.update();
      e.preventDefault();
    });

    ui.getUISelectors().lowerBound.addEventListener('input', ()=>{
      this.updateStatNumbersDisplay();
    });

    ui.getUISelectors().upperBound.addEventListener('input', ()=>{
      this.updateStatNumbersDisplay();
    });
  }

  updateCalculation(){
    const probabilityInput = ui.getUISelectors().probabilityInput;
    const coinsInput = ui.getUISelectors().coinsInput;
    const drawInput = ui.getUISelectors().drawInput;
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
  }

  updateStatNumbersDisplay(){
    if (this.cal && ui.getUISelectors().lowerBound.value != '' && ui.getUISelectors().upperBound.value != ''){
      const noOfsamplesinRange = this.cal.getNumberOfSamplesInRange(
        parseInt(ui.getUISelectors().lowerBound.value),
        parseInt(ui.getUISelectors().upperBound.value));
      ui.getUISelectors().sampleInRangeDisplay.textContent = noOfsamplesinRange;

      const total = this.cal.getDataSet().totalFlips;
      ui.getUISelectors().proportionDisplay.textContent = 
      `${noOfsamplesinRange} / ${total} = ${(noOfsamplesinRange/total).toFixed(2)}`;

      ui.getUISelectors().meanDisplay.textContent = this.cal.getMean();
      ui.getUISelectors().stdDisplay.textContent = this.cal.getSTD().toFixed(3);
    }
  }

  reset(){

    ui.getUISelectors().coinsInput.removeAttribute('disabled');
    ui.getUISelectors().coinsInput.value = 5;
    ui.getUISelectors().drawInput.value = 1;
    ui.getUISelectors().probabilityInput.removeAttribute('disabled');
    ui.getUISelectors().probabilityInput.value = 0.5;
    ui.getUISelectors().probDisplay.textContent = 0.5;
    ui.getUISelectors().totalFlips.textContent = 0;
    ui.getUISelectors().lowerBound.value = 0;
    ui.getUISelectors().upperBound.value = 0;
    ui.getUISelectors().sampleInRangeDisplay.textContent = 0;
    ui.getUISelectors().meanDisplay.textContent = 0;
    ui.getUISelectors().stdDisplay.textContent = 0;
    ui.getUISelectors().proportionDisplay.textContent = 0;
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