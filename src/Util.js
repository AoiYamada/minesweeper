const Cell = require('./Cell');

function create2dCellBoard(width, height) {
  return Array.from({ length: height }, (v, y) => Array.from({ length: width }, (v, x) => new Cell({ x, y })))
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
  a = a.slice(); // avoid side effect
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(a, num) {
  return shuffle(a).slice(0, num);
}

module.exports = {
  create2dCellBoard,
  shuffle,
  sample,
}