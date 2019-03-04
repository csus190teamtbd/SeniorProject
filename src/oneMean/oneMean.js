import { dropTextFileOnTextArea, parseCsvVariableByCol } from "../util/csv.js";

export class OneMean {
  constructor(OneMeanDiv) {
    this.ele = {
      csvTextArea: OneMeanDiv.querySelector("#csv-input"),
      loadDataBtn: OneMeanDiv.querySelector("#load-data-btn")
    };

    this.loadEventListener = () => {
      this.ele.loadDataBtn.addEventListener("click", () => {
        const arr = parseCsvVariableByCol(this.ele.csvTextArea.value);
        console.log(arr);
      });
      dropTextFileOnTextArea(this.ele.csvTextArea);
    };

    this.loadEventListener();
  }
}
