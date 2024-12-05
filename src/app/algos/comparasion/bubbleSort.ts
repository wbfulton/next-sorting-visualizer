import { Algos, BIG_O, ChartData, GeneratorData, Metadata } from "@/app/types";

export const bubbleSortMetadata: Metadata = {
  algo: Algos.BUBBLE_SORT,
  time: BIG_O.SQUARED,
  space: BIG_O.CONSTANT,
  description: [
    "Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order.",
    "This algorithm is not suitable for large data sets as its average and worst-case time complexity are quite high.",
  ],
  link: "https://www.geeksforgeeks.org/bubble-sort-algorithm/",
};

/**
 * Bubble Sort repeatedly swaps adjacent elements if they are in wrong order.
 * This is accomplished through multiple passes, where the largest unsorted value
 * goes into the proper place.
 *
 * This function wil return a new array
 * @time O(N^2) worst case, O(N) best case
 */
export function* bubbleSortGenerator(
  data: ChartData[]
): Generator<GeneratorData, GeneratorData, unknown> {
  const arr = [...data];
  const sortedIndicies = new Set<number>([]);

  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;

    for (let j = 0; j < arr.length - i - 1; j++) {
      // show compare
      yield {
        value: arr.map((val, idx) => {
          if (sortedIndicies.has(idx)) {
            return { ...val, fill: "green" };
          }
          if (idx === j || idx === j + 1) {
            return { ...val, fill: "red" };
          }
          return val;
        }),
        description: `Checking if ${arr[j].value} < ${arr[j + 1].value}`,
      };
      if (arr[j].value > arr[j + 1].value) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
        // show swap
        yield {
          value: arr.map((val, idx) => {
            if (sortedIndicies.has(idx)) {
              return { ...val, fill: "green" };
            }
            if (idx === j || idx === j + 1) {
              return { ...val, fill: "red" };
            }

            return val;
          }),
          description: `Yes, ${arr[j].value} < ${arr[j + 1].value}. Swapping ${arr[j].value} and ${arr[j + 1].value}`,
        };
      }
    }

    sortedIndicies.add(arr.length - 1 - i);
    if (swapped === false) {
      break;
    }
  }

  return {
    value: arr.map((val) => {
      return { ...val, fill: "green" };
    }),
  };
}
