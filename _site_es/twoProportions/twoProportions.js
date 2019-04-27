import {countWhere} from "../util/math.js";
import {randomInt, shuffle} from "../util/sampling.js";
import StackedDotChart from "../util/stackeddotchart.js";
import * as Summaries from "../util/summaries.js";
import TailChart from "../util/tailchart.js";
import TwoPropChart from "./twoPropChart.js";
import translation from "../util/translate.js";

export class TwoProportions {

  constructor(twoPropDiv) {
    this.dom = {
      twoPropDiv,
      aSuccess: twoPropDiv.querySelector('#a-success'),
      aFailure: twoPropDiv.querySelector('#a-failure'),
      bSuccess: twoPropDiv.querySelector('#b-success'),
      bFailure: twoPropDiv.querySelector('#b-failure'),
      inputCanvas: twoPropDiv.querySelector("#input-bars"),
      lastSimCanvas: twoPropDiv.querySelector("#last-sim-bars"),
      tailChartCanvas: twoPropDiv.querySelector('#tail-chart'),
      numSimulations: twoPropDiv.querySelector('#num-simulations'),
      tailDirectionElement: twoPropDiv.querySelector('#tail-direction'),
      tailInputElement: twoPropDiv.querySelector('#tail-input'),
      needData: twoPropDiv.querySelectorAll('[disabled=need-data]'),
      needResults: twoPropDiv.querySelectorAll('[disabled=need-results]'),
    };
    this.summaryElements = Summaries.loadSummaryElements(twoPropDiv);

    this.charts = {
      inputChart: new TwoPropChart(this.dom.inputCanvas),
      lastSimChart: new TwoPropChart(this.dom.lastSimCanvas),
      tailChart: new TailChart({
        chartElement: this.dom.tailChartCanvas,
        whatAreWeRecording: translation.twoProportions.differences,
        summaryElements: this.summaryElements,
      }),
    };
    this.dom.tailDirectionElement.addEventListener('change', () => {
      this.charts.tailChart.setTailDirection(this.dom.tailDirectionElement.value);
      this.charts.tailChart.updateChart();
    });
    this.dom.tailInputElement.addEventListener('change', () => {
      this.charts.tailChart.setTailInput(this.dom.tailInputElement.value * 1);
      this.charts.tailChart.updateChart();
    });
  }

  loadData() {
    let numASuccess = this.dom.aSuccess.value * 1;
    let numAFailure = this.dom.aFailure.value * 1;
    let numBSuccess = this.dom.bSuccess.value * 1;
    let numBFailure = this.dom.bFailure.value * 1;
    if (numASuccess + numAFailure === 0 || numBSuccess + numBFailure === 0) {
      alert('Group A and Group B must both have at least one element.');
    }
    else {
      let summary = {
        numASuccess, numAFailure, numBSuccess, numBFailure,
        proportionA: numASuccess / (numASuccess + numAFailure), // todo(matthewmerrill): fixed decimals
        proportionB: numBSuccess / (numBSuccess + numBFailure),
      }
      summary.proportionDiff = summary.proportionA - summary.proportionB;
      Summaries.updateSummaryElements(this.summaryElements, summary);
      this.data = { numASuccess, numAFailure, numBSuccess, numBFailure };
      this.charts.inputChart.setProportions(this.data);
      this.charts.inputChart.update();
      this.charts.lastSimChart.setProportions({
        numASuccess: 0, numAFailure: 0, numBSuccess: 0, numBFailure: 0,
      });
      this.charts.lastSimChart.update();
      this.charts.tailChart.reset();
      this.charts.tailChart.updateChart();
      for (let elem of this.dom.needData) {
        elem.removeAttribute('disabled');
      }
      for (let elem of this.dom.needResults) {
        elem.setAttribute('disabled', true);  
      }
    }
  }

  runSimulations() {
    let numSimulations = this.dom.numSimulations.value * 1;
    let {numASuccess, numAFailure, numBSuccess, numBFailure} = this.data;
    let totalSuccess = numASuccess + numBSuccess;
    let totalFailure = numAFailure + numBFailure;
    let totalGroupA = numASuccess + numAFailure;
    let totalGroupB = numBSuccess + numBFailure;
    for (let simIdx = 0; simIdx < numSimulations; simIdx++) {
      //TODO(matthewmerrill): this isn't right, it should be BINOM
      //let minASuccesses = Math.max(0, totalSuccess - totalGroupB);
      //let maxASuccesses = Math.min(totalGroupA, totalSuccess);
      //let sampleASuccess = randomInt(minASuccesses, maxASuccesses + 1);
      //let sampleBSuccess = totalSuccess - sampleASuccess;
      //TODO(matthewmerrill): don't shuffle
      let allItems = new Array(totalGroupA + totalGroupB);
      allItems.fill(0);
      allItems.fill(1, 0, totalSuccess);
      let shuffled = shuffle(allItems);
      let sampleA = shuffled.slice(0, totalGroupA);
      let sampleB = shuffled.slice(totalGroupA);
      let sampleASuccess = countWhere(sampleA, x => x == 1);
      let sampleBSuccess = countWhere(sampleB, x => x == 1);
      let sampleAFailure = totalGroupA - sampleASuccess;
      let sampleBFailure = totalGroupB - sampleBSuccess;
      let sampleAProportion = sampleASuccess / totalGroupA;
      let sampleBProportion = sampleBSuccess / totalGroupB;
      this.addSimulationResult(sampleAProportion - sampleBProportion);
      if (simIdx + 1 === numSimulations) {
        this.charts.lastSimChart.setProportions({
          numASuccess: sampleASuccess,
          numBSuccess: sampleBSuccess,
          numAFailure: totalGroupA - sampleASuccess,
          numBFailure: totalGroupB - sampleBSuccess,
        });
        let summary = {
          sampleASuccess, sampleAFailure, sampleBSuccess, sampleBFailure,
          sampleProportionA: sampleASuccess / totalGroupA,
          sampleProportionB: sampleBSuccess / totalGroupB,
          sampleProportionDiff: (sampleASuccess - sampleBSuccess) / (totalGroupA + totalGroupB),
        };
        Summaries.updateSummaryElements(this.summaryElements, summary);
      }
    }
    this.charts.lastSimChart.update();
    this.charts.tailChart.updateChart();
    if (this.charts.tailChart.results.length) {
      for (let elem of this.dom.needResults) {
        elem.removeAttribute('disabled');  
      }
    }
  }

  addSimulationResult(diffOfProps) {
    this.charts.tailChart.addResult(diffOfProps);
  }

  updateSummary() {
    let {total, chosen, unchosen} = this.charts.summary;
  }

}
