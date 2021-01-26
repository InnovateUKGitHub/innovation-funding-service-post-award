export function diffAsPounds<T extends number>(startingValue: T, secondValue: T) {
  return startingValue - secondValue;
}

export function diffAsPercentage<T extends number>(startingValue: T, secondValue: T) {
  return (100 * diffAsPounds(startingValue, secondValue)) / startingValue;
}
