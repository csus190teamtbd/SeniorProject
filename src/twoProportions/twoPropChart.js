export default class TwoPropChart {
  
  constructor(canvas) {
    this.dom = {canvas};
    // TODO(matthewmerrill): better tooltips
    // TODO(matthewmerrill): make the red/green more intuitive with how data is entered
    //  Note: This might require ChartJS v3.0.0 https://github.com/mendix/ChartJS/issues/31
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Group A', 'Group B'],
        datasets: [
          {
            label: 'Successes',
            backgroundColor: 'green',
            data: [0, 0],
          },
          {
            label: 'Failures',
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
        } 
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
