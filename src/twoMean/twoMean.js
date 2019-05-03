---
---
import {
  dropTextFileOnTextArea,
  // TODO(matthewmerrill): use these library functions
  parseCSVtoSingleArray,
  readLocalFile
} from "{{base}}../util/csv.js";
import StackedDotChart from '{{base}}../util/stackeddotchart.js';
import TailChart from "{{base}}../util/tailchart.js";
import * as MathUtil from '{{base}}../util/math.js';
import * as Summaries from "{{base}}../util/summaries.js";
import { randomSubset } from '{{base}}../util/sampling.js';
import translation from "{{base}}../util/translate.js";

export class TwoMean {
  constructor(twoMeanDiv) {
    this.twoMeanDiv = twoMeanDiv;
    this.csvInput = twoMeanDiv.querySelector('#csv-input');
    this.data = undefined;
    this.sampleDiffs = [];
    this.diffData = {};
    this.summaryElements = Summaries.loadSummaryElements(twoMeanDiv);

    this.dom = {
      tailDirectionElement: twoMeanDiv.querySelector('#tail-direction'),
      tailInputElement: twoMeanDiv.querySelector('#tail-input'),
    };

    this.datasets = [
      { label: translation.twoMean.group1, backgroundColor: 'orange', data: [] },
      { label: translation.twoMean.group2, backgroundColor: 'rebeccapurple', data: [] },
    ];
    this.dataChart1 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-1'), [this.datasets[0]]);
    this.dataChart2 = new StackedDotChart(twoMeanDiv.querySelector('#data-chart-2'), [this.datasets[1]]);
    this.sampleChart1 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-1'), this.datasets);
    this.sampleChart1.chart.options.legend.display = false;
    this.sampleChart2 = new StackedDotChart(twoMeanDiv.querySelector('#sample-chart-2'), this.datasets);
    this.sampleChart2.chart.options.legend.display = false;
    // TODO(matthewmerrill): move other charts into here
    this.charts = {
      tailChart: new TailChart({
        chartElement: twoMeanDiv.querySelector('#diff-chart'),
        whatAreWeRecording: translation.twoMean.differences,
        summaryElements: this.summaryElements,
      }),
    };

    this.dom.tailDirectionElement.addEventListener('change', () => {
      this.charts.tailChart.setTailDirection(this.dom.tailDirectionElement.value);
      this.charts.tailChart.updateChart();
    });
    this.dom.tailInputElement.addEventListener('change', () => {
      this.charts.tailChart.setTailInput(this.dom.tailInputElement.value * 1);
      this.charts.tailChart.updateChart();
    });
    
    this.updateData([[], []]);
    dropTextFileOnTextArea(this.csvInput);
  }

  reset() {
    this.csvInput.value = '';
    this.loadData();
  }

  loadData() {
    let rawData = this.parseData(this.csvInput.value.trim());
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

    let dataValues = data[0].concat(data[1]);
    if (dataValues.length) {
      let min = Math.min.apply(undefined, dataValues);
      let max = Math.max.apply(undefined, dataValues);
      this.dataChart1.setScale(min, max);
      this.dataChart2.setScale(min, max);
      this.sampleChart1.setScale(min, max);
      this.sampleChart2.setScale(min, max);
    }

    this.dataChart1.setDataFromRaw([data[0]]);
    this.dataChart2.setDataFromRaw([data[1]]);
    this.sampleChart1.clear();
    this.sampleChart2.clear();

    this.dataChart1.scaleToStackDots();
    this.dataChart2.scaleToStackDots();
    this.sampleChart1.scaleToStackDots();
    this.sampleChart2.scaleToStackDots();

    this.dataChart1.chart.update();
    this.dataChart2.chart.update();
    this.sampleChart1.chart.update();
    this.sampleChart2.chart.update();
    this.updateSimResults();

    let summary = {
      dataMean1: translation.twoMean.noData, // TODO(matthewmerrill): make this translatable
      dataMean2: translation.twoMean.noData,
      dataMeanDiff: translation.twoMean.noData,
    };
    if (data[0].length) {
      summary.dataMean1 = MathUtil.mean(data[0]);
    }
    if (data[1].length) {
      summary.dataMean2 = MathUtil.mean(data[1]);
    }
    if (data[0].length && data[1].length) {
      summary.dataMeanDiff = summary.dataMean1 - summary.dataMean2;
    }
    Summaries.updateSummaryElements(this.summaryElements, summary);
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
    let results = [];
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
      results.push(sampleDiffOfMeans);

      let summary = {
        sampleMean1: mean0,
        sampleMean2: mean1,
        sampleMeanDiff: sampleDiffOfMeans,
      };
      Summaries.updateSummaryElements(this.summaryElements, summary);
    }
    this.charts.tailChart.addAllResults(results);
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

    let summary = {
      simMean1: mean0,
      simMean2: mean1,
      simMeanDiff: mean1 - mean0,
      sampleDiffMean, sampleDiffStdDev,
    }
    Summaries.updateSummaryElements(this.summaryElements, summary);

    /*
    this.diffChart.updateChart();
    this.diffChart.setDataFromRaw([this.sampleDiffs]);
    this.diffChart.scaleToStackDots();
    this.diffChart.chart.update();
    */
    this.charts.tailChart.updateChart();
  }
}
