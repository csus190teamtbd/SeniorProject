import ChartModule from "./oneProportionChart";
import { generateCoins } from "./animation";
import Calculation from "./calculation";
import { ui } from "./ui";
class OneProportionModule {
  init() {
    ui.loadUI();
    this.reset();
    this.loadEventListeners();
    this.chart = new ChartModule(ui.getUISelectors().chart);
    this.cal = null;
  }

  loadEventListeners() {
    const probabilityInput = ui.getUISelectors().probabilityInput;
    const coinsInput = ui.getUISelectors().coinsInput;
    const probDisplay = ui.getUISelectors().probDisplay;

    // probabilty display
    probabilityInput.addEventListener("input", e => {
      probDisplay.textContent = e.target.value;
    });

    // draw sample button
    ui.getUISelectors().sampleBtn.addEventListener("click", e => {
      coinsInput.setAttribute("disabled", true);
      probabilityInput.setAttribute("disabled", true);
      const coinsValue = Number(coinsInput.value);
      const probabilityValue = Number(probabilityInput.value);
      const drawValue = Number(ui.getUISelectors().drawInput.value);

      if (!this.cal) this.cal = new Calculation(coinsValue, probabilityValue);

      // calcaute the results of draw samples
      const drawResults = this.cal.drawSamples(drawValue);

      // clear animations and generate new one
      while (ui.getUISelectors().animation.firstChild)
        ui.getUISelectors().animation.firstChild.remove();

      generateCoins(drawResults).forEach(x =>
        ui.getUISelectors().animation.appendChild(x)
      );

      //update and calculate
      this.cal.updateCalculation(drawResults, drawValue);

      this.updateContolPanelStats();
      this.chart.updateChartData(this.cal.dataSet);
      e.preventDefault();
    });

    // reset button
    ui.getUISelectors().resetBtn.addEventListener("click", e => {
      this.reset();
      e.preventDefault();
    });

    ui.getUISelectors().lowerBound.addEventListener("input", () => {
      this.updateContolPanelStats();
    });

    ui.getUISelectors().upperBound.addEventListener("input", () => {
      this.updateContolPanelStats();
    });

    /**
     * Double Click to Zoom in if no of toss > 50;
     */
    ui.getUISelectors().chart.addEventListener("dblclick", () => {
      if (this.cal && this.cal.dataSet.noOfCoin >= 50 && !this.chart.zoomIn) {
        this.chart.zoomIn = true;
        this.chart.updateChartData(this.cal.dataSet);
      } else if (this.cal) {
        this.chart.zoomIn = false;
        this.chart.updateChartData(this.cal.dataSet);
      }
    });
  }

  updateContolPanelStats() {
    totalFlips.textContent = this.cal.dataSet.totalFlips;
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
    if (this.chart) this.chart.resetChartData();
    this.cal = null;
  }
}

export const oneProportion = new OneProportionModule();
