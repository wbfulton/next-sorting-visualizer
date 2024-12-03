import { ChartData, GeneratorData } from "../types";

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

  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;

    for (let j = 0; j < arr.length - i - 1; j++) {
      // show compare
      yield {
        value: arr.map((val, idx) => {
          if (idx === j || idx === j + 1) {
            return { ...val, fill: "red" };
          }
          return val;
        }),
        description: `Check if ${arr[j].value} and ${arr[j + 1].value} is in order`,
      };
      if (arr[j].value > arr[j + 1].value) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
        // show swap
        yield {
          value: arr.map((val, idx) => {
            if (idx === j || idx === j + 1) {
              return { ...val, fill: "red" };
            }
            return val;
          }),
          description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`,
        };
      }
    }

    if (swapped === false) {
      break;
    }
  }

  return { value: arr };
}
