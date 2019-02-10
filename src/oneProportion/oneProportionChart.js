import Chart from "chart.js";

export default class ChartModule {
  constructor(canvasEle) {
    this.zoomIn = false;
    this.color = {
      sample: "rgba(255,0,0,0.6)",
      binomial: "rgba(0,0,255,0.6)",
      selected: "rgba(0,255,0,0.6)",
      line: "rgba(0,255,0,0.6)",
      box: "rgba(0,255,0,0.1)",
      invisible: "rgba(0,255,0,0.0)"
    };

    this.dataFromCalculation = {
      theoryMean: 0,
      sampleSelected: 0
    };

    var ctx = canvasEle.getContext("2d");
    this.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Samples",
            data: [],
            borderWidth: 1,
            id: "x-axis-1",
            backgroundColor: this.color.sample,
            hidden: false
          },
          {
            type: "bubble",
            label: "Binomial",
            data: [],
            borderWidth: 0.1,
            id: "x-axis-2",
            backgroundColor: this.color.binomial,
            radius: 10,
            hidden: false
          },
          {
            type: "line",
            label: "Selected",
            data: [],
            borderWidth: 0.1,
            id: "x-axis-3",
            backgroundColor: this.color.selected,
            hidden: true,
            fill: "end"
          }
        ]
      },
      options: {
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
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          mode: "index",
          backgroundColor: "rgba(0,0,0,1.0)",
          callbacks: {
            title: function(tooltipItem, data) {
              let title = tooltipItem[0].xLabel || "";
              title += " heads";
              return title;
            },
            label: (tooltipItem, data) => {
              if (tooltipItem.datasetIndex !== 2) {
                return `${data.datasets[tooltipItem.datasetIndex].label} : ${
                  tooltipItem.yLabel
                }`;
              } else {
                return `${data.datasets[tooltipItem.datasetIndex].label} : ${
                  this.dataFromCalculation.sampleSelected
                }`;
              }
            }
          }
        }
      }
    });
  }

  updateChartData(dataSet) {
    const {
      labels,
      sample,
      binomail,
      selected,
      probability,
      noOfCoin,
      sampleSelected,
      mean
    } = dataSet;
    let lowerRange, upperRange;
    if (!this.zoomIn) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = sample;
      this.chart.data.datasets[1].data = binomail;
      this.chart.data.datasets[2].data = selected;
    } else {
      //use theory mean and std so that the label does not change frequently
      const theroyMean = probability * noOfCoin;
      const theoryStd = Math.sqrt(noOfCoin * probability * (1 - probability));
      lowerRange =
        theroyMean - 3 * theoryStd > 0
          ? Math.floor(theroyMean - 3 * theoryStd)
          : 0;
      upperRange = theroyMean + 3 * theoryStd;
      this.chart.data.labels = labels.slice(lowerRange, upperRange);
      this.chart.data.datasets[0].data = sample.slice(lowerRange, upperRange);
      this.chart.data.datasets[1].data = binomail.slice(lowerRange, upperRange);
      this.chart.data.datasets[2].data = selected.slice(lowerRange, upperRange);
    }
    this.dataFromCalculation.theoryMean = mean;
    this.dataFromCalculation.sampleSelected = sampleSelected;
    this.chart.mean = mean;
    this.chart.update();
  }

  resetChartData() {
    this.chart.data.datasets[0].data = [];
    this.chart.data.datasets[1].data = [];
    this.chart.data.datasets[2].data = [];
    this.dataFromCalculation.theoryMean = 0;
    this.dataFromCalculation.sampleSelected = 0;
    this.zoomIn = false;
    this.chart.update();
  }
}

Chart.pluginService.register({
  id: "offsetBar",
  afterUpdate: function(chart) {
    // We get the dataset and set the offset here
    const dataset = chart.config.data.datasets[2];
    // const width = dataset._meta[0].data[1]._model.x - dataset._meta[0].data[0]._model.x;
    let offset;
    const meta = Object.values(dataset._meta)[0];
    if (meta.data.length > 0) {
      offset = -(meta.data[1]._model.x - meta.data[0]._model.x) / 2;
    }

    // For every data in the dataset ...
    for (var i = 0; i < meta.data.length; i++) {
      // We get the model linked to this data
      var model = meta.data[i]._model;
      // And add the offset to the `x` property
      model.x += offset;

      // .. and also to these two properties
      // to make the bezier curve fits the new graph
      model.controlPointNextX += offset;
      model.controlPointPreviousX += offset;
    }
  }
});

Chart.pluginService.register({
  id: "sampleBarColor",
  beforeUpdate: function(chart) {
    if (chart.mean) {
      const chartData = chart.config.data; // sample dataset
      chartData.datasets[0].backgroundColor = chartData.labels.map(
        x =>
          `rgba(255,0,0,${1 -
            (Math.abs(x - chart.mean) * 1.5) / chartData.labels.length})`
      );
    }
  }
});

Chart.pluginService.register({
  id: "fixedSamplelegendColor",
  afterUpdate: function(chart) {
    chart.legend.legendItems[0].fillStyle = "rgba(255,0,0,0.8)";
  }
});

Chart.pluginService.register({
  id: "dynamicBubbleSize",
  beforeUpdate: function(chart) {
    if (chart.mean) {
      const chartData = chart.config.data; // sample dataset
      console.log(chart);
      const dyanamicSize = 50 / chartData.labels.length;
      const minSize = 2;
      chartData.datasets[1].radius =
        dyanamicSize > minSize ? dyanamicSize : minSize;
    }
  }
});
