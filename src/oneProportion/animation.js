const images = {
  1: "../images/head.png",
  0: "../images/tail.png"
};
function generateCoins(drawResults) {
  const lastResult = drawResults[drawResults.length - 1];
  if (lastResult.length > 50) return [];
  return lastResult.map((x, i) => {
    const img = document.createElement("img");
    img.setAttribute("src", images[x]);
    img.setAttribute("height", 42);
    img.setAttribute("width", 42);
    img.setAttribute("id", `coin-${i}`);
    return img;
  });
}

export { generateCoins };
