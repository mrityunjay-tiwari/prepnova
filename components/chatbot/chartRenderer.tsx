"use client";

import { Bar, Line } from "react-chartjs-2";
import type { ChartData } from "chart.js";

type ChartRendererProps = {
  data: ChartData<"line", number[], string>;
  type?: "bar" | "line";
};

export default function ChartRenderer({
  data,
  type = "line",
}: ChartRendererProps) {
  if (type === "line") {
    return <Line data={data} />;
  }
}
