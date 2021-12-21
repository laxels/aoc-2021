const _ = require("lodash");

const input = `2478668324
4283474125
1663463374
1738271323
4285744861
3551311515
8574335438
7843525826
1366237577
3554687226`;

const grid = input.split("\n").map((line) => line.split("").map(Number));

const flashedThisStep = new Set();
let totalFlashes = 0;
let step = 0;

while (true) {
  if (!cycle()) {
    break;
  }
}

console.log(totalFlashes);
console.log(step);

function cycle() {
  step++;
  grid.forEach((row, i) => row.forEach((v, j) => increment(i, j)));
  if (flashedThisStep.size === 100) {
    return false;
  }
  flashedThisStep.forEach((key) => {
    const [i, j] = key.split(",").map(Number);
    grid[i][j] = 0;
  });
  flashedThisStep.clear();
  return true;
}

function increment(i, j) {
  grid[i][j]++;
  if (grid[i][j] > 9) {
    flash(i, j);
  }
}

function flash(i, j) {
  const key = `${i},${j}`;
  if (flashedThisStep.has(key)) {
    return;
  }
  flashedThisStep.add(key);
  totalFlashes++;
  [i - 1, i, i + 1].forEach((i2) => {
    [j - 1, j, j + 1].forEach((j2) => {
      if (i2 < 0 || j2 < 0 || i2 >= grid.length || j2 >= grid[i2].length) {
        return;
      }
      if (i2 === i && j2 === j) {
        return;
      }
      increment(i2, j2);
    });
  });
}
