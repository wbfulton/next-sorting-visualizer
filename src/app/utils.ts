import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  bubbleSortGenerator,
  bubbleSortMetadata,
} from "./algos/comparasion/bubbleSort";
import {
  cycleSortGenerator,
  cycleSortMetadata,
} from "./algos/comparasion/cycleSort";
import {
  selectionSortGenerator,
  selectionSortMetadata,
} from "./algos/comparasion/selectionSort";
import { AlgoInfo, Algos, ChartData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

export function createRandomArray(length: number, max: number) {
  const arr: ChartData[] = [];
  for (let i = 0; i < length; i++) {
    const int = getRandomInt(max);
    arr.push({ label: `${int}`, value: int });
  }
  return arr;
}

const info: Array<[Algos, AlgoInfo]> = [
  [
    Algos.BUBBLE_SORT,
    {
      generatorFunction: bubbleSortGenerator,
      metadata: bubbleSortMetadata,
    },
  ],
  [
    Algos.CYCLE_SORT,
    {
      generatorFunction: cycleSortGenerator,
      metadata: cycleSortMetadata,
    },
  ],
  [
    Algos.SELECTION_SORT,
    {
      generatorFunction: selectionSortGenerator,
      metadata: selectionSortMetadata,
    },
  ],
];

export const algorithmInfo = new Map<Algos, AlgoInfo>(info);
