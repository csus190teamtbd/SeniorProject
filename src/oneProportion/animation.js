import HeadIcon from "../images/head.png";
import TailIcon from "../images/tail.png";

function generateCoins(drawResults) {
  const lastResult = drawResults[drawResults.length - 1];
  if (lastResult.length > 50) return [];
  return lastResult.map((x, i) => {
    const head = new Image(50, 50);
    head.src = x === 1 ? HeadIcon : TailIcon;
    head.setAttribute("id", `coin-${i}`);
    return head;
  });
}

export { generateCoins };
