---
---
import translation from "{{base}}../util/translate.js";

export default class TwoPropChart {
  
  constructor(canvas) {
    this.dom = {canvas};
    if (!canvas) {
      throw new Error('canvas is undefined!');
    }
    // TODO(matthewmerrill): better tooltips
    // TODO(matthewmerrill): make the red/green more intuitive with how data is entered
    //  Note: This might require ChartJS v3.0.0 https://github.com/mendix/ChartJS/issues/31
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [translation.twoProportions.groupA, translation.twoProportions.groupB],
        datasets: [
          {
            label: '% ' + translation.twoProportions.successes,
            backgroundColor: 'green',
            data: [0, 0],
          },
          {
            label: '% ' + translation.twoProportions.failures,
            backgroundColor: 'red',
            data: [0, 0],
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
        }, 
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  setProportions({ numASuccess, numAFailure, numBSuccess, numBFailure }) {
    let totalInA = numASuccess + numAFailure;
    let totalInB = numBSuccess + numBFailure;
    let totalSuccess = numASuccess + numBSuccess;
    let totalFailure = numAFailure + numBFailure;
    this.chart.data.datasets[0].data[0] = 100 * numASuccess / totalInA;
    this.chart.data.datasets[0].data[1] = 100 * numBSuccess / totalInB;
    this.chart.data.datasets[1].data[0] = 100 * numAFailure / totalInA;
    this.chart.data.datasets[1].data[1] = 100 * numBFailure / totalInB;
  }

  update() {
    this.chart.update();
  }

}
