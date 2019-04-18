// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";

import StackedDotChart from "../util/stackeddotchart.js";
import TailChart from "../util/tailchart.js";
import TwoPropChart from "./twoPropChart.js";

export class TwoProportions {
  constructor(twoPropDiv) {
    this.dom = {
      twoPropDiv,
      aSuccess: twoPropDiv.querySelector('#a-success'),
      aFailure: twoPropDiv.querySelector('#a-failure'),
      bSuccess: twoPropDiv.querySelector('#b-success'),
      bFailure: twoPropDiv.querySelector('#b-failure'),
      inputBars: twoPropDiv.querySelector("#input-bars"),
      lastSimBars: twoPropDiv.querySelector("#last-sim-bars"),
      tailChartCanvas: twoPropDiv.querySelector('#tail-chart'),
    };

    this.charts = {
      inputChart: new TwoPropChart(this.dom.inputBars),
      //lastSimChart: new TwoPropChart(this.dom.lastSimChart),
      /*tailChart: new TailChart({
        chartElement: this.dom.tailChartCanvas,
        whatAreWeRecording: 'Differences',
      }),*/
    };
  }

  loadData() {
    let numASuccess = this.dom.aSuccess.value * 1;
    let numAFailure = this.dom.aFailure.value * 1;
    let numBSuccess = this.dom.bSuccess.value * 1;
    let numBFailure = this.dom.bFailure.value * 1;
    this.data = { numASuccess, numAFailure, numBSuccess, numBFailure };
    this.charts.inputChart.setProportions(this.data);
    this.charts.inputChart.update();
  }

}
