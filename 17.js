const _ = require("lodash");
const inquirer = require("inquirer");

const input = `target area: x=281..311, y=-74..-54`;

const target = input
  .replace("target area: ", "")
  .split(", ")
  .map((str) => {
    const [axis, range] = str.split("=");
    const [min, max] = range.split("..").map(Number);
    return {
      axis,
      min,
      max,
    };
  });

const [xTarget, yTarget] = target;
const { min: minX, max: maxX } = xTarget;
const { min: minY, max: maxY } = yTarget;

main();

async function main() {
  let initialVX;
  let initialVY;
  await askForInput();

  while (true) {
    const [peak, reasonForFailure] = exec(initialVX, initialVY);
    if (peak != null) {
      console.log(`SUCCESS`, peak);
      return;
    }

    // switch (reasonForFailure) {
    //   case "overshot":
    //     break;
    //   case "undershot":
    //     break;
    //   case "passed-through":
    //     break;
    // }
    console.log(reasonForFailure);

    await askForInput();
  }

  async function askForInput() {
    ({ initialVX, initialVY } = await inquirer.prompt([
      { name: "initialVX", filter: Number },
      { name: "initialVY", filter: Number },
    ]));
  }
}

function exec(initialVX, initialVY) {
  let x = 0;
  let y = 0;
  let vx = initialVX;
  let vy = initialVY;

  let peak = null;

  while (true) {
    if (peak == null || y > peak) {
      peak = y;
    }
    step();
    if (inTargetArea()) {
      return [peak, null];
    }
    if (failed()) {
      return [null, getReasonForFailure()];
    }
  }

  function step() {
    x += vx;
    y += vy;
    drag();
    vy--;
  }

  function drag() {
    if (vx === 0) {
      return;
    }
    if (vx < 0) {
      vx++;
    } else {
      vx--;
    }
  }

  function getReasonForFailure() {
    if (passedThrough()) {
      return "passed-through";
    }
    if (overshot()) {
      return "overshot";
    }
    if (undershot()) {
      return "undershot";
    }
  }

  // TODO: this is incorrect
  function passedThrough() {
    return x > maxX && y < minY;
  }

  function overshot() {
    return x > maxX;
  }

  function undershot() {
    return x < minX || y < minY;
  }

  function failed() {
    return x > maxX || (vx <= 0 && x < minX) || (vy <= 0 && y < minY);
  }

  function inTargetArea() {
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
}
