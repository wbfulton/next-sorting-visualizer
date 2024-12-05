import { Algos, BIG_O, ChartData, GeneratorData, Metadata } from "@/app/types";

export const heapSortMetadata: Metadata = {
  algo: Algos.HEAP_SORT,
  time: BIG_O.N_LOG,
  space: BIG_O.LOG,
  description: [
    "Heap Sort is a comparison-based sorting technique based on Binary Heap Data Structure. It can be seen as an optimization over selection sort where we first find the max (or min) element and swap it with the last (or first)",
    "We repeat the same process for the remaining elements. In Heap Sort, we use Binary Heap so that we can quickly find and move the max element in O(Log n) instead of O(n) and hence achieve the O(n Log n) time complexity.",
  ],
  link: "https://www.geeksforgeeks.org/heap-sort/",
};

// To heapify a subtree rooted with node i
// which is an index in arr[].
function heapify(
  arr: ChartData[],
  n: number,
  i: number,
  sortedIndicies: Set<number>
): Array<GeneratorData | undefined> {
  // Initialize largest as root
  let largest = i;

  // left child = 2*i + 1
  const l = 2 * i + 1;

  // right child = 2*i + 2
  const r = 2 * i + 2;

  // create heap
  const createHeap: GeneratorData = {
    value: arr.map((val, idx) => {
      if (sortedIndicies.has(idx)) {
        return { ...val, fill: "green" };
      }
      if (idx === i) {
        return { ...val, fill: "red" };
      }
      if (idx === l || idx == r) {
        return { ...val, fill: "blue" };
      }
      return val;
    }),
    description: `Creating heap from ${arr[i].value}. ${l < n ? `Left child is ${arr[l].value}. ` : ""} ${r < n ? `Right child is ${arr[r].value}.` : ""}`,
  };

  // check
  const checkHeap: GeneratorData = {
    value: arr.map((val, idx) => {
      if (sortedIndicies.has(idx)) {
        return { ...val, fill: "green" };
      }
      if (idx === i) {
        return { ...val, fill: "red" };
      }
      if (idx === l || idx == r) {
        return { ...val, fill: "blue" };
      }
      return val;
    }),
    description:
      l >= n && r >= n
        ? "No children"
        : `${l < n ? `Checking if root ${arr[largest].value} > ${arr[l].value}. ` : ""} ${r < n ? `Checking if root ${arr[largest].value} > ${arr[r].value}.` : ""}`,
  };

  // If left child is larger than root
  if (l < n && arr[l].value > arr[largest].value) {
    largest = l;
  }

  // If right child is larger than largest so far
  if (r < n && arr[r].value > arr[largest].value) {
    largest = r;
  }

  let swapHeap: GeneratorData | undefined;

  // If largest is not root
  if (largest !== i) {
    const temp = arr[i]; // Swap
    arr[i] = arr[largest];
    arr[largest] = temp;

    // swap
    swapHeap = {
      value: arr.map((val, idx) => {
        if (sortedIndicies.has(idx)) {
          return { ...val, fill: "green" };
        }
        if (idx === i || idx == largest) {
          return { ...val, fill: "red" };
        }
        return val;
      }),
      description: `Child ${arr[i].value} > ${arr[largest].value}. Swapping ${arr[i].value} and ${arr[largest].value} to build max heap`,
    };

    // Recursively heapify the affected sub-tree
    return [
      createHeap,
      checkHeap,
      swapHeap,
      ...heapify(arr, n, largest, sortedIndicies),
    ];
  }

  return [createHeap, checkHeap, swapHeap];
}

export function* heapSortGenerator(
  chartData: ChartData[]
): Generator<GeneratorData, GeneratorData, unknown> {
  const data = [...chartData];
  const sortedIndicies = new Set<number>([]);

  // Build a max heap binary tree
  // Remove top value from heap one by one. Reorganize heap on each iteration

  for (let i = Math.floor(data.length / 2) - 1; i >= 0; i--) {
    const heaps = heapify(data, data.length, i, sortedIndicies);

    for (let j = 0; j < heaps.length; j++) {
      const heap = heaps[j];
      if (heap !== undefined) {
        yield heap;
      }
    }
  }

  for (let i = data.length - 1; i > 0; i--) {
    // Move current root to end
    const temp = data[0];
    data[0] = data[i];
    data[i] = temp;

    // swap
    yield {
      value: data.map((val, idx) => {
        if (sortedIndicies.has(idx)) {
          return { ...val, fill: "green" };
        }
        // swap
        if (idx === i || idx === 0) {
          return { ...val, fill: "red" };
        }
        return val;
      }),
      description: `Move heap head (max value) ${data[i].value} to end of unsorted elements`,
    };

    sortedIndicies.add(i);

    // Call max heapify on the reduced heap
    const heaps = heapify(data, i, 0, sortedIndicies);

    for (let j = 0; j < heaps.length; j++) {
      const heap = heaps[j];
      if (heap !== undefined) {
        yield heap;
      }
    }
  }

  yield {
    value: data.map((val) => {
      return { ...val, fill: "green" };
    }),
  };

  return {
    value: data.map((val) => {
      return { ...val, fill: "green" };
    }),
  };
}
