export enum Algos {
  BUBBLE_SORT = "bubbleSort",
  CYCLE_SORT = "cycleSort",
  SELECTION_SORT = "selectionSort",
  HEAP_SORT = "heapSort",
}

export enum BIG_O {
  SQUARED = "O(N^2)",
  LINEAR = "O(N)",
  CONSTANT = "O(1)",
  LOG = "O( log(N) )",
  N_LOG = "O( N * log(N) )",
}

export interface Metadata {
  algo: Algos;
  time: BIG_O;
  space: BIG_O;
  description: string[];
  link?: string;
}

export interface ChartData {
  label: string;
  value: number;
  fill?: string;
}

export interface GeneratorData {
  value: ChartData[];
  description?: string;
}

export interface AlgoInfo {
  generatorFunction: (
    chartData: ChartData[]
  ) => Generator<GeneratorData, GeneratorData, unknown>;
  metadata: Metadata;
}
