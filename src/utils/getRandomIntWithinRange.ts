/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function getRandomIntWithinRange(min: number, max: number, randomNumberGenerator = Math.random) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(randomNumberGenerator() * (max - min + 1)) + min;
}
