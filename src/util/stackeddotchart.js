// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";

export default class StackedDotChart {
  constructor(domElement, datasets) {
    this.domElement = domElement;
    this.datasets = [];
    for (let dataset of datasets) {
      this.datasets.push(
        Object.assign({}, dataset, {
          pointRadius: 8
        })
      );
    }
    this.chart = new Chart(domElement, {
      type: "scatter",
      data: {
        datasets: this.datasets
      },
      options: {
        scales: {
          //xAxes: [{ ticks: { beginAtZero: true, }}],
          yAxes: [
            {
              ticks: {
                min: 1,
                stepSize: 1
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  rawToScatter(arrs) {
    let faceted = [];
    let counts = {};
    for (let arr of arrs) {
      let scatter = [];
      for (let item of arr) {
        let y = (counts[item] = (counts[item] || 0) + 1);
        scatter.push({ x: item, y: y });
      }
      faceted.push(scatter);
    }
    return faceted;
  }

  clear() {
    for (let dataset of this.chart.data.datasets) {
      dataset.data = [];
    }
  }

  setDataFromRaw(rawDataArrays) {
    let scatterArrays = this.rawToScatter(rawDataArrays);
    for (let idx = 0; idx < rawDataArrays.length; idx++) {
      this.chart.data.datasets[idx].data = scatterArrays[idx];
    }
  }

  setScale(start, end) {
    this.chart.options.scales.xAxes[0].ticks.min = start;
    this.chart.options.scales.xAxes[0].ticks.max = end;
  }

  updateLabelName(datasetIndex, labelName) {
    this.datasets[datasetIndex].label = labelName;
  }

  changeDotAppearance(pointRadius, stepSize) {
    this.chart.data.datasets.forEach(x => {
      x.pointRadius = pointRadius;
    });
    this.chart.options.scales.yAxes.forEach(x => {
      x.ticks.stepSize = stepSize;
    });
  }
  setAnimationDuration(duration) {
    this.chart.options.animation.duration = duration;
  }
}
