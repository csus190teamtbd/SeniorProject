export function mean(itr) {
  let sum = 0;
  let count = 0;
  for (let item of itr) {
    sum += item;
    count += 1;
  }
  return sum / count;
}

// Population Standard Deviation
export function stddev(itr) {
  return Math.sqrt(variance(itr));
}

// Sample Standard Deviation
export function sampleStddev(itr) {
  const n = itr.length;
  if (n <= 1) return NaN;
  const sampleMean = mean(itr);
  const devSquare = itr.reduce((acc, x) => {
    return (x - sampleMean) * (x - sampleMean) + acc;
  }, 0);
  return Math.sqrt(devSquare / (n - 1));
}

export function variance(itr) {
  let sum = 0;
  let count = 0;
  let sumOfSquares = 0;
  for (let item of itr) {
    sum += item;
    sumOfSquares += item * item;
    count += 1;
  }
  let mean = sum / count;
  // variance = sum(X^2) / N - mean(X)^2
  return sumOfSquares / count - mean * mean;
}

export function roundToPlaces(value, places) {
  let pow10 = Math.pow(10, places);
  return Math.round(value * pow10) / pow10;
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

/**
 * Counts items of iterable meeting predicate
 *
 * @param itr iterable
 * @param p   predicate
 */
export function countWhere(itr, p) {
  if (itr === undefined || p === undefined) {
    throw new Error("Missing parameter");
  }
  let res = 0;
  for (let item of itr) {
    if (p(item)) {
      res += 1;
    }
  }
  return res;
}
