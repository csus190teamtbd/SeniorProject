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
