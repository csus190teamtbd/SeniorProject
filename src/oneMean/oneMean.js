import { dropTextFileOnTextArea, parseCSVtoSingleArray } from "../util/csv.js";
import StackedDotChart from "../util/stackeddotchart.js";
import { randomSubset } from "../util/sampling.js";
import * as MathUtil from "/util/math.js";

export class OneMean {
  constructor(OneMeanDiv) {
    this.shiftMean = 0;
    this.mulFactor = 1;
    this.populationData = [];
    this.originalData = [];
    this.mostRecentDraw = [];
    this.sampleMeans = [];
    this.sampleSize = undefined;
    this.ele = {
      csvTextArea: OneMeanDiv.querySelector("#csv-input"),
      loadDataBtn: OneMeanDiv.querySelector("#load-data-btn"),
      shiftMeanSlider: OneMeanDiv.querySelector("#shiftMeanSlider"),
      shiftMeanInput: OneMeanDiv.querySelector("#shiftMeanInput"),
      originalDataDisplay: OneMeanDiv.querySelector("#original-data-display"),
      populationDataDisplay: OneMeanDiv.querySelector(
        "#population-data-display"
      ),
      recentSampleDisplay: OneMeanDiv.querySelector(
        "#most-recent-sample-display"
      ),
      sampleMeansDisplay: OneMeanDiv.querySelector("#samples-mean-display"),
      sampleMean: OneMeanDiv.querySelector("#sample-mean"),
      samplesMean: OneMeanDiv.querySelector("#samples-mean"),
      originalMean: OneMeanDiv.querySelector("#original-mean"),
      polulationMean: OneMeanDiv.querySelector("#population-mean"),
      mulFactorDisplay: OneMeanDiv.querySelector("#mul-factor-display"),
      mulFactorSlider: OneMeanDiv.querySelector("#mul-factor"),
      runSimBtn: OneMeanDiv.querySelector("#run-sim-btn"),
      sampleSizeInput: OneMeanDiv.querySelector("#sample-size"),
      noOfSampleInput: OneMeanDiv.querySelector("#no-of-sample")
    };
    this.datasets = [
      { label: "Original", backgroundColor: "#333333", data: [] },
      { label: "Population", backgroundColor: "#93cb52", data: [] },
      { label: "Most Recent Drawn", backgroundColor: "#333333", data: [] },
      { label: "Sample Mean", backgroundColor: "#93cb52", data: [] }
    ];
    this.dataChart1 = new StackedDotChart(
      OneMeanDiv.querySelector("#original-data-chart"),
      [this.datasets[0]]
    );
    this.dataChart2 = new StackedDotChart(
      OneMeanDiv.querySelector("#population-data-chart"),
      [this.datasets[1]]
    );
    this.dataChart3 = new StackedDotChart(
      OneMeanDiv.querySelector("#sample-data-chart"),
      [this.datasets[2]]
    );
    this.dataChart4 = new StackedDotChart(
      OneMeanDiv.querySelector("#statistic-data-chart"),
      [this.datasets[3]]
    );
    this.loadEventListener = () => {
      this.ele.loadDataBtn.addEventListener("click", e => {
        this.originalData = parseCSVtoSingleArray(this.ele.csvTextArea.value);
        this.showDataInTextArea(
          this.ele.originalDataDisplay,
          this.originalData
        );
        this.updateChartData(
          this.dataChart1,
          this.originalData,
          this.ele.originalMean,
          "value"
        );
        this.clear();
        this.updatedPopulationData(this.originalData, 0, 1);
        e.preventDefault();
      });

      dropTextFileOnTextArea(this.ele.csvTextArea);

      this.shiftMeanListener();
      this.mulFactorListener();

      this.ele.runSimBtn.addEventListener("click", e => {
        const newSampleSize = Number(this.ele.sampleSizeInput.value);
        const noOfSamples = Number(this.ele.noOfSampleInput.value);
        this.runSim(newSampleSize, noOfSamples);
        e.preventDefault();
      });
    };
    this.loadEventListener();
  }

  runSim(sampleSize, noOfSample) {
    const newMeanSamples = [];
    for (let i = 0; i < noOfSample; i++) {
      const { chosen, unchoosen } = randomSubset(
        this.populationData,
        sampleSize
      );
      const roundedMean = MathUtil.roundToPlaces(
        MathUtil.mean(chosen.map(x => x.value)),
        3
      );
      newMeanSamples.push(roundedMean);
      if (i === noOfSample - 1) this.mostRecentDraw = chosen;
    }
    if (this.sampleSize !== sampleSize) {
      this.sampleSize = sampleSize;
      this.sampleMeans = newMeanSamples;
    } else {
      this.sampleMeans = this.sampleMeans.concat(newMeanSamples);
    }

    this.showDataInTextArea(this.ele.recentSampleDisplay, this.mostRecentDraw);
    this.updateChartData(
      this.dataChart3,
      this.mostRecentDraw,
      this.ele.sampleMean,
      "value"
    );

    this.ele.sampleMeansDisplay.value = this.sampleMeans.reduce(
      (acc, x, index) => acc + `${index + 1}\t${x}\n`,
      `sample#\tmean\n`
    );
    this.updateChartData(
      this.dataChart4,
      this.sampleMeans,
      this.ele.samplesMean
    );
  }

  showDataInTextArea(textAreaEle, arr, header1 = "ID", header2 = "Value") {
    textAreaEle.value = arr.reduce(
      (acc, x) => acc + `${x.id}\t${x.value}\n`,
      `${header1}\t${header2}\n`
    );
  }

  shiftMeanListener() {
    this.ele.shiftMeanInput.addEventListener("input", e => {
      this.updatedPopulationData(
        this.originalData,
        Number(e.target.value) || 0,
        this.mulFactor
      );
    });
    this.ele.shiftMeanSlider.addEventListener("change", e => {
      this.updatedPopulationData(
        this.originalData,
        Number(e.target.value) || 0,
        this.mulFactor
      );
    });
  }

  mulFactorListener() {
    this.ele.mulFactorSlider.addEventListener("change", e => {
      const mulFactor = Number(e.target.value);
      this.updatedPopulationData(this.originalData, this.shiftMean, mulFactor);
      this.ele.mulFactorDisplay.innerText = mulFactor;
    });
  }

  updatedPopulationData(orginalData, shift, mulFactor) {
    this.shiftMean = shift;
    this.ele.shiftMeanSlider.value = shift;
    this.ele.shiftMeanInput.value = shift;
    this.mulFactor = mulFactor;
    this.populationData = [];
    for (let i = 0; i < mulFactor; i++) {
      this.populationData = this.populationData.concat(
        orginalData.map(x => ({
          id: x.id + i * orginalData.length,
          value: x.value + shift
        }))
      );
    }
    this.showDataInTextArea(
      this.ele.populationDataDisplay,
      this.populationData
    );
    this.updateChartData(
      this.dataChart2,
      this.populationData,
      this.ele.polulationMean,
      "value"
    );
  }

  clear() {
    this.shiftMean = 0;
    this.mulFactor = 1;
    this.ele.shiftMeanInput.value = this.shiftMean;
    this.ele.shiftMeanSlider.value = this.shiftMean;
    this.ele.mulFactorSlider.value = this.mulFactor;
    this.populationData = [];
    this.mostRecentDraw = [];
    this.sampleMeans = [];
  }

  updateChartData(chart, data, meanEle, key) {
    let valuesArr = null;
    if (data.length) {
      if (key) valuesArr = data.map(x => x[key]);
      else valuesArr = data;
      chart.setDataFromRaw([valuesArr]);
      const pointSize = chart.changeDotAppearance(1, undefined);
      let min = MathUtil.minInArray(valuesArr);
      let max = MathUtil.maxInArray(valuesArr);
      chart.setScale(min, max);
    }
    chart.chart.update();
    meanEle.innerText = data.length
      ? MathUtil.roundToPlaces(MathUtil.mean(valuesArr), 2)
      : "No Data";
  }
}
