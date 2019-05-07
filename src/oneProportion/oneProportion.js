---
---
import ChartModule from "{{base}}./chartModule.js";
import { cal } from "{{base}}./calculation.js";
import translation from "{{base}}../util/translate.js";
export class OneProportion {
  constructor(ele) {
    this.initState = () => {
      return {
        noOfCoin: 5,
        probability: 0.5,
        labels: [],
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
        zoomIn: false
      };
    };

    this.ele = {
      probabilityInput: document.getElementById("probability"),
      coinsInput: document.getElementById("coins"),
      probDisplay: document.getElementById("probDisplay"),
      tossesDisplay: document.querySelectorAll("#tossesDisplay"),
      lowerDisplay: document.getElementById("lowerDisplay"),
      upperDisplay: document.getElementById("upperDisplay"),
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
      stdDisplay: document.getElementById("stdDisplay")
    };

    this.state = this.initState();
    this.translationData = translation.oneProportion;
    // console.log('one',this.translationData)
    this.chart = new ChartModule(this.ele.chart, this.translationData);
    this.reset = e => {
      this.state = this.initState();
      this.updateView(this.state, this.ele);
      e.preventDefault();
    };

    this.reSampleWithSameSampleSize = state => {
      const reSamples = cal.drawSamples(
        state.probability,
        state.noOfCoin,
        state.totalSamples
      );
      state.samples = cal.addSamples(
        Array(state.noOfCoin + 1).fill(0),
        reSamples
      );
      this.updateState(state);
      this.updateView(state, this.ele);
    };

    this.loadEventListener = () => {
      this.ele.probabilityInput.addEventListener("input", e => {
        this.state.probability = Number(e.target.value);
        probDisplay.innerText = Number(e.target.value);
      });

      this.ele.probabilityInput.addEventListener("change", () => {
        if (this.state.labels.length !== 0) {
          this.reSampleWithSameSampleSize(this.state);
        }
      });

      // this.ele.coinsInput.addEventListener("change", e => {
      //   this.ele.tossesDisplay.forEach(
      //     x => (x.innerText = Number(e.target.value))
      //   );
      //   this.state.noOfCoin = Number(e.target.value);
      // });

      this.ele.coinsInput.addEventListener("change", e => {
        this.ele.tossesDisplay.forEach(
          x => (x.innerText = Number(e.target.value))
        );
        this.state.noOfCoin = Number(e.target.value);

        if (this.state.labels.length !== 0) {
          this.reSampleWithSameSampleSize(this.state);
        }
      });

      this.ele.drawInput.addEventListener("change", e => {
        this.state.thisSampleSizes = Number(e.target.value);
      });

      this.ele.resetBtn.addEventListener("click", this.reset);

      this.ele.sampleBtn.addEventListener("click", e => {
        this.state.totalSamples += this.state.thisSampleSizes;
        const { probability, noOfCoin, thisSampleSizes } = this.state;
        const newSamples = cal.drawSamples(
          probability,
          noOfCoin,
          thisSampleSizes
        );
        if (this.state.samples.length === 0)
          this.state.samples = Array(this.state.noOfCoin + 1).fill(0);
        this.state.samples = cal.addSamples(this.state.samples, newSamples);
        this.updateState(this.state);
        this.updateView(this.state, this.ele);

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

      this.ele.lowerSelectedRange.addEventListener("input", e => {
        this.state.lowerSelectedRange = Number(e.target.value);
        this.updateState(this.state);
        this.updateView(this.state, this.ele);
      });

      this.ele.upperSelectedRange.addEventListener("input", e => {
        this.state.upperSelectedRange = Number(e.target.value);
        this.updateState(this.state);
        this.updateView(this.state, this.ele);
      });
    };

    this.updatedSelectedSamples = state => {
      const { lowerSelectedRange, upperSelectedRange } = state;
      state.noOfSelected = cal.calculateSamplesSelected(
        lowerSelectedRange,
        upperSelectedRange,
        state.samples
      );
      state.selected = cal.generateSelectedArray(
        lowerSelectedRange,
        upperSelectedRange,
        state.noOfCoin
      );
    };

    this.updateState = state => {
      state.labels = cal.generateLabels(state.noOfCoin);
      state.binomail = cal.calculateBinonimal(
        state.noOfCoin,
        state.probability,
        state.totalSamples
      );
      state.mean = cal.calculateMean(state.samples);
      state.std = cal.calucalteStd(state.samples);
      // this.state.zoomIn = state.noOfCoin >= 50 ? true : false;
      this.updatedSelectedSamples(state);
    };

    this.updateView = (state, ele) => {
      const {
        probability,
        noOfCoin,
        totalSamples,
        mean,
        std,
        thisSampleSizes,
        noOfSelected,
        lowerSelectedRange,
        upperSelectedRange
      } = state;
      ele.probDisplay.innerText = probability;
      ele.tossesDisplay.innerText = noOfCoin;
      ele.totalSamples.innerText = totalSamples;
      ele.meanDisplay.innerText = mean.toFixed(3);
      ele.stdDisplay.innerText = std.toFixed(3);
      ele.drawInput.value = thisSampleSizes;
      ele.coinsInput.value = noOfCoin;
      ele.lowerSelectedRange.setAttribute("max", noOfCoin);
      ele.upperSelectedRange.setAttribute("max", noOfCoin);
      ele.probabilityInput.value = probability;
      ele.sampleInRangeDisplay.innerText = noOfSelected;
      if (lowerSelectedRange > noOfCoin)
        this.state.lowerSelectedRange = noOfCoin;
      if (upperSelectedRange > noOfCoin)
        this.state.upperSelectedRange = noOfCoin;
      ele.lowerSelectedRange.value = lowerSelectedRange;
      ele.upperSelectedRange.value = upperSelectedRange;
      ele.lowerDisplay.innerText = lowerSelectedRange;
      ele.upperDisplay.innerText = upperSelectedRange;
      ele.proportionDisplay.innerText = `${noOfSelected} / ${totalSamples} = ${(
        noOfSelected / totalSamples
      ).toFixed(3)}`;
      this.chart.updateChartData(state);
    };

    this.updateView(this.state, this.ele);
    this.loadEventListener();
  }
}
