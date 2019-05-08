---
---
import StackedDotChart from "{{base}}../util/stackeddotchart.js";
import * as MathUtil from "{{base}}../util/math.js";
import * as Summaries from "{{base}}../util/summaries.js";
import { randomSubset, splitByPredicate } from "{{base}}../util/sampling.js";
import translation from "{{base}}../util/translate.js";

export default class TailChart {

  constructor(config) {
    let {
      chartElement,
      whatAreWeRecording,
      summaryElements = {},
    } = config;

    this.tailDirection = null;
    this.tailInput = 0;
    this.whatAreWeRecording = whatAreWeRecording || translation.twoMean.Samples;
    this.dom = { chartElement };
    this.chart = new StackedDotChart(
      chartElement,
      [
        { label: this.whatAreWeRecording, backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
      ]
    );
    this.summaryElements = summaryElements;
    this.results = [];
    this.updateChartLabels();
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
      mean: MathUtil.roundToPlaces(MathUtil.mean(this.results), 4),
      stddev: MathUtil.roundToPlaces(MathUtil.stddev(this.results), 4),
      chosen: chosen.length,
      unchosen: unchosen.length,
    };
    this.summary.proportion = MathUtil.roundToPlaces(this.summary.chosen / this.summary.total, 4),
    Summaries.updateSummaryElements(this.summaryElements, this.summary);
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
    let roundedInput = MathUtil.roundToPlaces(this.tailInput, 4);
    if (this.tailDirection == null || this.tailDirection == 'null') {
      this.chart.updateLabelName(0, word);
      this.chart.updateLabelName(1, "N/A");
    } else if (this.tailDirection === "oneTailRight") {
      this.chart.updateLabelName(0, `${word} < ${roundedInput}`);
      this.chart.updateLabelName(1, `${word} >= ${roundedInput}`);
    } else if (this.tailDirection === "oneTailLeft") {
      this.chart.updateLabelName(0, `${word} > ${roundedInput}`);
      this.chart.updateLabelName(1, `${word} <= ${roundedInput}`);
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - this.tailInput), 2);
      const left = MathUtil.roundToPlaces(mean - distance, 4);
      const right = MathUtil.roundToPlaces(mean + distance, 4);
      if (mean === 0) {
        this.chart.updateLabelName(0, `|${word}| < ${Math.abs(right)}`);
        this.chart.updateLabelName(1, `|${word}| >= ${Math.abs(right)}`);
      }
      else {
        this.chart.updateLabelName(0, `${left} < ${word} < ${right}`);
        this.chart.updateLabelName(1, `${word} <= ${left} or ${word} >= ${right}`);
      }
    }
  }

  predicateForTail(mean) {
    let tailInput = this.tailInput;
    if (this.tailDirection == null || this.tailDirection == 'null') {
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
    let min = Math.min.apply(undefined, valuesArr);
    let max = Math.max.apply(undefined, valuesArr);
    const mean = MathUtil.roundToPlaces(MathUtil.mean(this.results), 2);
    const { chosen, unchosen } = splitByPredicate(
      valuesArr,
      this.predicateForTail(0)
    );
    // todo(matthewmerrill): if used for onemean, this isn't 0
    this.updateChartLabels(0);
    this.chart.setScale(min, max);
    this.chart.setDataFromRaw([unchosen, chosen]);
    this.chart.scaleToStackDots();
    // update(0) disables animations. This prevents dots moving around confusingly.
    this.chart.chart.update(0);
    //this.chart.setpointRadius = 2;
  }
}
