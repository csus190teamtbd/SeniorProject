import ChartModule from "./oneProportionChart";

import Calculation from "./calculation";
import { ui } from "./ui";
class OneProportionModule {
  init() {
    ui.loadUI();
    this.loadEventListeners();
    this.chart = new ChartModule(ui.getUISelectors().chart);
    this.cal = null;
    this.reset();
  }

  loadEventListeners() {
    const probabilityInput = ui.getUISelectors().probabilityInput;
    const coinsInput = ui.getUISelectors().coinsInput;
    const probDisplay = ui.getUISelectors().probDisplay;
    const totalFlips = ui.getUISelectors().totalFlips;

    // probabilty display
    probabilityInput.addEventListener("input", e => {
      probDisplay.textContent = e.target.value;
    });

    // draw sample button
    ui.getUISelectors().sampleBtn.addEventListener("click", e => {
      coinsInput.setAttribute("disabled", true);
      probabilityInput.setAttribute("disabled", true);
      this.updateCalculation();
      totalFlips.textContent = this.cal.dataSet.totalFlips;
      this.updateStatNumbers();
      this.chart.updateChartData(this.cal.dataSet);
      e.preventDefault();
    });

    // reset button
    ui.getUISelectors().resetBtn.addEventListener("click", e => {
      this.reset();
      e.preventDefault();
    });

    ui.getUISelectors().lowerBound.addEventListener("input", () => {
      this.updateStatNumbers();
    });

    ui.getUISelectors().upperBound.addEventListener("input", () => {
      this.updateStatNumbers();
    });

    /**
     * Double Click to Zoom in if no of toss > 50;
     */
    ui.getUISelectors().chart.addEventListener("dblclick", () => {
      console.log("XXX");
      if (this.cal && this.cal.dataSet.noOfCoin >= 50 && !this.chart.zoomIn) {
        this.chart.zoomIn = true;
        this.chart.updateChartData(this.cal.dataSet);
      } else if (this.cal) {
        this.chart.zoomIn = false;
        this.chart.updateChartData(this.cal.dataSet);
      }
    });
  }

  updateCalculation() {
    const probabilityValue = parseFloat(
      ui.getUISelectors().probabilityInput.value
    );
    const coinsValue = parseInt(ui.getUISelectors().coinsInput.value);
    const drawValue = parseInt(ui.getUISelectors().drawInput.value);
    if (!this.cal) {
      this.cal = new Calculation(coinsValue, probabilityValue, drawValue);
    } else {
      this.cal.addSampleDatas(drawValue);
    }
  }

  updateStatNumbers() {
    const lowerBoundValue = parseInt(ui.getUISelectors().lowerBound.value);
    const upperBoundValue = parseInt(ui.getUISelectors().upperBound.value);
    if (!(isNaN(lowerBoundValue) || isNaN(upperBoundValue)) && this.cal) {
      this.cal.upDateNumberOfSamplesInRange(lowerBoundValue, upperBoundValue);
      ui.getUISelectors().sampleInRangeDisplay.textContent = this.cal.dataSet.sampleSelected;

      const total = this.cal.dataSet.totalFlips;
      ui.getUISelectors().proportionDisplay.textContent = `${
        this.cal.dataSet.sampleSelected
      } / ${total} = ${(this.cal.dataSet.sampleSelected / total).toFixed(2)}`;

      ui.getUISelectors().meanDisplay.textContent = this.cal.dataSet.mean.toFixed(
        3
      );
      ui.getUISelectors().stdDisplay.textContent = this.cal.dataSet.std.toFixed(
        3
      );

      this.chart.updateChartData(this.cal.dataSet);
    }
  }

  reset() {
    ui.getUISelectors().coinsInput.removeAttribute("disabled");
    ui.getUISelectors().coinsInput.value = 5;
    ui.getUISelectors().drawInput.value = 1;
    ui.getUISelectors().probabilityInput.removeAttribute("disabled");
    ui.getUISelectors().probabilityInput.value = 0.5;
    ui.getUISelectors().probDisplay.textContent = 0.5;
    ui.getUISelectors().totalFlips.textContent = 0;
    ui.getUISelectors().lowerBound.value = 0;
    ui.getUISelectors().upperBound.value = 0;
    ui.getUISelectors().sampleInRangeDisplay.textContent = 0;
    ui.getUISelectors().meanDisplay.textContent = 0;
    ui.getUISelectors().stdDisplay.textContent = 0;
    ui.getUISelectors().proportionDisplay.textContent = 0;
    this.chart.resetChartData();
    this.cal = null;
  }
}

export const oneProportion = new OneProportionModule();
