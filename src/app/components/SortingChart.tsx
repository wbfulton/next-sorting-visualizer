"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useEffect, useMemo, useRef, useState } from "react";
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
  {
    label: "Heap Sort",
    value: Algos.HEAP_SORT,
  },
];

export const SortingChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const prevData = useRef<GeneratorData[]>([]);
  const prevDataAux = useRef<GeneratorData[]>([]);
  const wasLastDirectionForward = useRef<boolean>(true);

  const [stepExplainer, setStepExplainer] = useState<string>("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const [gen, setGen] =
    useState<Generator<GeneratorData, GeneratorData, unknown>>();
  const [info, setInfo] = useState<AlgoInfo | undefined>();

  const createNewArray = useMemo(() => {
    return () => {
      const randArr = createRandomArray(15, 20);
      setGen(info?.generatorFunction(randArr));
      setData(randArr);

      prevData.current = [{ value: randArr }];
      prevDataAux.current = [];

      if (stepExplainer) {
        setStepExplainer("");
      }
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, [info]);

  useEffect(() => {
    createNewArray();
  }, [info]);

  // init to bubble sort
  useEffect(() => {
    setInfo(algorithmInfo.get(Algos.BUBBLE_SORT));
  }, []);

  return (
    <Card className="sm:w-2/3 md:w-1/2 min-w-min">
      <CardHeader className="flex flex-col">
        <CardTitle className="mb-2">Sorting Visualizer</CardTitle>
        <div className="flex items-center gap-2 justify-start mb-2">
          <CardDescription>
            <ComboBoxResponsive
              // default to bubble sort
              defaultSelectedItem={items.find(
                (item) => item.value === Algos.BUBBLE_SORT
              )}
              onSelectItem={(item) => {
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
          <CardDescription className="basis-2/4 h-10">
            {stepExplainer}
          </CardDescription>
          <div className="basis-2/4 flex items-center gap-2 justify-end">
            {/* Back Button */}
            <Button
              disabled={!data || !info || prevData.current?.length === 0}
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                if (prevData.current.length > 0) {
                  if (wasLastDirectionForward.current) {
                    const val = prevData.current.pop();
                    if (val) {
                      prevDataAux.current.push(val);
                    }
                  }

                  const val = prevData.current.pop();
                  if (val) {
                    prevDataAux.current.push(val);
                    setData(val.value);
                    setStepExplainer(val.description ?? "");
                  }
                }

                wasLastDirectionForward.current = false;
              }}
            >
              Back
            </Button>
            {/* Step Button */}
            <Button
              disabled={!data || !info}
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                if (!gen) return;

                if (prevDataAux.current.length > 0) {
                  if (!wasLastDirectionForward.current) {
                    const val = prevDataAux.current.pop();
                    if (val) {
                      prevData.current.push(val);
                    }
                  }
                  const val = prevDataAux.current.pop();
                  if (val) {
                    prevData.current.push(val);
                    setData(val.value);
                    setStepExplainer(val.description ?? "");
                  }
                } else {
                  const nextVal = gen.next().value;
                  if (nextVal !== undefined) {
                    prevData.current?.push(nextVal);
                    setData(nextVal.value);
                    setStepExplainer(nextVal?.description ?? "");
                    if (intervalId) {
                      setIntervalId(undefined);
                    }
                  }
                }

                wasLastDirectionForward.current = true;
              }}
            >
              Step
            </Button>
            {/* Auto Button */}
            <Button
              disabled={!data || !info}
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                if (!gen) return;

                if (intervalId) {
                  clearInterval(intervalId);
                  setIntervalId(undefined);
                } else {
                  const id = setInterval(() => {
                    if (prevDataAux.current.length > 0) {
                      if (!wasLastDirectionForward.current) {
                        const val = prevDataAux.current.pop();
                        if (val) {
                          prevData.current.push(val);
                        }
                      }

                      const val = prevDataAux.current.pop();
                      if (val) {
                        prevData.current.push(val);
                        setData(val.value);
                        setStepExplainer(val.description ?? "");
                      }
                    } else {
                      const nextVal = gen.next().value;
                      if (nextVal !== undefined) {
                        prevData.current?.push(nextVal);
                        setData(nextVal.value);
                        setStepExplainer(nextVal?.description ?? "");
                        if (intervalId) {
                          setIntervalId(undefined);
                        }
                      } else {
                        clearInterval(id);
                      }
                    }

                    wasLastDirectionForward.current = true;
                  }, 1000);

                  setIntervalId(id);
                }
              }}
            >
              {intervalId ? "Stop" : "Auto"}
            </Button>
            {/* Reset Button */}
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
