// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";
import {
  dropTextFileOnTextArea,
  // TODO(matthewmerrill): use these library functions
  parseCSVtoSingleArray,
  readLocalFile
} from "../util/csv.js";
import StackedDotChart from '/util/stackeddotchart.js';
import * as MathUtil from '/util/math.js';
import { randomSubset } from '/util/sampling.js';
import TailWidget from "../util/tailWidget.js";

export class TwoMean {
  constructor(twoMeanDiv) {
    this.twoMeanDiv = twoMeanDiv;
    this.csvInput = twoMeanDiv.querySelector('#csv-input');
    this.diffChart = twoMeanDiv.querySelector('#diffChart');
    this.tailWidget = new TailWidget(twoMeanDiv.querySelector('#tail-widget-section'));
    this.data = undefined;

    this.datasets = [
      { label: 'Group One', backgroundColor: '#333333', data: [] },
      { label: 'Group Two', backgroundColor: '#93cb52', data: [] },
    ];
    this.dom = {
      dataMean1: document.getElementById('data-mean-1'),
      dataMean2: document.getElementById('data-mean-2'),
      diffOfData: document.getElementById('diff-of-data'),
      newDataMean1: document.getElementById('new-data-mean-1'),
      newDataMean2: document.getElementById('new-data-mean-2'),
      newDiffOfData: document.getElementById('new-diff-of-data'),
    }
    this.dataChart1 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-1'), [this.datasets[0]]);
    this.dataChart2 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-2'), [this.datasets[1]]);
    this.sampleChart1 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-1'), this.datasets);
    this.sampleChart1.chart.options.legend.display = false;
    this.sampleChart2 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-2'), this.datasets);
    this.sampleChart2.chart.options.legend.display = false;
    this.updateData([[], []]);
    dropTextFileOnTextArea(this.csvInput);
  }

  loadData() {
    let rawData = this.parseData(this.csvInput.value.trim());
    console.log(rawData);
    this.updateData(rawData);
  }

  parseData(dataText) {
    let items = dataText
      .split(/[\r\n]+/)
      .map(line => {
        let [group, value] = line.split(',');
        return [group, value * 1.0]; // coerce value to number type
      });
    let faceted = {};
    for (let [group, value] of items) {
      if (!faceted[group]) {
        faceted[group] = [];
      }
      faceted[group].push(value);
    }
    return Object.values(faceted);
  }

  updateData(data) {
    this.data = data;
    this.data[0] = this.data[0] || [];
    this.data[1] = this.data[1] || [];
    this.sampleDiffs = [];

    this.dataChart1.setDataFromRaw([data[0]]);
    this.dataChart2.setDataFromRaw([data[1]]);
    this.sampleChart1.clear();
    this.sampleChart2.clear();

    let dataValues = data[0].concat(data[1]);
    if (dataValues.length) {
      let min = Math.min.apply(undefined, dataValues);
      let max = Math.max.apply(undefined, dataValues);
      this.dataChart1.setScale(min, max);
      this.dataChart2.setScale(min, max);
      this.sampleChart1.setScale(min, max);
      this.sampleChart2.setScale(min, max);
      this.dataChart1.scaleToStackDots();
      this.dataChart2.scaleToStackDots();
      this.sampleChart1.scaleToStackDots();
      this.sampleChart2.scaleToStackDots();
    }
    this.dataChart1.chart.update();
    this.dataChart2.chart.update();
    this.sampleChart1.chart.update();
    this.sampleChart2.chart.update();
    this.tailWidget.updateChart();

    let mean0 = MathUtil.mean(data[0]);
    let mean1 = MathUtil.mean(data[1]);
    this.dom.dataMean1.innerText =
      data[0].length
        ? MathUtil.roundToPlaces(mean0, 2)
        : 'No Data';
    this.dom.dataMean2.innerText =
      data[1].length
        ? MathUtil.roundToPlaces(mean1, 2)
        : 'No Data';
    this.dom.diffOfData.innerText =
      (data[0].length && data[1].length)
        ? MathUtil.roundToPlaces(mean1 - mean0, 2)
        : 'No Data';
    this.dom.newDataMean1.innerText = '';
    this.dom.newDataMean2.innerText = ''; 
    this.dom.newDiffOfData.innerText = '';
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
  }

  runSim() {
    // Coerce to number
    let numSims = document.getElementById('num-simulations').value * 1;
    for (let simIdx = 0; simIdx < numSims; simIdx++) {
      let allData = [];
      for (let item of this.data[0]) {
        allData.push({ datasetId: 0, value: item});
      }
      for (let item of this.data[1]) {
        allData.push({ datasetId: 1, value: item});
      }
      if (allData.length === 0) {
        return;
      }
      let { chosen, unchosen } = randomSubset(allData, this.data[0].length);
      this.addSimulationSample(this.sampleChart1, chosen);
      this.addSimulationSample(this.sampleChart2, unchosen);
      this.sampleChart1.chart.update();
      this.sampleChart2.chart.update();

      // TODO(matthewmerrill): This is very unclear.
      let sampleValues = [ chosen.map(a => a.value), unchosen.map(a => a.value) ];
      let mean0 = MathUtil.mean(sampleValues[0]);
      let mean1 = MathUtil.mean(sampleValues[1]);
      let sampleDiffOfMeans = mean1 - mean0;
      this.tailWidget.addResult(sampleDiffOfMeans);
      if (simIdx + 1 === numSims) {
        this.dom.newDataMean1.innerText = MathUtil.roundToPlaces(mean0, 2);
        this.dom.newDataMean2.innerText = MathUtil.roundToPlaces(mean1, 2); 
        this.dom.newDiffOfData.innerText = MathUtil.roundToPlaces(mean1 - mean0, 2);
      }
    }
    //this.updateSimResults();
    this.tailWidget.updateChart();
  }

  addSimulationSample(chart, sample) {
    let facetedArrays = [[], []];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    chart.setDataFromRaw(facetedArrays);
  }
}
