const _ = require("lodash");

const input = `zi-end
XR-start
zk-zi
TS-zk
zw-vl
zk-zw
end-po
ws-zw
TS-ws
po-TS
po-YH
po-xk
zi-ws
zk-end
zi-XR
XR-zk
vl-TS
start-zw
vl-start
XR-zw
XR-vl
XR-ws`;

const connections = input.split("\n").map((line) => line.split("-"));

const neighborsByNode = new Map();
_.each(connections, ([a, b]) => {
  registerNeighbor(a, b);
  registerNeighbor(b, a);
});

let paths = 0;
traverse("afdadsadfsadfsadfs", "start", new Set(), new Set(), false);

console.log(paths);

function traverse(prev, node, visited, pathsTaken, repeated) {
  if (node === "end") {
    paths++;
    return;
  }
  if (!isBig(node) && visited.has(node)) {
    if (node === "start" || repeated) {
      return;
    } else {
      repeated = true;
    }
  }
  const pathTaken = `${prev},${node}`;
  // if (pathsTaken.has(pathTaken)) {
  //   return;
  // }

  const newVisited = new Set(visited);
  newVisited.add(node);
  const newPathsTaken = new Set(pathsTaken);
  pathsTaken.add(pathTaken);

  const neighbors = neighborsByNode.get(node) || [];
  _.each(neighbors, (n) => {
    traverse(node, n, newVisited, newPathsTaken, repeated);
  });
}

function registerNeighbor(a, b) {
  neighborsByNode.set(a, neighborsByNode.get(a) || []);
  neighborsByNode.get(a).push(b);
}

function isBig(node) {
  return node.toLowerCase() !== node;
}
