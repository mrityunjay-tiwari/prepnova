"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {TrendingUp, Activity} from "lucide-react";

type ProgressData = {
  date: string;
  overall: number;
  technical: number;
  communication: number;
  confidence: number;
};

type ProgressChartsProps = {
  data: ProgressData[];
};

export function ProgressCharts({data}: ProgressChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-muted/40 rounded-3xl overflow-hidden shadow-sm bg-linear-to-br from-card to-muted/20">
        <CardHeader className="pb-2 border-b border-muted/20">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Overall Performance Trend
          </CardTitle>
          <CardDescription>
            Growth across all interview sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{fill: "#64748b", fontSize: 12}}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{fill: "#64748b", fontSize: 12}}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOverall)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-muted/40 rounded-3xl overflow-hidden shadow-sm bg-linear-to-br from-card to-muted/20">
        <CardHeader className="pb-2 border-b border-muted/20">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Skill Breakdown History
          </CardTitle>
          <CardDescription>
            Comparing technical, communication, and confidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{fill: "#64748b", fontSize: 12}}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{fill: "#64748b", fontSize: 12}}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="technical"
                stroke="#10b981"
                strokeWidth={2}
                dot={{r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff"}}
                activeDot={{r: 6}}
              />
              <Line
                type="monotone"
                dataKey="communication"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff"}}
                activeDot={{r: 6}}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff"}}
                activeDot={{r: 6}}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
