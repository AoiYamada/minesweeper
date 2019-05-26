const { isInRange } = require('./Validator');

const fullWidthStateMapper = {
  0: "⬛",
  2: "⚐",
}

const fullWidthNumberMapper = {
  "-1": "💣",
  0: "⬜",
  1: "１",
  2: "２",
  3: "３",
  4: "４",
  5: "５",
  6: "６",
  7: "７",
  8: "８",
}

// {
//     mine_counter: enum(0~8, -1 == mine)
//     flag_counter: enum(0~8)
//     state: enum(0~2, 0 == close, 1 == open, 2 == flag)
//     x: position x, 0~width - 1
//     y: position y, 0~height - 1
//     canOpenSiblings: true / false
//     open(): return isMine, true / false
//     flag(): no return
// }
module.exports = class Cell {
  /**
   * @param {Object} position
   * @param {Integer} position.x
   * @param {Integer} position.y
   */
  constructor({ x, y }) {
    this.mine_counter = 0;
    this.flag_counter = 0;
    this.x = x;
    this.y = y;
    this.state = 0;
  }

  /**
   * @return {Boolean} is_mine
   */
  open() {
    if (this.state == 0) {
      this.state = 1;
    }
    return this.mine_counter === -1;
  }

  flag() {
    if (this.state !== 1) {
      this.state = Math.abs(2 - this.state);
    }
  }

  increaseMineCounter() {
    if (this.mine_counter !== -1) this.mine_counter += 1;
    isInRange(this.mine_counter, -1, 8)
  }

  increaseFlagCounter() {
    this.flag_counter += 1;
    isInRange(this.flag_counter, 0, 8)
  }

  decreaseFlagCounter() {
    this.flag_counter -= 1;
    isInRange(this.flag_counter, 0, 8)
  }

  get canOpenSiblings() {
    return this.flag_counter >= this.mine_counter;
  }

  toString() {
    switch (this.state) {
      case 0:
      case 2:
        return fullWidthStateMapper[this.state];
    }
    return fullWidthNumberMapper[this.mine_counter];
  }
}