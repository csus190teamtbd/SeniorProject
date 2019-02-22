import ChartModule from "./chartModule.js";
import { cal } from "./calculation.js";
import { generateCoins } from "./animation.js";

export class OneProportion {
  constructor() {
    this.initState = () => {
      return {
        noOfCoin: 5,
        probability: 0.5,
        labels: [],
        binomailForOne: [],
        binomail: [],
        samples: [],
        selected: [],
        mean: NaN,
        std: NaN,
        noOfSelected: 0,
        totalSamples: 0,
        lowerSelectedRange: 0,
        upperSelectedRange: 0,
        thisSampleSizes: 1,
        started: false,
        zoomIn: false
      };
    };

    this.ele = {
      probabilityInput: document.getElementById("probability"),
      coinsInput: document.getElementById("coins"),
      probDisplay: document.getElementById("probDisplay"),
      drawInput: document.getElementById("draws"),
      chart: document.getElementById("chart"),
      totalSamples: document.getElementById("totalSamples"),
      lowerSelectedRange: document.getElementById("lowerSelectedRange"),
      upperSelectedRange: document.getElementById("upperSelectedRange"),
      sampleInRangeDisplay: document.getElementById("sampleInRangeDisplay"),
      resetBtn: document.getElementById("resetBtn"),
      sampleBtn: document.getElementById("sampleBtn"),
      proportionDisplay: document.getElementById("proportionDisplay"),
      meanDisplay: document.getElementById("meanDisplay"),
      stdDisplay: document.getElementById("stdDisplay"),
      view: document.getElementById("view"),
      animation: document.getElementById("animation")
    };
    this.state = this.initState();
    this.updateView = state => {
      this.ele.probDisplay.innerText = state.probability;
      this.ele.totalSamples.innerText = state.totalSamples;
      this.ele.meanDisplay.innerText = state.mean.toFixed(3);
      this.ele.stdDisplay.innerText = state.std.toFixed(3);
      this.ele.drawInput.value = state.thisSampleSizes;
      this.ele.coinsInput.value = state.noOfCoin;
      this.ele.probabilityInput.value = state.probability;
      this.ele.sampleInRangeDisplay.innerText = this.state.noOfSelected;
      this.ele.lowerSelectedRange.value = this.state.lowerSelectedRange;
      this.ele.upperSelectedRange.value = this.state.upperSelectedRange;
      this.ele.proportionDisplay.innerText = `${this.state.noOfSelected} / ${
        this.state.totalSamples
      } = ${(this.state.noOfSelected / this.state.totalSamples).toFixed(3)}`;
    };

    this.reset = e => {
      this.state = this.initState();
      this.updateView(this.state);
      this.chart.updateChartData(this.state);
      this.ele.coinsInput.removeAttribute("disabled");
      this.ele.probabilityInput.removeAttribute("disabled");
      e.preventDefault();
    };

    this.chart = new ChartModule(this.ele.chart);

    this.loadEventListener = () => {
      this.ele.probabilityInput.addEventListener("input", e => {
        probDisplay.innerText = e.target.value;
      });

      this.ele.resetBtn.addEventListener("click", this.reset);

      this.ele.sampleBtn.addEventListener("click", e => {
        const probability = Number(this.ele.probabilityInput.value);
        const coinsInput = Number(this.ele.coinsInput.value);
        const drawInput = Number(this.ele.drawInput.value);
        const newSamples = cal.drawSamples(probability, coinsInput, drawInput);
        this.updateSate(
          this.state,
          probability,
          coinsInput,
          drawInput,
          newSamples
        );
        this.updatedSelected();
        this.chart.updateChartData(this.state);
        this.updateView(this.state);
        this.ele.coinsInput.setAttribute("disabled", "");
        this.ele.probabilityInput.setAttribute("disabled", "");

        while (this.ele.animation.firstChild)
          this.ele.animation.firstChild.remove();
        generateCoins(newSamples).forEach(x =>
          this.ele.animation.appendChild(x)
        );
        e.preventDefault();
      });

      /**
       * Double Click to Zoom in if no of toss > 50;
       */
      this.ele.chart.addEventListener("dblclick", () => {
        if (!this.state.zoomIn && this.state.noOfCoin >= 50)
          this.state.zoomIn = true;
        else this.state.zoomIn = false;
        this.chart.updateChartData(this.state);
      });

      this.ele.lowerSelectedRange.addEventListener("input", () => {
        this.updatedSelected();
        this.updateView(this.state);
        this.chart.updateChartData(this.state);
      });

      this.ele.upperSelectedRange.addEventListener("input", () => {
        this.updatedSelected();
        this.updateView(this.state);
        this.chart.updateChartData(this.state);
      });
    };

    this.updatedSelected = () => {
      const lower = Number(this.ele.lowerSelectedRange.value);
      const upper = Number(this.ele.upperSelectedRange.value);
      this.state.lowerSelectedRange = lower;
      this.state.upperSelectedRange = upper;
      this.state.noOfSelected = cal.calculateSamplesSelected(
        lower,
        upper,
        this.state.samples
      );
      this.state.selected = cal.generateSelectedArray(
        lower,
        upper,
        this.state.noOfCoin
      );
    };

    this.updateSate = (
      state,
      probability,
      coinsInput,
      drawInput,
      newSamples
    ) => {
      if (!state.started) {
        state.probability = probability;
        state.noOfCoin = coinsInput;
        state.labels = cal.generateLabels(coinsInput);
        state.samples = Array(coinsInput + 1).fill(0);
        state.binomailForOne = cal.calculateBinonimalForOne(
          coinsInput,
          probability
        );
        state.started = true;
      }
      state.thisSampleSizes = drawInput;
      state.totalSamples = state.totalSamples += drawInput;
      state.samples = cal.addSamples(state.samples, newSamples);
      state.binomail = state.binomailForOne.map(x => x * state.totalSamples);
      state.mean = cal.calculateMean(state.samples);
      state.std = cal.calucalteStd(state.samples);
    };

    this.updateView(this.state);
    this.loadEventListener();
  }
}
