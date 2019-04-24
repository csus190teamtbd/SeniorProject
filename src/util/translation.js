/**
 * input:
 *    eg: "binomial"=>"Binomial", "maxHead"=>"Max # de caras"
 * output:
 *    : {binomial: "Binomial", maxHead: "Max # de caras", minHead: "Min # de caras"}
 *
 */

export function readTranlationData(domElement) {
  const res = {};
  const regex = /"((?<key>.*?)"=>"(?<value>.*?))"/g;
  const allTranslation = domElement.innerText;
  console.log(allTranslation);
  let match = regex.exec(domElement.innerText);
  while (match != null) {
    console.log(match[2], match[3]);
    res[match[2]] = match[3];
    match = regex.exec(allTranslation);
  }
  return res;
}
