export function getArraySymmetricDifference<T = unknown>(arrayA: T[], arrayB: T[]): T[] {
  return arrayA.filter((a) => !arrayB.includes(a)).concat(arrayB.filter((b) => !arrayA.includes(b)));
}
