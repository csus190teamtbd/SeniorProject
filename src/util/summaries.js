
export function loadSummaryElements(dom) {
  let summaryElements = {};
  let summaryElementList = dom.querySelectorAll('[summary]');
  for (let summaryElement of summaryElementList) {
    let key = summaryElement.getAttribute('summary');
    if (!summaryElements[key]) {
      summaryElements[key] = [];
    }
    summaryElements[key].push(summaryElement);
  }
  return summaryElements;
}

export function updateSummaryElements(summaryElements, state) {
  for (let [key, value] of Object.entries(state)) {
    let elems = summaryElements[key];
    if (elems) {
      for (let summaryElem of elems) {
        if (summaryElem.hasAttribute('summaryint')) {
          value = Math.round(value);
        }
        else if (typeof value === 'number') {
          value = value.toFixed(4);
        }
        summaryElem.innerText = value + '';
      }
    }
  }
}

