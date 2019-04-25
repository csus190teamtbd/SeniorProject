import {
  dropTextFileOnTextArea,
  parseCSVtoSingleArray,
  readLocalFile,
  parseTranslationCSV
} from "../util/csv.js";
import StackedDotChart from "../util/stackeddotchart.js";
import { randomSubset, splitByPredicate } from "../util/sampling.js";
import * as MathUtil from "/util/math.js";
import { readTranlationData } from "../util/translation.js";

export class OneMean {
  constructor(OneMeanDiv) {
    this.shiftMean = 0;
    this.mulFactor = 0;
    this.populationData = [];
    this.originalData = [];
    this.mostRecentDraw = [];
    this.sampleMeans = [];
    this.sampleSize = undefined;
    this.translationData = undefined;
    this.tailDiection = null;
    this.sampleData = {
      // has to hardcode if not using server
      "Select Sample Data": null,
      Sample1: "../sampleData/sample1.csv",
      Sample2: "../sampleData/sample2.csv"
    };
    this.ele = {
      csvTextArea: OneMeanDiv.querySelector("#csv-input"),
      loadDataBtn: OneMeanDiv.querySelector("#load-data-btn"),
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
      proportionDisplay: OneMeanDiv.querySelector("#proportion"),
      oneMeanDiv: OneMeanDiv,
      runSimErrorMsg: OneMeanDiv.querySelector("#run-sim-error-msg"),
      sampleDataDropDown: OneMeanDiv.querySelector("#sample-data"),
      resetBtn: OneMeanDiv.querySelector("#reset-btn"),
      translationData: OneMeanDiv.querySelector("#translation-data")
    };

    this.readTranlationData();

    console.log(this.translationData);
    this.datasets = [
      {
        label: this.translationData.original,
        backgroundColor: "orange",
        data: []
      },
      {
        label: this.translationData.hypotheticalPopulation,
        backgroundColor: "orange",
        data: []
      },
      {
        label: this.translationData.mostRecentDrawn,
        backgroundColor: "blue",
        data: []
      },
      [
        {
          label: this.translationData.Samples,
          backgroundColor: "green",
          data: []
        },
        { label: "N/A", backgroundColor: "red", data: [] }
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
        this.mulFactor = 0;
        this.clearResult();
        this.updatedPopulationData(
          this.originalData,
          this.shiftMean,
          this.mulFactor
        );
        e.preventDefault();
      });

      dropTextFileOnTextArea(this.ele.csvTextArea);
      this.sampleListListener();
      this.shiftMeanListener();
      this.mulFactorListener();
      this.resetBtnListener();

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

      this.ele.oneMeanDiv.addEventListener("click", e => {
        if (e.target.className === "toggle-box") {
          const div = e.target.parentElement.nextElementSibling;
          div.style.display = div.style.display === "none" ? "flex" : "none";
        }
      });
    };
    this.loadSampleDataList();
    this.loadEventListener();
  }

  loadSampleDataList() {
    Object.keys(this.sampleData).forEach(x => {
      const option = document.createElement("option", {});
      option.setAttribute("value", x);
      option.innerText = x;
      this.ele.sampleDataDropDown.appendChild(option);
    });
  }

  runSim(sampleSize, noOfSample) {
    // if (this.populationData.length === 0) return;
    const newMeanSamples = [];
    try {
      if (!this.populationData.length) throw "ERROR: No Population Data";
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
    } catch (err) {
      this.ele.runSimErrorMsg.innerText = `${err}`;
      setTimeout(() => {
        this.ele.runSimErrorMsg.innerText = "";
      }, 2000);
    }
    this.updateData(this.dataName.mostRecentDraw);
    this.updateData(this.dataName.sampleMeans);
  }

  resetBtnListener() {
    this.ele.resetBtn.addEventListener("click", e => {
      console.log("reset");
      this.clearResult();
      this.ele.csvTextArea.value = "";
      this.originalData = [];
      this.updateData(this.dataName.orginalData);
      this.shiftMean = 0;
      this.mulFactor = 0;
      this.clearResult();
      this.ele.sampleDataDropDown.selectedIndex = 0;
      this.updatedPopulationData(
        this.originalData,
        this.shiftMean,
        this.mulFactor
      );
      e.preventDefault();
    });
  }

  async readTranlationData() {
    try {
      const r = await fetch("../translationSource/translationData.csv");
      const t = await r.text();
      this.translationData = t;
    } catch (err) {
      console.log("cannot load csv");
    }
  }

  sampleListListener() {
    this.ele.sampleDataDropDown.addEventListener("change", () => {
      const sampleName = this.ele.sampleDataDropDown.value;
      if (sampleName != "Select Sample Data") {
        readLocalFile(this.sampleData[sampleName]).then(
          text => (this.ele.csvTextArea.value = text)
        );
      } else this.ele.csvTextArea.value = "";
    });
  }

  shiftMeanListener() {
    this.ele.shiftMeanInput.addEventListener("input", e => {
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
      this.ele.mulFactorDisplay.innerText = mulFactor;
    });
    this.ele.mulFactorSlider.addEventListener("input", e => {
      const mulFactor = Number(e.target.value);
      this.updatedPopulationData(this.originalData, this.shiftMean, mulFactor);
      this.ele.mulFactorDisplay.innerText = mulFactor;
      this.clearResult();
    });
  }

  updatedPopulationData(orginalData, shift, mulFactor) {
    this.shiftMean = shift;
    this.ele.shiftMeanInput.value = shift;
    this.mulFactor = mulFactor;
    this.populationData = [];
    for (let i = 0; i < mulFactor + 1; i++) {
      this.populationData = this.populationData.concat(
        orginalData.map(x => ({
          id: x.id + i * orginalData.length,
          value: MathUtil.roundToPlaces(x.value + shift, 4)
        }))
      );
    }
    this.updateData(this.dataName.populationData);
  }

  clearResult() {
    this.ele.shiftMeanInput.value = this.shiftMean;
    this.ele.mulFactorSlider.value = this.mulFactor;
    this.ele.mulFactorDisplay.innerText = this.mulFactor;
    this.mostRecentDraw = [];
    this.sampleMeans = [];
    this.tailDiection = null;
    this.ele.tailDirectionInput.value = this.tailDiection;
    this.updateData(this.dataName.mostRecentDraw);
    this.updateData(this.dataName.sampleMeans);
  }

  //update chart, mean and textarea based on the dataName
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
        const tailDirection = this.ele.tailDirectionInput.value;
        const tailInput = Number(this.ele.tailValueInput.value);
        const mean = MathUtil.roundToPlaces(MathUtil.mean(this.sampleMeans), 2);
        const { chosen, unchosen } = splitByPredicate(
          valuesArr,
          this.predicateForTail(tailDirection, tailInput, mean)
        );
        //update statistic output
        this.updateStatistic(chosen.length, unchosen.length);
        this.updateSampleMeansChartLabels(tailDirection, tailInput, mean);
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
    chart.scaleToStackDots();
    chart.chart.update();

    //update mean output
    const mean = data.length
      ? MathUtil.roundToPlaces(MathUtil.mean(valuesArr), 2)
      : this.translationData.noData;
    meanEle.innerText = mean;
    if (dataName === this.dataName.orginalData && !isNaN(mean)) {
      this.ele.tailValueInput.value = mean;
    }
    // update text area output
    if (dataName !== this.dataName.sampleMeans) {
      textAreaEle.value = data.reduce(
        (acc, x) => acc + `${x.id}\t${x.value}\n`,
        `${this.translationData.id}\t${this.translationData.value}\n`
      );
    } else {
      textAreaEle.value = data.reduce(
        (acc, x, index) => acc + `${index + 1}\t${x}\n`,
        `${this.translationData.sampleNo}\t${this.translationData.mean2}\n`
      );
    }
  }

  updateStatistic(totalChosen, totalUnchosen) {
    const totalSamples = totalChosen + totalUnchosen;
    const proportion = MathUtil.roundToPlaces(totalChosen / totalSamples, 5);
    this.ele.totalSelectedSamplesDisplay.innerText = totalChosen;
    this.ele.totalSamplesDisplay.innerText = totalSamples;
    this.ele.proportionDisplay.innerText = ` ${totalChosen} / ${totalSamples} = ${proportion}`;
  }

  predicateForTail(tailDirection, tailInput, mean) {
    if (tailDirection === "null") {
      return null;
    } else if (tailDirection === "oneTailRight") {
      return function(x) {
        return x >= tailInput;
      };
    } else if (tailDirection === "oneTailLeft") {
      return function(x) {
        return x <= tailInput;
      };
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - tailInput), 2);
      return function(x) {
        return x <= mean - distance || x >= mean + distance;
      };
    }
  }

  updateSampleMeansChartLabels(tailDirection, tailInput, mean) {
    const sampleName = this.translationData.samples;
    if (tailDirection === "null") {
      this.dataChart4.updateLabelName(0, "${sampleName}");
      this.dataChart4.updateLabelName(1, "N/A");
    } else if (tailDirection === "oneTailRight") {
      this.dataChart4.updateLabelName(0, `${sampleName} < ${tailInput}`);
      this.dataChart4.updateLabelName(1, `${sampleName} >= ${tailInput}`);
    } else if (tailDirection === "oneTailLeft") {
      this.dataChart4.updateLabelName(0, `${sampleName} > ${tailInput}`);
      this.dataChart4.updateLabelName(1, `${sampleName} <= ${tailInput}`);
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - tailInput), 2);
      const left = mean - distance;
      const right = mean + distance;
      this.dataChart4.updateLabelName(0, `${left} < ${sampleName} < ${right}`);
      this.dataChart4.updateLabelName(
        1,
        `${sampleName} <= ${left} or ${sampleName} >= ${right}`
      );
    }
  }
}
