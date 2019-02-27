// TODO(matthewmerrill): don't CDN
//import Chart from "chart.js";
import StackedDotChart from '/util/stackeddotchart.js';
import * as MathUtil from '/util/math.js';
import { randomSubset } from '/util/sampling.js';

export class TwoMean {
  constructor(twoMeanDiv) {
    this.twoMeanDiv = twoMeanDiv;
    this.csvInput = twoMeanDiv.querySelector('#csv-input');
    this.diffChart = twoMeanDiv.querySelector('#diffChart');
    this.data = undefined;
    this.sampleDiffs = [];
    this.diffData = {};

    this.datasets = [
      { label: 'Group One', backgroundColor: '#333333', data: [] },
      { label: 'Group Two', backgroundColor: '#93cb52', data: [] },
    ];
    this.dataChart1 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-1'), [this.datasets[0]]);
    this.dataChart2 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-2'), [this.datasets[1]]);
    this.sampleChart1 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-1'), this.datasets);
    this.sampleChart2 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-2'), this.datasets);
    this.diffChart = new StackedDotChart(twoMeanDiv.querySelector('#diff-chart'), [
      { label: 'Diff of Means', backgroundColor: '#333333', data: [], },
    ]);
    this.updateData([[], []]);
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
    }
    this.dataChart1.chart.update();
    this.dataChart2.chart.update();
    this.sampleChart1.chart.update();
    this.sampleChart2.chart.update();
    this.updateSimResults();

    let mean0 = MathUtil.mean(data[0]);
    let mean1 = MathUtil.mean(data[1]);
    document.getElementById('data-mean-1').innerText =
      data[0].length
        ? MathUtil.roundToPlaces(mean0, 2)
        : 'No Data';
    document.getElementById('data-mean-2').innerText =
      data[1].length
        ? MathUtil.roundToPlaces(mean1, 2)
        : 'No Data';
    document.getElementById('diff-of-data').innerText =
      (data[0].length && data[1].length)
        ? MathUtil.roundToPlaces(mean1 - mean0, 2)
        : 'No Data';
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
      this.sampleDiffs.push(sampleDiffOfMeans);
    }
    this.updateSimResults();
  }

  addSimulationSample(chart, sample) {
    let facetedArrays = [[], []];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    chart.setDataFromRaw(facetedArrays);
  }

  updateSimResults() {
    let mean0 = MathUtil.mean(this.data[0]);
    let mean1 = MathUtil.mean(this.data[1]);
    let datasetDiffOfMeans = mean1 - mean0; // TODO(matthewmerrill): cache this! 
    let sampleDiffMean = MathUtil.mean(this.sampleDiffs);
    let sampleDiffStdDev = MathUtil.stddev(this.sampleDiffs);

    document.getElementById('mean-sample-diffs').innerText =
      (this.sampleDiffs.length)
        ? MathUtil.roundToPlaces(sampleDiffMean, 2)
        : 'No Samples';
    document.getElementById('stddev-sample-diffs').innerText =
      (this.sampleDiffs.length)
        ? MathUtil.roundToPlaces(sampleDiffStdDev, 2)
        : 'No Samples';
    document.getElementById('how-many-stddev').innerText =
      (this.data[0].length && this.data[1].length && this.sampleDiffs.length)
        ? MathUtil.roundToPlaces((datasetDiffOfMeans - sampleDiffMean) / sampleDiffStdDev, 2)
        : '___';
    this.diffChart.setDataFromRaw([this.sampleDiffs]);
    this.diffChart.chart.update();
  }
}
