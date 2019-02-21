// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";
import StackedDotChart from '/util/stackeddotchart.js';
import * as MathUtil from '/util/math.js';
import { randomSubset } from '/util/sampling.js';

export class TwoMean {
  constructor(twoMeanDiv) {
    this.twoMeanDiv = twoMeanDiv;
    this.csvInput = twoMeanDiv.querySelector('#csvInput');
    this.diffChart = twoMeanDiv.querySelector('#diffChart');
    this.data = undefined;
    this.diffData = {};

    this.datasets = [
      { label: 'Group One', backgroundColor: '#333333', data: [] },
      { label: 'Group Two', backgroundColor: '#93cb52', data: [] },
    ];
    this.dataChart1 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-1'), [this.datasets[0]]);
    this.dataChart2 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-2'), [this.datasets[1]]);
    this.sampleChart1 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-1'), this.datasets);
    this.sampleChart2 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-2'), this.datasets);
    this.updateData([[], []]);
  }

  loadData() {
    let rawData = this.parseData('1,1\n1,1\n1,2\n2,2\n2,3\n2,3');
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
    }
    this.dataChart1.chart.update();
    this.dataChart2.chart.update();
    this.sampleChart1.chart.update();
    this.sampleChart2.chart.update();

    document.getElementById('data-mean-1').innerText =
      data[0].length ? MathUtil.roundToPlaces(MathUtil.mean(data[0]), 2) : 'No Data';
    document.getElementById('data-mean-2').innerText =
      data[1].length ? MathUtil.roundToPlaces(MathUtil.mean(data[1]), 2) : 'No Data';
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
    let allData = [];
    for (let item of this.data[0]) {
      allData.push({ datasetId: 0, value: item});
    }
    for (let item of this.data[1]) {
      allData.push({ datasetId: 1, value: item});
    }
    let { chosen, unchosen } = randomSubset(allData, this.data[0].length);
    this.addSimulationSample(this.sampleChart1, chosen);
    this.addSimulationSample(this.sampleChart2, unchosen);
    this.sampleChart1.chart.update();
    this.sampleChart2.chart.update();
  }

  addSimulationSample(chart, sample) {
    let facetedArrays = [[], []];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    chart.setDataFromRaw(facetedArrays);
  }
}
