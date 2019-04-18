import StackedDotChart from "../util/stackeddotchart.js";
import * as MathUtil from "/util/math.js";
import { randomSubset, splitByPredicate } from "../util/sampling.js";

export default class TailChart {

  constructor({chartElement, whatAreWeRecording}) {
    this.tailDirection = null;
    this.tailInput = 0;
    this.whatAreWeRecording = whatAreWeRecording || 'Samples';
    this.dom = { chartElement };
    this.chart = new StackedDotChart(
      chartElement,
      [
        { label: this.whatAreWeRecording, backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
      ]
    );
    this.results = [];
  }

  reset() {
    this.tailDiection = null;
    this.tailInput = 0;
    this.dropResults();
  }

  addResult(result, skipCallback) {
    this.results.push(result);
    this.updateSummary();
  }

  addAllResults(results) {
    for (let result of results) {
      this.results.push(result);
    }
    this.updateSummary();
  }

  dropResults() {
    this.results = [];
  }

  updateSummary() {
    const { chosen, unchosen } = splitByPredicate(
      this.results,
      this.predicateForTail(0)
    );
    this.summary = {
      total: this.results.length,
      chosen: chosen.length,
      unchosen: unchosen.length,
    };
  }

  setTailDirection(tailDirection) {
    this.tailDirection = tailDirection;
    this.updateSummary();
  }

  setTailInput(tailInput) {
    this.tailInput = tailInput;
    this.updateSummary();
  }

  updateChartLabels(mean) {
    let word = this.whatAreWeRecording;
    if (this.tailDirection === "null") {
      this.chart.updateLabelName(0, word);
      this.chart.updateLabelName(1, "N/A");
    } else if (this.tailDirection === "oneTailRight") {
      this.chart.updateLabelName(0, `${word} < ${this.tailInput}`);
      this.chart.updateLabelName(1, `${word} >= ${this.tailInput}`);
    } else if (this.tailDirection === "oneTailLeft") {
      this.chart.updateLabelName(0, `${word} > ${this.tailInput}`);
      this.chart.updateLabelName(1, `${word} <= ${this.tailInput}`);
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - this.tailInput), 2);
      const left = mean - distance;
      const right = mean + distance;
      this.chart.updateLabelName(0, `${left} < samples < ${right}`);
      this.chart.updateLabelName(
        1,
        `${word} <= ${left} or ${word} >= ${right}`
      );
    }
  }

  predicateForTail(mean) {
    let tailInput = this.tailInput;
    if (this.tailDirection === "null") {
      return null;
    } else if (this.tailDirection === "oneTailRight") {
      return x => x >= tailInput;
    } else if (this.tailDirection === "oneTailLeft") {
      return x => x <= tailInput;
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - this.tailInput), 2);
      return x => x <= mean - distance || x >= mean + distance;
    }
  }

  updateChart() {
    let valuesArr = this.results;
    const mean = MathUtil.roundToPlaces(MathUtil.mean(this.results), 2);
    const { chosen, unchosen } = splitByPredicate(
      valuesArr,
      this.predicateForTail(0)
    );
    this.updateChartLabels(0);
    this.chart.setDataFromRaw([unchosen, chosen]);
    this.chart.scaleToStackDots();
    this.chart.chart.update();
    //this.chart.setpointRadius = 2;
  }
}
