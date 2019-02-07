import Chart from 'chart.js';
import 'chartjs-plugin-annotation';

export default class ChartModule{

  constructor(canvasEle){
    this.color = {
      sample: "rgba(255,0,0,0.6)",
      binomial: "rgba(0,0,255,0.6)",
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
          annotation:{
            annotations:[
              {
                drawTime: 'afterDraw', // overrides annotation.drawTime if set
                id: 'lowerRange', // optional
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 0,
                borderColor: this.color.line,
                borderWidth: 2,
              },
              {
                drawTime: 'afterDraw', // overrides annotation.drawTime if set
                id: 'upperRange', // optional
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 0,
                borderColor: this.color.line,
                borderWidth: 2,
              },
              {
                drawTime: 'afterDraw', // overrides annotation.drawTime if set
                id: 'innerRange', // optional
                type: 'box',
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: 0,
                xMax: 3,
                backgroundColor: this.color.invisible,
                borderWidth: 0,
              }
            ]
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

  updateAnnotation(lower, upper){
    
    const elements = this.chart.annotation.elements;
    const labels = this.chart.data.labels;
    if (labels.length > 0 && lower <= upper){
      if (lower >= labels[0]){
        elements['lowerRange'].options.borderWidth = 2;
        elements['lowerRange'].options.value = lower;
        elements['innerRange'].options.xMin = lower;
      }else{
        elements['lowerRange'].options.borderWidth = 0;
        elements['innerRange'].options.xMin = NaN;
      }
      if (upper <= labels[labels.length-1]){
        elements['upperRange'].options.borderWidth = 2;
        elements['upperRange'].options.value = upper;
        elements['innerRange'].options.xMax = upper;
      }else{
        elements['upperRange'].options.borderWidth = 0;
        elements['innerRange'].options.xMax = NaN;
      }
      elements['innerRange'].options.backgroundColor = this.color.box;
      
    }else{
      elements['lowerRange'].options.borderWidth = 0;
      elements['upperRange'].options.borderWidth = 0;
      elements['innerRange'].options.backgroundColor = this.color.invisible;
    }
    this.chart.update();

  }

}