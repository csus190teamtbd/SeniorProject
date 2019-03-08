import { dropTextFileOnTextArea, parseCSVtoSingleArray } from "../util/csv.js";
import StackedDotChart from "../util/stackeddotchart.js";
import * as MathUtil from "/util/math.js";

export class OneMean {
  constructor(OneMeanDiv) {
    this.shiftMean = 0;
    this.shiftedData = [];
    this.originalData = [];
    this.ele = {
      csvTextArea: OneMeanDiv.querySelector("#csv-input"),
      loadDataBtn: OneMeanDiv.querySelector("#load-data-btn"),
      shiftMeanSlider: OneMeanDiv.querySelector("#shiftMeanSlider"),
      shiftMeanInput: OneMeanDiv.querySelector("#shiftMeanInput"),
      originalDataDisplay: OneMeanDiv.querySelector("#original-data-display")
    };
    this.datasets = [{ label: "Data", backgroundColor: "#333333", data: [] }];
    this.dataChart1 = new StackedDotChart(
      OneMeanDiv.querySelector("#data-chart-1"),
      [this.datasets[0]]
    );
    this.loadEventListener = () => {
      this.ele.loadDataBtn.addEventListener("click", e => {
        this.originalData = parseCSVtoSingleArray(this.ele.csvTextArea.value);
        console.log(this.originalData);
        this.displayDataWithID(this.ele.originalDataDisplay, this.originalData);
        e.preventDefault();
      });

      dropTextFileOnTextArea(this.ele.csvTextArea);
      this.shiftMeanListener();
    };
    this.loadEventListener();
  }

  displayDataWithID(textAreaEle, arr) {
    textAreaEle.value = arr.reduce(
      (acc, value, index) => acc + `${index}\t${value}\n`,
      "ID\tData\n"
    );
  }

  shiftMeanListener() {
    this.ele.shiftMeanInput.addEventListener("input", e => {
      this.updatedShiftedData(Number(e.target.value) || 0);
    });
    this.ele.shiftMeanSlider.addEventListener("change", e => {
      this.updatedShiftedData(Number(e.target.value) || 0);
    });
  }

  updatedShiftedData(value) {
    this.shiftMean = value;
    this.ele.shiftMeanSlider.value = value;
    this.ele.shiftMeanInput.value = value;
    this.shiftedData = this.selectedData.map(x => x + this.shiftMean);
    this.updateData(this.shiftedData);
  }

  updateData(data) {
    if (data.length) {
      this.dataChart1.setDataFromRaw([data]);
      this.dataChart1.changeDotAppearance(1, 1);
      let min = Math.min.apply(undefined, data);
      let max = Math.max.apply(undefined, data);
      this.dataChart1.setScale(min, max);
    }
    this.dataChart1.chart.update();
    document.getElementById("new-mean").innerText = data.length
      ? MathUtil.roundToPlaces(MathUtil.mean(data), 2)
      : "No Data";
    // document.getElementById("data-mean-2").innerText = data[1].length
    //   ? MathUtil.roundToPlaces(MathUtil.mean(data[1]), 2)
    //   : "No Data";
  }
}
