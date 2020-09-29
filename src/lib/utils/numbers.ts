/**
 * Given a number, this function will return an array of numbers
 * starting at 0 and ending at count - 1
 * @param count the number items to include in the array
 */
export const range = (count: number): ReadonlyArray<number> => {
  return [...Array<number>(count).keys()];
};
