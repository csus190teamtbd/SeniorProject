const images = {
  1: "../images/head.png",
  0: "../images/tail.png"
};
function generateCoins(drawResults) {
  if (drawResults.length > 50) return [];
  return drawResults.map((x, i) => {
    const img = document.createElement("img");
    img.setAttribute("src", images[x]);
    img.setAttribute("height", 42);
    img.setAttribute("width", 42);
    img.setAttribute("id", `coin-${i}`);
    return img;
  });
}

export { generateCoins };
