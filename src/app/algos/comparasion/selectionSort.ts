import { Algos, BIG_O, ChartData, GeneratorData, Metadata } from "@/app/types";

export const selectionSortMetadata: Metadata = {
  algo: Algos.SELECTION_SORT,
  time: BIG_O.SQUARED,
  space: BIG_O.CONSTANT,
  description: [
    "Selection sort sorts an array by repeatedly selecting the smallest (or largest) element from the unsorted portion and swapping it with the first unsorted element. This process continues until the entire array is sorted.",
  ],
  link: "https://www.geeksforgeeks.org/selection-sort-algorithm-2/",
};

export function* selectionSortGenerator(
  chartData: ChartData[]
): Generator<GeneratorData, GeneratorData, unknown> {
  const data = [...chartData];
  const sortedIndicies = new Set<number>([]);

  for (let i = 0; i < data.length + 1; i++) {
    let minIndex = i;

    // loop through and find next smallest element
    for (let j = i + 1; j < data.length; j++) {
      yield {
        value: data.map((val, idx) => {
          if (sortedIndicies.has(idx)) {
            return { ...val, fill: "green" };
          }
          if (idx === i || idx === j) {
            return { ...val, fill: "red" };
          }
          if (idx === minIndex) {
            return { ...val, fill: "blue" };
          }
          return val;
        }),
        description: `Checking if ${data[j].value} < ${data[minIndex].value}.`,
      };
      if (data[j].value < data[minIndex].value) {
        const oldMinIndex = minIndex;
        // update index
        minIndex = j;

        yield {
          value: data.map((val, idx) => {
            if (sortedIndicies.has(idx)) {
              return { ...val, fill: "green" };
            }
            if (idx === i) {
              return { ...val, fill: "red" };
            }
            if (idx === minIndex) {
              return { ...val, fill: "blue" };
            }
            return val;
          }),
          description: `Yes, ${data[j].value} < ${data[oldMinIndex].value}. Updating minimum element`,
        };
      }
    }

    if (minIndex !== i) {
      // swap minimum element to its
      // correct position
      const temp = data[i];
      data[i] = data[minIndex];
      data[minIndex] = temp;
      yield {
        value: data.map((val, idx) => {
          if (sortedIndicies.has(idx)) {
            return { ...val, fill: "green" };
          }
          if (idx === i || idx === minIndex) {
            return { ...val, fill: "red" };
          }
          return val;
        }),
        description: `Swapping ${data[minIndex].value} and ${data[i].value}. ${data[i].value} is now in correct position`,
      };
    }

    sortedIndicies.add(i);
  }

  return { value: data.map((val) => ({ ...val, fill: "green" })) };
}
