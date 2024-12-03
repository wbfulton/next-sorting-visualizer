"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useEffect, useMemo, useState } from "react";
import { bubbleSortGenerator } from "../algos/bubbleSort";
import { ChartData, GeneratorData } from "../types";
import { createRandomArray } from "../utils";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import { ComboBoxItem, ComboBoxResponsive } from "./combobox-responsive";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--foreground))",
  },
  mobile: {
    label: "Desktop",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

const items: ComboBoxItem[] = [
  {
    value: "bubbleSort",
    label: "Bubble Sort",
  },
  {
    value: "bucketSort",
    label: "Bucket Sort",
  },
];

export const SortingChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [gen, setGen] =
    useState<Generator<GeneratorData, GeneratorData, unknown>>();
  const [stepExplainer, setStepExplainer] = useState<string>("");

  const createNewArray = useMemo(() => {
    return () => {
      const randArr = createRandomArray(15, 20);
      setGen(bubbleSortGenerator(randArr));
      setData(randArr);
    };
  }, []);

  useEffect(() => {
    createNewArray();
  }, []);

  return (
    <Card className="sm:w-2/3 md:w-1/2">
      <CardHeader className="flex flex-col">
        <CardTitle className="mb-2">Sorting Visualizer</CardTitle>
        <CardDescription>
          <ComboBoxResponsive items={items} defaultText="Select Algo..." />
        </CardDescription>
        <CardDescription>
          Time: O(N^2) worst case, O(N) best case
        </CardDescription>
        <CardDescription>Space: O(1)</CardDescription>
        <div className="flex items-center gap-2 justify-between mb-2">
          <CardDescription className="basis-2/4">
            {stepExplainer}
          </CardDescription>
          <div className="basis-2/4 flex items-center gap-2 justify-end">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                if (!gen) return;
                const nextVal = gen.next().value;
                if (nextVal !== undefined) {
                  setData(nextVal.value);
                  setStepExplainer(nextVal?.description ?? "");
                }
              }}
            >
              Next Step
            </Button>
            <Button size={"sm"} variant={"outline"} onClick={createNewArray}>
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="value"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Bubble Sort is the simplest sorting algorithm that works by repeatedly
          swapping the adjacent elements if they are in the wrong order.
        </div>
        <div className="leading-none text-muted-foreground">
          This algorithm is not suitable for large data sets as its average and
          worst-case time complexity are quite high.
        </div>
      </CardFooter>
    </Card>
  );
};
