import { Algos, BIG_O, ChartData, GeneratorData, Metadata } from "@/app/types";

export const cycleSortMetadata: Metadata = {
  algo: Algos.CYCLE_SORT,
  time: BIG_O.SQUARED,
  space: BIG_O.CONSTANT,
  description: [
    "Cycle sort is an in-place, unstable sorting algorithm that is particularly useful when sorting arrays containing elements with a small range of values.",
    "Basic idea is that we loop through the array and don't move on until the correct item is at the current location",
  ],
};

/**
 *
 * Cycle sort is an in-place, unstable sorting algorithm that is particularly useful when sorting arrays containing elements with a small range of values.
 * Basic idea is that we loop through the array and don't move on until the correct item is at the current location
 */
export function* cycleSortGenerator(
  chartData: ChartData[]
): Generator<GeneratorData, GeneratorData, unknown> {
  const data = [...chartData];
  const sortedIndicies = new Set<number>([]);
  const length = data.length;

  // Run cycles on every element
  for (let cycleStart = 0; cycleStart < length; cycleStart++) {
    let ranOnce = false;
    let cycleEndIdx = cycleStart;

    // Rotate rest of the cycle until everything is in place
    while (cycleEndIdx !== cycleStart || !ranOnce) {
      ranOnce = true;
      let cycleStartValue = data[cycleStart];
      cycleEndIdx = cycleStart;

      // show cycle
      yield {
        value: data.map((val, idx) => {
          // show cycle
          if (sortedIndicies.has(idx)) {
            return { ...val, fill: "green" };
          }
          if (idx >= cycleStart && idx <= cycleEndIdx) {
            return { ...val, fill: "blue" };
          }
          return val;
        }),
        description: `Unsure if ${data[cycleStart].value} is in correct place. Starting new cycle on ${cycleStartValue.value}.`,
      };

      // Find position where we put the element
      for (let i = cycleStart + 1; i < length; i++) {
        // show comparasions
        yield {
          value: data.map((val, idx) => {
            if (sortedIndicies.has(idx)) {
              return { ...val, fill: "green" };
            }
            if (idx === cycleStart || idx == i) {
              return { ...val, fill: "red" };
            }
            // show cycle
            if (idx >= cycleStart && idx <= cycleEndIdx) {
              return { ...val, fill: "blue" };
            }
            return val;
          }),
          description: `Checking if ${data[i].value} < ${cycleStartValue.value}.`,
        };
        if (data[i].value < cycleStartValue.value) {
          cycleEndIdx += 1;
          // show comparasions
          yield {
            value: data.map((val, idx) => {
              if (sortedIndicies.has(idx)) {
                return { ...val, fill: "green" };
              }
              if (idx === cycleStart || idx == i) {
                return { ...val, fill: "red" };
              }
              // show cycle
              if (idx >= cycleStart && idx <= cycleEndIdx) {
                return { ...val, fill: "blue" };
              }
              return val;
            }),
            description: `Yes, ${data[i].value} < ${cycleStartValue.value}. Increasing cycle length by 1`,
          };
        }
      }

      // ignore all duplicate elements
      while (
        cycleStartValue.value == data[cycleEndIdx].value &&
        cycleStart !== cycleEndIdx
      ) {
        // show dupe
        yield {
          value: data.map((val, idx) => {
            if (sortedIndicies.has(idx)) {
              return { ...val, fill: "green" };
            }
            if (idx === cycleStart || idx === cycleEndIdx) {
              return { ...val, fill: "red" };
            }
            // show cycle
            if (idx >= cycleStart && idx <= cycleEndIdx) {
              return { ...val, fill: "blue" };
            }
            return val;
          }),
          description: `Ignoring duplicates. Increasing cycle length by 1`,
        };
        cycleEndIdx += 1;
        // show increase
        yield {
          value: data.map((val, idx) => {
            if (sortedIndicies.has(idx)) {
              return { ...val, fill: "green" };
            }
            if (idx === cycleStart || idx === cycleEndIdx) {
              return { ...val, fill: "red" };
            }
            // show cycle
            if (idx >= cycleStart && idx <= cycleEndIdx) {
              return { ...val, fill: "blue" };
            }
            return val;
          }),
          description: `Ignoring duplicates. Increasing cycle length by 1`,
        };
      }

      // swap cycle start item to it's right index
      if (cycleStartValue.value != data[cycleEndIdx].value) {
        data[cycleStart] = data[cycleEndIdx];
        data[cycleEndIdx] = cycleStartValue;
        cycleStartValue = data[cycleStart];
        // show swap
        yield {
          value: data.map((val, idx) => {
            if (sortedIndicies.has(idx)) {
              return { ...val, fill: "green" };
            }
            if (idx === cycleEndIdx || idx === cycleStart) {
              return { ...val, fill: "red" };
            }
            // show cycle
            if (idx >= cycleStart && idx <= cycleEndIdx) {
              return { ...val, fill: "blue" };
            }
            return val;
          }),
          description: `Swapping ${data[cycleStart].value} and ${data[cycleEndIdx].value}. ${data[cycleEndIdx].value} is now in correct position`,
        };
      }
    }
    sortedIndicies.add(cycleStart);
  }

  return { value: data };
}
