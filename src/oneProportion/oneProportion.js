import ChartModule from './oneProportionChart';

import Calculation from './calculation';
import {ui} from './ui';
class OneProportionModule{
  constructor(){
    this.cal;
  }

  init(){
    ui.loadUI();
    this.loadEventListeners();
    this.chart = new ChartModule(ui.getUISelectors().chart);
    this.cal = null;
    this.reset();
  }

  loadEventListeners(){
    const probabilityInput = ui.getUISelectors().probabilityInput;
    const coinsInput = ui.getUISelectors().coinsInput;
    const probDisplay = ui.getUISelectors().probDisplay;
    const totalFlips = ui.getUISelectors().totalFlips;
    

    // probabilty display
    probabilityInput.addEventListener('input', (e)=>{
      probDisplay.textContent = e.target.value;
    });

    // draw sample button
    ui.getUISelectors().sampleBtn.addEventListener('click', (e)=>{
      coinsInput.setAttribute('disabled', true);
      probabilityInput.setAttribute('disabled', true);
      this.updateCalculation();
      totalFlips.textContent = this.cal.getDataSet().totalFlips;
      this.updateStatNumbersDisplay();
      if (this.cal.dataSet.label.length <=50)
        this.chart.UpdateChartData(this.cal.dataSet.label, this.cal.dataSet.sample, this.cal.dataSet.binomail);
      else{
        const std = this.cal.getSTD();
        const mean = this.cal.getMean();
        const lowerRange = mean-3*std > 0 ? Math.floor(mean-3*std) : 0
        const upperRange = mean+3*std;
        this.chart.UpdateChartData(
          this.cal.dataSet.label.slice(lowerRange, upperRange), 
          this.cal.dataSet.sample.slice(lowerRange, upperRange), 
          this.cal.dataSet.binomail.slice(lowerRange, upperRange));
      }
      e.preventDefault();
    });

    // reset button
    ui.getUISelectors().resetBtn.addEventListener('click', (e)=>{
      this.reset();
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
    const probabilityValue = parseFloat(ui.getUISelectors().probabilityInput.value);
    const coinsValue = parseInt(ui.getUISelectors().coinsInput.value);
    const drawValue = parseInt(ui.getUISelectors().drawInput.value);
    if (!this.cal){
      this.cal = new Calculation(coinsValue, probabilityValue, drawValue);
    }else{
        this.cal.addSampleDatas(drawValue);
    }
  }

  updateStatNumbersDisplay(){
    const lowerBoundValue = parseInt(ui.getUISelectors().lowerBound.value);
    const upperBoundValue = parseInt(ui.getUISelectors().upperBound.value);
    if (!(isNaN(lowerBoundValue) || isNaN(upperBoundValue)) && this.cal){
      const noOfsamplesinRange = this.cal.getNumberOfSamplesInRange(lowerBoundValue, upperBoundValue);
      ui.getUISelectors().sampleInRangeDisplay.textContent = noOfsamplesinRange;

      const total = this.cal.getDataSet().totalFlips;
      ui.getUISelectors().proportionDisplay.textContent = 
      `${noOfsamplesinRange} / ${total} = ${(noOfsamplesinRange/total).toFixed(2)}`;

      ui.getUISelectors().meanDisplay.textContent = this.cal.getMean();
      ui.getUISelectors().stdDisplay.textContent = this.cal.getSTD().toFixed(3);

      this.chart.updateAnnotation(lowerBoundValue, upperBoundValue);
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
    this.chart.UpdateChartData([],[],[]);
    this.chart.updateAnnotation(0,0);
    this.cal = null;
  }
}

export const oneProportion = new OneProportionModule();
