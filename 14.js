const _ = require("lodash");

const input = `VOKKVSKKPSBVOOKVCFOV

PK -> P
BB -> V
SO -> O
OO -> V
PV -> O
CB -> H
FH -> F
SC -> F
KF -> C
VS -> O
VP -> V
FS -> K
SP -> C
FC -> N
CF -> C
BF -> V
FN -> K
NH -> F
OB -> F
SV -> H
BN -> N
OK -> K
NF -> S
OH -> S
FV -> B
OC -> F
VF -> V
HO -> H
PS -> N
NB -> N
NS -> B
OS -> P
CS -> S
CH -> N
PC -> N
BH -> F
HP -> P
HH -> V
BK -> H
HC -> B
NK -> S
SB -> C
NO -> K
SN -> H
VV -> N
ON -> P
VN -> H
VB -> P
BV -> O
CV -> N
HV -> C
SH -> C
KV -> F
BC -> O
OF -> P
NN -> C
KN -> F
CO -> C
HN -> P
PP -> V
FP -> O
CP -> S
FB -> F
CN -> S
VC -> C
PF -> F
PO -> B
KB -> H
HF -> P
SK -> P
SF -> H
VO -> N
HK -> C
HB -> C
OP -> B
SS -> V
NV -> O
KS -> N
PH -> H
KK -> B
HS -> S
PN -> F
OV -> S
PB -> S
NC -> B
BS -> N
KP -> C
FO -> B
FK -> N
BP -> C
NP -> C
KO -> C
VK -> K
FF -> C
VH -> H
CC -> F
BO -> S
KH -> B
CK -> K
KC -> C`;

const [template, rulesBlock] = input.split("\n\n");

const rules = rulesBlock
  .split("\n")
  .map((ruleLine) => ruleLine.split(" -> "))
  .map(([pair, insert]) => ({ pair, insert }));

const ruleMap = new Map(rules.map(({ pair, insert }) => [pair, insert]));

function recursivelyGetCount(leftChar, rightChar, stepsDone, limit) {
  if (stepsDone >= limit) {
    return new Map();
  }

  const pair = leftChar + rightChar;
  const insert = ruleMap.get(pair);
  if (insert == null) {
    return new Map();
  }

  const thisMap = new Map([[insert, 1]]);
  const leftMap = memoizedRecursivelyGetCount(
    leftChar,
    insert,
    stepsDone + 1,
    limit
  );
  const rightMap = memoizedRecursivelyGetCount(
    insert,
    rightChar,
    stepsDone + 1,
    limit
  );
  return sumMaps([thisMap, leftMap, rightMap]);
}

const memoizedRecursivelyGetCount = _.memoize(
  recursivelyGetCount,
  (leftChar, rightChar, stepsDone, limit) => {
    return [leftChar, rightChar, stepsDone, limit].join(",");
  }
);

function sumMaps(maps) {
  const result = new Map();
  maps.forEach((m) => {
    m.forEach((count, char) =>
      result.set(char, (result.get(char) || 0) + count)
    );
  });
  return result;
}

function step(template) {
  const iterateStart = Date.now();

  const insertions = Array(template.length);
  let insertionI = 0;
  _.each(template, (ph, i) => {
    if (i >= template.length - 1) {
      return;
    }

    const pair = `${template.charAt(i)}${template.charAt(i + 1)}`;
    const char = ruleMap.get(pair);
    if (char == null) {
      return;
    }

    insertions[insertionI++] = { char, index: i + 1 };
  });

  console.log("iterate duration", Date.now() - iterateStart);

  const insertStart = Date.now();

  insertionI = 0;
  let insertion = insertions[insertionI++];
  const newPolymer = Array(template.length + _.compact(insertions).length);
  let polymerI = 0;
  _.each(template, (char, i) => {
    if (insertion != null && i === insertion.index) {
      newPolymer[polymerI++] = insertion.char;
      insertion = insertions[insertionI++];
    }
    newPolymer[polymerI++] = char;
  });

  console.log("insert duration", Date.now() - insertStart);

  return newPolymer.join("");
}

// let polymer = template;
// for (let i = 0; i < 40; i++) {
//   polymer = step(polymer);
//   console.log(i);
// }

// const counts = new Map();
// _.each(polymer, (char) => {
//   counts.set(char, (counts.get(char) || 0) + 1);
// });

let counts = new Map();
_.each(template, (char) => counts.set(char, (counts.get(char) || 0) + 1));

_.each(template, (char, i) => {
  if (i >= template.length - 1) {
    return;
  }
  counts = sumMaps([
    counts,
    memoizedRecursivelyGetCount(char, template.charAt(i + 1), 0, 40),
  ]);
});

let max = null;
let min = null;
counts.forEach((count, char) => {
  if (max == null || count > max.count) {
    max = { char, count };
  }
  if (min == null || count < min.count) {
    min = { char, count };
  }
});

console.log(max.count - min.count);
