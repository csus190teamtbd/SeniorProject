export function dropTextFileOnTextArea(textAreaElement) {
  textAreaElement.addEventListener("dragover", () => {
    textAreaElement.classList.add("dragover");
  });

  textAreaElement.addEventListener("dragleave", () => {
    textAreaElement.classList.remove("dragover");
  });

  textAreaElement.addEventListener("drop", e => {
    textAreaElement.classList.remove("dragover");
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
  const numRegex = /(\d+(\.\d+)?)/;
  return rawData
    .split(/[\r\n]+/)
    .filter(x => numRegex.test(x))
    .map((x, index) => ({ id: index, value: Number(x.match(numRegex)[0]) }));
}

//return promise
export function readLocalFile(filePath) {
  return fetch(filePath).then(r => r.text());
}

export function parseTranslationCSV(rawData, lang, pageTitle) {
  const rows = rawData.split(/[\r\n]+/);
  const res = rows.reduce((acc, row) => {
    if (row) {
      let [en, es, key] = row.split("\t");
      // console.log(key.split("."));
      const [mainKey, subKey] = key.split(".");
      if (mainKey === pageTitle) {
        if (lang === "en") return { ...acc, [subKey]: en };
        if (lang === "es") return { ...acc, [subKey]: es };
      } else return acc;
    } else return acc;
  }, {});
  // console.log(res);
  return res;
}

export async function loadTranslation(filePath) {
  try {
    const r = await fetch(filePath);
    return await r.text();
  } catch (error) {}
}
