import Chart from 'chart.js';

export default class ChartModule{

  constructor(canvasEle){
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
                backgroundColor: "rgba(255,0,0,0.6)",
                hidden: false,
              },{
                type: 'bubble',
                label: 'Binomial',
                data: [],
                borderWidth: 0.1,
                id: 'x-axis-2',
                backgroundColor: "rgba(0,0,255,0.6)",
                hidden: false,
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
            callbacks: {
              title: function(tooltipItem, data){
                let title = tooltipItem[0].xLabel || '';
                title += ' heads';
                return title;
              }
          }
        }
      }
    });
  }

  UpdateChartData(labels, data1, data2){
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data1;
    this.chart.data.datasets[1].data = data2;
    // console.log(this.chart.data.datasets[1].data);
    this.chart.update();
  }

}