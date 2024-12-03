import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartData } from "./types";

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
    arr.push({ label: `${int}`, value: int, fill: "white" });
  }
  return arr;
}
