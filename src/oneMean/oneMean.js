import { dropTextFileOnTextArea, parseCsvVariableByCol } from "../util/csv.js";
import StackedDotChart from "../util/stackeddotchart.js";

export class OneMean {
  constructor(OneMeanDiv) {
    this.ele = {
      csvTextArea: OneMeanDiv.querySelector("#csv-input"),
      loadDataBtn: OneMeanDiv.querySelector("#load-data-btn"),
      variableDropDown: OneMeanDiv.querySelector("#variable")
    };
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
    };

    this.ele.variableDropDown.addEventListener("change", e => {
      const varName = e.target.value;
      if (e.target.value) this.updateData(varName, this.data);
    });

    this.loadEventListener();
  }

  loadVariablesToDropDown(dataSets, dropDownElement) {
    const varNames = Object.keys(dataSets);
    const html = varNames.reduce((acc, x) => {
      return (acc += `<option value="${x}">${x}</option>`);
    }, '<option value="null">Please Select Variable</option>');

    dropDownElement.innerHTML = html;
  }

  updateData(varName, data) {
    this.dataChart1.updateLabelName(0, varName);
    this.dataChart1.setDataFromRaw([data[varName]]);
    this.dataChart1.changeDotAppearance(1, undefined);
    if (data[varName].length) {
      let min = Math.min.apply(undefined, data[varName]);
      let max = Math.max.apply(undefined, data[varName]);
      this.dataChart1.setScale(min, max);
    }
    this.dataChart1.chart.update();

    // document.getElementById("data-mean-1").innerText = data[0].length
    //   ? MathUtil.roundToPlaces(MathUtil.mean(data[0]), 2)
    //   : "No Data";
    // document.getElementById("data-mean-2").innerText = data[1].length
    //   ? MathUtil.roundToPlaces(MathUtil.mean(data[1]), 2)
    //   : "No Data";
  }
}
