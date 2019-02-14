// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";

export class TwoMean {
  constructor(twoMeanDiv) {
    this.twoMeanDiv = twoMeanDiv;
    this.csvInput = twoMeanDiv.querySelector('#csvInput');
    this.dataChart = twoMeanDiv.querySelector('#dataChart');
    this.diffChart = twoMeanDiv.querySelector('#diffChart');
    this.data = [[1, 2, 3], [4, 5, 6]];
    this.diffData = {};

    this.dataChartThing = new Chart(this.dataChart, {
      type: 'bar',
      data: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [
          {
            label: 'Group 1',
            backgroundColor: 'rgb(32,128,32)',
            data: [1, 2, 3, 0, 0, 0],
          },
          {
            label: 'Group 2',
            backgroundColor: 'rgb(0,32,128)',
            data: [0, 0, 1, 2, 3],
          }
        ]
      },
      //labels: ['Group One', 'Group Two'],
      //datasets: this.data,
      //options: {
      //  backgroundColor: 'rgb(00, 64, 00)'
      //},
      options: {
        legend: { display: true, },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              barPercentage: 1.0
            }
          ]
        },
        title: {
          display: true,
          text: 'Input Data',
        },
      },
    });

    this.diffChartThing = new Chart(this.diffChart, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Sample Difference',
            backgroundColor: 'rgb(32,128,32)',
            data: [],
          },
        ]
      },
      //labels: ['Group One', 'Group Two'],
      //datasets: this.data,
      //options: {
      //  backgroundColor: 'rgb(00, 64, 00)'
      //},
      options: {
        legend: { display: true, },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              barPercentage: 1.0
            }
          ]
        },
        title: {
          display: true,
          text: 'Input Data',
        },
      },
    });
  }

  loadData() {
  }

  count(arr) {
    let counts = {};
    for (let item of arr) {
      counts[item] = (counts[item] || 0) + 1;
    }
    return counts;
  }

  histPairs(countMap) {
    let pairs = [];
    for (let entry of Object.entries(countMap)) {
      pairs.push({ x: entry[0], y: entry[1] });
    }
    return pairs;
    console.log(countMap, pairs);
  }

  runSim() {
  }
}
