import Chart from 'chart.js';
import 'chartjs-plugin-annotation';

Chart.pluginService.register({
  afterUpdate: function(chart) {
      // We get the dataset and set the offset here
      const dataset = chart.config.data.datasets[2];
      // const width = dataset._meta[0].data[1]._model.x - dataset._meta[0].data[0]._model.x;
      let offset
      if (dataset._meta[0].data.length > 0){
        console.log(dataset._meta[0].data);
        offset = -(dataset._meta[0].data[1]._model.x - dataset._meta[0].data[0]._model.x)/2;
      }

      // For every data in the dataset ...
      for (var i = 0; i < dataset._meta[0].data.length; i++) {
          // We get the model linked to this data
          var model = dataset._meta[0].data[i]._model;
          console.log(model);
          // And add the offset to the `x` property
          model.x += offset;

          // .. and also to these two properties
          // to make the bezier curve fits the new graph
          model.controlPointNextX += offset;
          model.controlPointPreviousX += offset;
      }
  }
});

export default class ChartModule{

  constructor(canvasEle){
    this.color = {
      sample: "rgba(255,0,0,0.6)",
      binomial: "rgba(0,0,255,0.6)",
      selected: "rgba(0,255,0,0.6)",
      line: "rgba(0,255,0,0.6)",
      box: "rgba(0,255,0,0.1)",
      invisible: "rgba(0,255,0,0.0)",
    };
    var ctx = canvasEle.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: [],
          datasets: [{
                label: 'Samples',
                data: [],
                borderWidth: 1,
                id: 'x-axis-1',
                backgroundColor: this.color.sample,
                hidden: false,
              },{
                type: 'bubble',
                label: 'Binomial',
                data: [],
                borderWidth: 0.1,
                id: 'x-axis-2',
                backgroundColor: this.color.binomial,
                hidden: false,
              },
              {
                type: 'line',
                label: 'Selected',
                data: [],
                borderWidth: 0.1,
                id: 'x-axis-2',
                backgroundColor: this.color.selected,
                hidden: false,
                fill: 'end'
              },
          ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }],
              xAxes: [
                { 
                  barPercentage: 1.0
                }, 

                ]
          },
          responsive: true,
          maintainAspectRatio: true,
          tooltips: {
            mode: 'index',
            backgroundColor: 'rgba(0,0,0,1.0)',
            callbacks: {
              title: function(tooltipItem, data){
                let title = tooltipItem[0].xLabel || '';
                title += ' heads';
                return title;
              },
              label: function(tooltipItem, data) {
                return  data.datasets[tooltipItem.datasetIndex].label + tooltipItem.yLabel;
              }
            }
          },
      }
    });
  }

  UpdateChartData(labels, data1, data2, data3){
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data1;
    this.chart.data.datasets[1].data = data2;
    this.chart.data.datasets[2].data = data3;
    // console.log(this.chart.data.datasets[1].data);
    this.chart.update();
  }
}