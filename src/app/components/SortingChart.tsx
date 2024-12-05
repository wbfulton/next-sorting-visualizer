"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useEffect, useMemo, useState } from "react";
import { AlgoInfo, Algos, BIG_O, ChartData, GeneratorData } from "../types";
import { algorithmInfo, cn, createRandomArray } from "../utils";
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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import { ComboBoxItem, ComboBoxResponsive } from "./combobox-responsive";

const chartConfig: {
  [x: string]: { label?: string; color?: string };
} = {
  value: {
    label: "Not Sorted",
    color: "hsl(var(--foreground))",
  },
  sorted: {
    label: "Sorted",
    color: "green",
  },
  selected: {
    label: "Selected",
    color: "red",
  },
  tracked: {
    label: "Tracked",
    color: "blue",
  },
} satisfies ChartConfig;

const items: ComboBoxItem[] = [
  {
    label: "Bubble Sort",
    value: Algos.BUBBLE_SORT,
  },
  {
    label: "Cycle Sort",
    value: Algos.CYCLE_SORT,
  },
  {
    label: "Selection Sort",
    value: Algos.SELECTION_SORT,
  },
];

export const SortingChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [stepExplainer, setStepExplainer] = useState<string>("");

  const [gen, setGen] =
    useState<Generator<GeneratorData, GeneratorData, unknown>>();
  const [info, setInfo] = useState<AlgoInfo | undefined>();

  const createNewArray = useMemo(() => {
    return () => {
      const randArr = createRandomArray(15, 20);
      setGen(info?.generatorFunction(randArr));
      setData(randArr);
    };
  }, [info]);

  useEffect(() => {
    createNewArray();
  }, [info]);

  return (
    <Card className="sm:w-2/3 md:w-1/2 min-w-min">
      <CardHeader className="flex flex-col">
        <CardTitle className="mb-2">Sorting Visualizer</CardTitle>
        <div className="flex items-center gap-2 justify-start mb-2">
          <CardDescription>
            <ComboBoxResponsive
              onSelectItems={(item) => {
                if (item) {
                  setInfo(algorithmInfo.get(item.value as Algos));
                } else {
                  setInfo(undefined);
                }
              }}
              items={items}
              defaultText="Select Algo..."
            />
          </CardDescription>
          <div>
            <CardDescription>
              {info && (
                <>
                  <b>Time</b>:{" "}
                  {info?.metadata.time === BIG_O.SQUARED ? (
                    <span>
                      O(N<sup>2</sup>)
                    </span>
                  ) : (
                    info?.metadata.time
                  )}
                </>
              )}
            </CardDescription>
            <CardDescription>
              {info && (
                <>
                  <b>Space</b>: {info?.metadata.space}
                </>
              )}
            </CardDescription>
          </div>
        </div>
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
            <ChartLegend content={<CustomChartLegendContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {info?.metadata.description.map((text, i) => (
          <div
            key={`${i}-description`}
            className="flex gap-2 font-medium leading-none"
          >
            {text}
          </div>
        ))}

        <div className="leading-none text-muted-foreground">See more here</div>
      </CardFooter>
    </Card>
  );
};

const CustomChartLegendContent = () => {
  return (
    <div className={cn("flex items-center justify-center gap-4", "pt-3")}>
      {Object.keys(chartConfig).map((key) => {
        const item = chartConfig[key];
        return (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            )}
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: item.color,
              }}
            />
            {item?.label}
          </div>
        );
      })}
    </div>
  );
};
