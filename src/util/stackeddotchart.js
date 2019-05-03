// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";

export default class StackedDotChart {
  constructor(domElement, datasets, options) {
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
    options = options || {};
    this.options = {
      autoBuckets: options.autoBuckets !== undefined ? options.autoBuckets : true,
      bucketWidth: options.bucketWidth,
    };
  }

  round(x, bucketSize) {
    if (bucketSize == undefined) {
      if (this.options.autoBuckets) {
        let scale = this.chart.scales['x-axis-1'];
        let inScaleWidth = scale.options.ticks.max - scale.options.ticks.min;
        let chartWidth = this.chart.width;
        let pointRadius = this.chart.data.datasets[0].pointRadius;
        bucketSize = 2 * pointRadius * (inScaleWidth / chartWidth);
      }
      else if (this.options.bucketWidth) {
        bucketSize = this.bucketWidth;
      }
    }
    if (bucketSize) {
      let r = Math.floor(x / bucketSize) * bucketSize;
      return r;
    }
    else {
      return x;
    }
  }

  rawToScatter(arrs) {
    let faceted = [];
    let counts = {};
    for (let arr of arrs) {
      let scatter = [];
      for (let item of arr) {
        item = this.round(item);
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
    let max = 1;
    for (let dataset of scatterArrays) {
      for (let item of dataset) {
        max = Math.max(max, item.y);
      }
    }
    this.chart.options.scales.yAxes[0].ticks.stepSize = Math.pow(
      10,
      Math.floor(Math.log10(max))
    );
  }

  setScale(start, end) {
    this.chart.options.scales.xAxes[0].ticks.min = start;
    this.chart.options.scales.xAxes[0].ticks.max = end;
  }

  /**
   * Attempts to scale y dimension to make the dots stack directly on top of
   * each other. If there is not enough space in the chart to do so, the y will
   * scale to contain all the dots, squishing them to clip into each other.
   * When there are many dots, this makes the stack look like a vertical bar.
   */
  scaleToStackDots() {
    // TODO(matthewmerrill): memoize getMax with a dirty flag
    let max = 1;
    for (let dataset of this.chart.data.datasets) {
      for (let item of dataset.data) {
        max = Math.max(max, item.y);
      }
    }
    let { top, bottom } = this.chart.chartArea;
    let chartHeight = bottom - top;
    let pointRadius = this.chart.data.datasets[0].pointRadius;
    this.chart.options.scales.yAxes[0].ticks.max = Math.max(
      max,
      this.chart.options.scales.yAxes[0].ticks.min +
        (chartHeight / pointRadius) * 0.5
    );
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
