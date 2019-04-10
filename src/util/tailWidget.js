import StackedDotChart from "../util/stackeddotchart.js";
import * as MathUtil from "/util/math.js";
import { randomSubset, splitByPredicate } from "../util/sampling.js";

export default class TailWidget {

  constructor(widgetSection, resultMap) {
    this.tailDiection = null;
    this.dom = {
      tailValueInput: widgetSection.querySelector("#tailValue"),
      tailDirectionInput: widgetSection.querySelector("#tailDirection"),
      totalSelectedSamplesDisplay: widgetSection.querySelector(
        "#total-selected-samples"
      ),
      totalSamplesDisplay: widgetSection.querySelector("#total-samples"),
      proportionDisplay: widgetSection.querySelector("#proportion"),
      sampleMeansDisplay: widgetSection.querySelector("#samples-mean-display"),
      samplesMean: widgetSection.querySelector("#samples-mean"),
    };
    this.chart = new StackedDotChart(
      widgetSection.querySelector("#statistic-data-chart"),
      [
        { label: "Samples", backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
      ]
    );
    this.sampleMeans = [];

    this.dom.tailDirectionInput.addEventListener("change", e => {
      if (this.sampleMeans.length) this.updateChart();
    });

    this.dom.tailValueInput.addEventListener("input", e => {
      if (this.sampleMeans.length) this.updateChart();
    });

  }

  reset() {
    this.tailDiection = null;
    this.dom.tailDirectionInput.value = this.tailDiection;
  }

  addResult(result) {
    this.sampleMeans.push(result);
  }

  addAllResults(results) {
    for (let result of results) {
      this.addResult(result);
    }
  }

  dropResults() {
    this.sampleMeans = [];
  }

  updateSampleMeansChartLabels(tailDirection, tailInput, mean) {
    if (tailDirection === "null") {
      this.chart.updateLabelName(0, "samples");
      this.chart.updateLabelName(1, "N/A");
    } else if (tailDirection === "oneTailRight") {
      this.chart.updateLabelName(0, `samples < ${tailInput}`);
      this.chart.updateLabelName(1, `samples >= ${tailInput}`);
    } else if (tailDirection === "oneTailLeft") {
      this.chart.updateLabelName(0, `samples > ${tailInput}`);
      this.chart.updateLabelName(1, `samples <= ${tailInput}`);
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - tailInput), 2);
      const left = mean - distance;
      const right = mean + distance;
      this.chart.updateLabelName(0, `${left} < samples < ${right}`);
      this.chart.updateLabelName(
        1,
        `samples <= ${left} or samples >= ${right}`
      );
    }
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

  updateStatistic(totalChosen, totalUnchosen) {
    this.dom.totalSelectedSamplesDisplay.innerText = totalChosen;
    this.dom.totalSamplesDisplay.innerText = totalChosen + totalUnchosen;
    this.dom.proportionDisplay.innerText = MathUtil.roundToPlaces(
      totalChosen / (totalChosen + totalUnchosen),
      5
    );
  }

  updateChart() {
    let valuesArr = this.sampleMeans;
    const tailDirection = this.dom.tailDirectionInput.value;
    const tailInput = Number(this.dom.tailValueInput.value);
    const mean = MathUtil.roundToPlaces(MathUtil.mean(this.sampleMeans), 2);
    const { chosen, unchosen } = splitByPredicate(
      valuesArr,
      this.predicateForTail(tailDirection, tailInput, mean)
    );
    //update statistic output
    this.updateStatistic(chosen.length, unchosen.length);
    this.updateSampleMeansChartLabels(tailDirection, tailInput, mean);
    this.chart.setDataFromRaw([unchosen, chosen]);
    this.chart.scaleToStackDots();
    this.chart.chart.update();
    //this.chart.setpointRadius = 2;
  }
}

