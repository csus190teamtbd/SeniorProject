import { dropTextFileOnTextArea, parseCSVtoSingleArray } from "../util/csv.js";
import StackedDotChart from "../util/stackeddotchart.js";
import { randomSubset, splitByPredicate } from "../util/sampling.js";
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
    this.tailDiection = null;
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
      noOfSampleInput: OneMeanDiv.querySelector("#no-of-sample"),
      tailValueInput: OneMeanDiv.querySelector("#tailValue"),
      tailDirectionInput: OneMeanDiv.querySelector("#tailDirection"),
      totalSelectedSamplesDisplay: OneMeanDiv.querySelector(
        "#total-selected-samples"
      ),
      totalSamplesDisplay: OneMeanDiv.querySelector("#total-samples"),
      proportionDisplay: OneMeanDiv.querySelector("#proportion")
    };
    this.datasets = [
      { label: "Original", backgroundColor: "#333333", data: [] },
      { label: "Population", backgroundColor: "#93cb52", data: [] },
      { label: "Most Recent Drawn", backgroundColor: "#333333", data: [] },
      [
        { label: "Not Selected", backgroundColor: "lightgray", data: [] },
        { label: "Selected", backgroundColor: "blue", data: [] }
      ]
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
      this.datasets[3]
    );
    this.dataName = {
      orginalData: "orginalData",
      populationData: "populationData",
      mostRecentDraw: "mostRecentDraw",
      sampleMeans: "sampleMeans"
    };
    this.loadEventListener = () => {
      this.ele.loadDataBtn.addEventListener("click", e => {
        this.originalData = parseCSVtoSingleArray(this.ele.csvTextArea.value);
        this.updateData(this.dataName.orginalData);
        this.shiftMean = 0;
        this.mulFactor = 1;
        this.clearResult();
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

      this.ele.tailDirectionInput.addEventListener("change", e => {
        if (this.sampleMeans.length) this.updateData(this.dataName.sampleMeans);
      });

      this.ele.tailValueInput.addEventListener("input", e => {
        if (this.sampleMeans.length) this.updateData(this.dataName.sampleMeans);
      });
    };
    this.loadEventListener();
  }

  runSim(sampleSize, noOfSample) {
    if (this.populationData.length === 0) return;
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

    this.updateData(this.dataName.mostRecentDraw);
    this.updateData(this.dataName.sampleMeans);
  }

  shiftMeanListener() {
    this.ele.shiftMeanInput.addEventListener("input", e => {
      this.updatedPopulationData(
        this.originalData,
        Number(e.target.value) || 0,
        this.mulFactor
      );
      this.clear();
    });
    this.ele.shiftMeanSlider.addEventListener("change", e => {
      this.updatedPopulationData(
        this.originalData,
        Number(e.target.value) || 0,
        this.mulFactor
      );
      this.clearResult();
    });
  }

  mulFactorListener() {
    this.ele.mulFactorSlider.addEventListener("change", e => {
      const mulFactor = Number(e.target.value);
      this.updatedPopulationData(this.originalData, this.shiftMean, mulFactor);
      this.ele.mulFactorDisplay.innerText = mulFactor;
      this.clearResult();
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
    this.updateData(this.dataName.populationData);
  }

  clearResult() {
    this.ele.shiftMeanInput.value = this.shiftMean;
    this.ele.shiftMeanSlider.value = this.shiftMean;
    this.ele.mulFactorSlider.value = this.mulFactor;
    this.ele.mulFactorDisplay.innerText = this.mulFactor;
    this.mostRecentDraw = [];
    this.sampleMeans = [];
    this.tailDiection = null;
    this.ele.tailDirectionInput.value = this.tailDiection;
    this.updateData(this.dataName.mostRecentDraw);
    this.updateData(this.dataName.sampleMeans);
  }

  updateData(dataName) {
    let chart, data, meanEle, key, textAreaEle;
    if (dataName === this.dataName.orginalData) {
      chart = this.dataChart1;
      data = this.originalData;
      meanEle = this.ele.originalMean;
      textAreaEle = this.ele.originalDataDisplay;
    } else if (dataName === this.dataName.populationData) {
      chart = this.dataChart2;
      data = this.populationData;
      meanEle = this.ele.polulationMean;
      textAreaEle = this.ele.populationDataDisplay;
    } else if (dataName === this.dataName.mostRecentDraw) {
      chart = this.dataChart3;
      data = this.mostRecentDraw;
      meanEle = this.ele.sampleMean;
      textAreaEle = this.ele.recentSampleDisplay;
    } else {
      chart = this.dataChart4;
      data = this.sampleMeans;
      meanEle = this.ele.samplesMean;
      textAreaEle = this.ele.sampleMeansDisplay;
    }
    // update chart
    let valuesArr = null;
    let pointRadius = 6;
    if (data.length) {
      if (dataName !== this.dataName.sampleMeans) {
        valuesArr = data.map(x => x.value);
        chart.setDataFromRaw([valuesArr]);
      } else {
        valuesArr = data;
        const { chosen, unchosen } = splitByPredicate(
          valuesArr,
          this.predicateForTail()
        );
        //update statistic output
        this.updateStatistic(chosen.length, unchosen.length);
        chart.setDataFromRaw([unchosen, chosen]);
        pointRadius = 2;
      }
      if (data.length > 500) chart.setAnimationDuration(0);
      else chart.setAnimationDuration(1000);
      chart.changeDotAppearance(pointRadius, undefined);
      let min = MathUtil.minInArray(valuesArr);
      let max = MathUtil.maxInArray(valuesArr);
      chart.setScale(min, max);
    } else {
      chart.clear();
    }
    chart.chart.update();

    //update mean output
    const mean = data.length
      ? MathUtil.roundToPlaces(MathUtil.mean(valuesArr), 2)
      : "No Data";
    meanEle.innerText = mean;
    if (dataName === this.dataName.orginalData && !isNaN(mean)) {
      this.ele.tailValueInput.value = mean;
    }
    // update text area output
    if (dataName !== this.dataName.sampleMeans) {
      textAreaEle.value = data.reduce(
        (acc, x) => acc + `${x.id}\t${x.value}\n`,
        `ID\tValue\n`
      );
    } else {
      textAreaEle.value = data.reduce(
        (acc, x, index) => acc + `${index + 1}\t${x}\n`,
        `sample#\tmean\n`
      );
    }
  }

  updateStatistic(totalChosen, totalUnchosen) {
    this.ele.totalSelectedSamplesDisplay.innerText = totalChosen;
    this.ele.totalSamplesDisplay.innerText = totalChosen + totalUnchosen;
    this.ele.proportionDisplay.innerText = MathUtil.roundToPlaces(
      totalChosen / (totalChosen + totalUnchosen),
      5
    );
  }

  predicateForTail() {
    const tailDirection = this.ele.tailDirectionInput.value;
    const tailInput = Number(this.ele.tailValueInput.value);
    if (tailDirection === "null") {
      return function(x) {
        return false;
      };
    } else if (tailDirection === "oneTailRight") {
      return function(x) {
        return x >= tailInput;
      };
    } else if (tailDirection === "oneTailLeft") {
      return function(x) {
        return x <= tailInput;
      };
    } else {
      const MeanOfSampleMeans = MathUtil.roundToPlaces(
        MathUtil.mean(this.sampleMeans),
        2
      );
      const distance = Math.abs(MeanOfSampleMeans - tailInput);
      return function(x) {
        return (
          x <= MeanOfSampleMeans - distance || x >= MeanOfSampleMeans + distance
        );
      };
    }
  }
}
