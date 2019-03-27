// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";

import StackedDotChart from "../util/stackeddotchart.js";

export class TwoProportions {
  constructor(twoPropDiv) {
    this.dom = {
      twoPropDiv,
      aSuccess: twoPropDiv.querySelector('#a-success'),
      aFailure: twoPropDiv.querySelector('#a-failure'),
      bSuccess: twoPropDiv.querySelector('#b-success'),
      bFailure: twoPropDiv.querySelector('#b-failure'),
      inputBars: twoPropDiv.querySelector("#input-bars"),
    };

    this.charts = {
      // TODO(matthewmerrill): better tooltips
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

}
