const { isPositiveInts } = require('./Validator');
const { sample, create2dCellBoard } = require('./Util');

const LOSE = 0b11; // 3
const WIN = 0b01; // 1
const CONTINUE = 0b00; // 0

const gameStateMapper = {
  0b11: Symbol("LOSE"),
  0b01: Symbol("WIN"),
  0b00: Symbol("CONTINUE"),
}

module.exports = class Board {
  constructor({
    width = 10,
    height = 10,
    mine = 10,
  }) {
    isPositiveInts([width, height, mine]);
    if (mine > width * height) throw "TOO_MANY_MINES";

    this.width = width;
    this.height = height;
    this.mine = mine;
    this.mines = [];
    this.remain = width * height - mine;
    this.total = this.remain; // constant
    this.board = create2dCellBoard(width, height);
    this.timer = 0;
    this.timerReference = null;
    this._state = CONTINUE;
  }

  init(cell) {
    if (this.remain === this.total) {
      this.mines = sample(this.board.flat().filter(_cell => _cell !== cell), this.mine); // sampling cells expect the cell user clicked
      for (const mine of this.mines) {
        mine.mine_counter = -1; // set mine
        // console.log("Mine:", mine);
        this.increaseSiblingsMineCounter(mine);
      }
      this.timerReference = setInterval(() => ++this.timer, 1000);
    } else {
      console.warn("SHOULD_INIT_ONCE_ONLY");
    }
  }

  open(x, y) {
    const cell = this.board[y][x];
    if (this.remain >= this.total) {
      this.init(cell);
    }

    switch (cell.state) {
      case 0:
        const isMine = cell.open();
        if (isMine) {
          clearInterval(this.timerReference);
          this.openAllMines();
          this._state |= LOSE;
          return LOSE;
        };

        --this.remain;
        if (this.remain === 0) {
          this._state |= WIN;
          return WIN
        };

        if (cell.mine_counter === 0) {
          return this.openSiblings(cell);
        }

        return CONTINUE;

      case 1:
        if (cell.canOpenSiblings) {
          return this.openSiblings(cell);
        }

      default:
        return CONTINUE;
    }
  }

  openAllMines() {
    for (const mine of this.mines) {
      mine.open();
    }
  }

  flag(x, y) {
    const cell = this.board[y][x];
    cell.flag();
    switch (cell.state) {
      case 0:
        this.decreaseSiblingsFlagCounter(cell);
        break;

      case 2:
        this.increaseSiblingsFlagCounter(cell);
        break;

      default:
        break;
    }
  }

  getSiblings(cell) {
    return this.board.slice(Math.max(cell.y - 1, 0), cell.y + 2).map(row => row.slice(Math.max(cell.x - 1, 0), cell.x + 2)).flat().filter(_cell => _cell !== cell);
  }

  openSiblings(cell) {
    const siblings = this.getSiblings(cell);
    let result = CONTINUE;
    for (const sibling of siblings) {
      if (sibling.state === 0) {
        result |= this.open(sibling.x, sibling.y);
      }
    }
    return result;
  }

  increaseSiblingsMineCounter(cell) {
    const siblings = this.getSiblings(cell);
    for (const sibling of siblings) {
      sibling.increaseMineCounter();
    }
  }

  increaseSiblingsFlagCounter(cell) {
    const siblings = this.getSiblings(cell);
    for (const sibling of siblings) {
      sibling.increaseFlagCounter();
    }
  }

  decreaseSiblingsFlagCounter(cell) {
    const siblings = this.getSiblings(cell);
    for (const sibling of siblings) {
      sibling.decreaseFlagCounter();
    }
  }

  get state() {
    return gameStateMapper[this._state];
  }

  toString() {
    return "\n" + this.board.map(row => row.join("")).join("\n") + "\n";
  }
}