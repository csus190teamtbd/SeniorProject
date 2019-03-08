export function dropTextFileOnTextArea(textAreaElement) {
  textAreaElement.addEventListener("dragover", () => {
    textAreaElement.style.backgroundColor = "skyblue";
  });

  textAreaElement.addEventListener("dragleave", () => {
    textAreaElement.style.backgroundColor = "white";
  });

  textAreaElement.addEventListener("drop", e => {
    textAreaElement.style.backgroundColor = "white";
    let file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      textAreaElement.value = event.target.result;
    };
    reader.readAsText(file);
    e.preventDefault();
  });
}

/**
 * rawData format:
 * a,b,c
 * 1,2,3
 * 15.2,54.3,55.3
 *
 * return {
 * a: [1, 15.2]
 * b: [2, 54.3]
 * c: [3, 55.3]
 * }
 *
 * throw error if data not match
 */
export function parseCsvVariableByCol(rawData) {
  console.log(rawData);
  const [Header, ...data] = rawData.split(/[\r\n]+/);
  const varNames = Header.split(/[\t,]/).map(x => x.trim());

  const res = varNames.reduce((acc, x) => {
    return { ...acc, [x]: [] };
  }, {});

  data.forEach(row => {
    const nums = row.match(/(\d+(\.\d+)?)/g);
    varNames.forEach((x, index) => {
      if (nums && nums.length === varNames.length)
        res[x].push(Number(nums[index]));
    });
  });
  return res;
}

export function parseCSVtoSingleArray(rawData) {
  console.log(rawData);
  const numRegex = /(\d+(\.\d+)?)/;
  return rawData
    .split(/[\r\n]+/)
    .filter(x => numRegex.test(x))
    .map(x => Number(x.match(numRegex)[0]));
}
