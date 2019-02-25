export function randomInt(from, to) {
  return Math.floor((to - from) * Math.random()) + from;
}

/**
 * Returns a two arrays: one array containing `n` pseudo-randomly chosen
 * elements from iterable `itr`, and another array containing all the
 * `unchosen` items. The order of the returned arrays are not guaranteed to be
 * random. Throws an exception if n > length(itr).
 */
export function randomSubset(itr, n) {
  let result = Array(n);
  let unchosen = [];
  let seen = 0;
  for (let item of itr) {
    // Take first `n` items
    if (seen < n) {
      result[seen] = item;
    }
    // Each subsequent item has some chance of being pulled in
    else if (Math.random() < (n / (seen + 1))) {
      // Randomly decide who gets the boot
      let replaceIdx = randomInt(0, n);
      unchosen.push(result[replaceIdx]);
      result[replaceIdx] = item;
    }
    else {
      unchosen.push(item);
    }
    seen += 1;
  }
  if (seen < n) {
    throw new Error('Not Enough Elements');
  }
  return {chosen: result, unchosen};
}
