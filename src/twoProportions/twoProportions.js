// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";

import {randomInt} from "../util/sampling.js";
import StackedDotChart from "../util/stackeddotchart.js";
import TailWidget from "../util/tailWidget.js";

export class TwoProportions {
  constructor(twoPropDiv) {
    this.dom = {
      twoPropDiv,
      aSuccess: twoPropDiv.querySelector('#a-success'),
      aFailure: twoPropDiv.querySelector('#a-failure'),
      bSuccess: twoPropDiv.querySelector('#b-success'),
      bFailure: twoPropDiv.querySelector('#b-failure'),
      inputBars: twoPropDiv.querySelector("#input-bars"),
      numSimulations: twoPropDiv.querySelector('#num-simulations'),
    };
    this.tailWidget = new TailWidget(twoPropDiv.querySelector('#tail-widget-section'));
    this.data = {};

    this.charts = {
      // TODO(matthewmerrill): better tooltips
      // TODO(matthewmerrill): make the red/green more intuitive with how data is entered
      //  Note: This might require ChartJS v3.0.0 https://github.com/mendix/ChartJS/issues/31
      inputBars: new Chart(this.dom.inputBars, {
        type: 'bar',
        data: {
          labels: ['Group A', 'Group B'],
          datasets: [
            {
              label: 'Successes',
              backgroundColor: 'green',
              data: [30, 60],
            },
            {
              label: 'Failures',
              backgroundColor: 'red',
              data: [ 70, 40 ],
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  max: 100,
                },
              }
            ],
            yAxes: [
              {
                id: 'groupAAxis',
                stacked: true,
                ticks: {
                  max: 100,
                },
              },
            ],
          } 
        },
      }),
    };
  }

  loadData() {
    let numASuccess = this.dom.aSuccess.value * 1;
    let numAFailure = this.dom.aFailure.value * 1;
    let numBSuccess = this.dom.bSuccess.value * 1;
    let numBFailure = this.dom.bFailure.value * 1;
    Object.assign(this.data, {numASuccess, numAFailure, numBSuccess, numBFailure});
    let totalInA = numASuccess + numAFailure;
    let totalInB = numBSuccess + numBFailure;
    let totalSuccess = numASuccess + numBSuccess;
    let totalFailure = numAFailure + numBFailure;
    this.charts.inputBars.data.datasets[0].data[0] = 100 * numASuccess / totalInA;
    this.charts.inputBars.data.datasets[0].data[1] = 100 * numBSuccess / totalInB;
    this.charts.inputBars.data.datasets[0].data[0] = 100 * numAFailure / totalInA;
    this.charts.inputBars.data.datasets[1].data[1] = 100 * numBFailure / totalInB;
    this.charts.inputBars.update();
  }

  runSimulations() {
    let numSimulations = this.dom.numSimulations.value * 1;
    let {numASuccess, numAFailure, numBSuccess, numBFailure} = this.data;
    let totalSuccess = numASuccess + numBSuccess;
    let totalFailure = numAFailure + numBFailure;
    let totalGroupA = numASuccess + numAFailure;
    let totalGroupB = numBSuccess + numBFailure;
    for (let simIdx = 0; simIdx < numSimulations; simIdx++) {
      let minASuccesses = Math.max(0, totalSuccess - totalGroupB);
      let maxASuccesses = Math.min(totalGroupA, totalSuccess);
      let sampleASuccess = randomInt(minASuccesses, maxASuccesses + 1);
      let sampleAFailure = totalGroupA - sampleASuccess;
      let sampleBSuccess = totalSuccess - sampleASuccess;
      let sampleBFailure = totalFailure - sampleAFailure;
      this.addSimResult({sampleASuccess, sampleAFailure, sampleBSuccess, sampleBFailure});
    }
    this.updateSimCharts();
  }

  addSimResult(result) {
    this.tailWidget.addResult(result);
  }

  updateSimCharts() {
    this.tailWidget.updateChart();
  }

}
