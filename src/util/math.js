export function mean(itr) {
  let sum = 0;
  let count = 0;
  for (let item of itr) {
    sum += item;
    count += 1;
  }
  return sum / count;
}

export function roundToPlaces(value, places) {
  let pow10 = Math.pow(10, places);
  return Math.floor(value * pow10) / pow10;
}

/**
 * js Math.min and Math.max will cause stack overflow for large array size
 * @param {numnber array} arr
 */
export function minInArray(arr) {
  if (!arr) return undefined;
  return arr.reduce((acc, x) => {
    return acc < x ? acc : x;
  }, arr[0]);
}

export function maxInArray(arr) {
  if (!arr) return undefined;
  return arr.reduce((acc, x) => {
    return acc > x ? acc : x;
  }, arr[0]);
}

export function drawSamplesNoRepitition(arr, noOfEle) {
  noOfEle = Math.min(noOfEle, arr.length);
  for (let i = arr.length - 1; i > 0; i--) {
    const index = Math.floor(Math.random() * arr.length);
    const temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }
  return arr.slice(0, noOfEle);
}
