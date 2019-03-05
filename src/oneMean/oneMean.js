import { dropTextFileOnTextArea, parseCsvVariableByCol } from "../util/csv.js";
import StackedDotChart from "../util/stackeddotchart.js";
import * as MathUtil from "/util/math.js";

export class OneMean {
  constructor(OneMeanDiv) {
    this.shiftMean = 0;
    (this.shiftedData = []),
      (this.selectedData = []),
      (this.ele = {
        csvTextArea: OneMeanDiv.querySelector("#csv-input"),
        loadDataBtn: OneMeanDiv.querySelector("#load-data-btn"),
        variableDropDown: OneMeanDiv.querySelector("#variable"),
        shiftMeanSlider: OneMeanDiv.querySelector("#shiftMeanSlider"),
        shiftMeanInput: OneMeanDiv.querySelector("#shiftMeanInput")
      });
    this.datasets = [{ label: "Data", backgroundColor: "#333333", data: [] }];
    this.dataChart1 = new StackedDotChart(
      OneMeanDiv.querySelector("#data-chart-1"),
      [this.datasets[0]]
    );
    this.loadEventListener = () => {
      this.ele.loadDataBtn.addEventListener("click", e => {
        this.data = parseCsvVariableByCol(this.ele.csvTextArea.value);
        this.loadVariablesToDropDown(this.data, this.ele.variableDropDown);
        e.preventDefault();
      });

      dropTextFileOnTextArea(this.ele.csvTextArea);
      this.shiftMeanListener();

      this.ele.variableDropDown.addEventListener("change", e => {
        const varName = e.target.value;
        if (varName) {
          this.dataChart1.updateLabelName(0, varName);
          this.updatedShiftedData(0);
          this.selectedData = this.data[varName];
          if (varName) this.updateData(this.selectedData);
          document.getElementById("original-mean").innerText = this.selectedData
            .length
            ? MathUtil.roundToPlaces(MathUtil.mean(this.selectedData), 2)
            : "No Data";
        }
      });
    };
    this.loadEventListener();
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

  loadVariablesToDropDown(dataSets, dropDownElement) {
    const varNames = Object.keys(dataSets);
    const html = varNames.reduce((acc, x) => {
      return (acc += `<option value="${x}">${x}</option>`);
    }, `<option value="">Please Select Variable</option>`);

    dropDownElement.innerHTML = html;
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
