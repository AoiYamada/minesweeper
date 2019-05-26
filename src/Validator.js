function isInt(value) {
  if (typeof value !== "number" || value !== ~~value) throw "EXPECT_INT";
}

function isInts(ary) {
  for (const value of ary) {
    isInt(value);
  }
}

function isPositive(value) {
  if (value <= 0) throw "EXPECT_POSITIVE";
}

function isNonNegative(value) {
  if (value < 0) throw "EXPECT_NON_NEGATIVE";
}

function isNonNegativeInts(ary) {
  for (const value of ary) {
    isInt(value);
    isNonNegative(value);
  }
}

function isPositiveInts(ary) {
  for (const value of ary) {
    isInt(value);
    isPositive(value);
  }
}

function isInRange(value, lowerBound, upperBound) {
  if (value < lowerBound || value > upperBound) throw `EXPECT_RANGE_FROM_${lowerBound}_TO_${upperBound}`;
}

module.exports = {
  isInt,
  isInts,
  isPositive,
  isNonNegative,
  isNonNegativeInts,
  isPositiveInts,
  isInRange
}