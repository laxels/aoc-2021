const input = `3,4,1,2,1,2,5,1,2,1,5,4,3,2,5,1,5,1,2,2,2,3,4,5,2,5,1,3,3,1,3,4,1,5,3,2,2,1,3,2,5,1,1,4,1,4,5,1,3,1,1,5,3,1,1,4,2,2,5,1,5,5,1,5,4,1,5,3,5,1,1,4,1,2,2,1,1,1,4,2,1,3,1,1,4,5,1,1,1,1,1,5,1,1,4,1,1,1,1,2,1,4,2,1,2,4,1,3,1,2,3,2,4,1,1,5,1,1,1,2,5,5,1,1,4,1,2,2,3,5,1,4,5,4,1,3,1,4,1,4,3,2,4,3,2,4,5,1,4,5,2,1,1,1,1,1,3,1,5,1,3,1,1,2,1,4,1,3,1,5,2,4,2,1,1,1,2,1,1,4,1,1,1,1,1,5,4,1,3,3,5,3,2,5,5,2,1,5,2,4,4,1,5,2,3,1,5,3,4,1,5,1,5,3,1,1,1,4,4,5,1,1,1,3,1,4,5,1,2,3,1,3,2,3,1,3,5,4,3,1,3,4,3,1,2,1,1,3,1,1,3,1,1,4,1,2,1,2,5,1,1,3,5,3,3,3,1,1,1,1,1,5,3,3,1,1,3,4,1,1,4,1,1,2,4,4,1,1,3,1,3,2,2,1,2,5,3,3,1,1`;

const fishes = input.split(",").map(Number);

let fishesByDay = new Map();
for (const day of fishes) {
  fishesByDay.set(day, (fishesByDay.get(day) || 0) + 1);
}

for (let i = 0; i < 256; i++) {
  day();
}

let res = 0;
for (const [day, n] of fishesByDay) {
  res += n;
}
console.log(res);

function day() {
  const newFishesByDay = new Map();

  for (const [day, n] of fishesByDay) {
    const newDay = day - 1;
    if (newDay === -1) {
      newFishesByDay.set(6, (newFishesByDay.get(6) || 0) + n);
      newFishesByDay.set(8, (newFishesByDay.get(8) || 0) + n);
    } else {
      newFishesByDay.set(newDay, (newFishesByDay.get(newDay) || 0) + n);
    }
  }

  fishesByDay = newFishesByDay;
}
