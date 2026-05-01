"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {TrendingUp} from "lucide-react";
import { Separator } from "../ui/separator";
import { SiRadar } from "react-icons/si";

type ReportChartProps = {
  data: {
    technicalScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    confidenceScore: number;
    behavioralScore: number;
  };
}

export function ReportRadarChart({data}: ReportChartProps) {
  const chartData = [
    {subject: "Technical", A: data.technicalScore, fullMark: 10},
    {subject: "Problem Solving", A: data.problemSolvingScore, fullMark: 10},
    {subject: "Communication", A: data.communicationScore, fullMark: 10},
    {subject: "Confidence", A: data.confidenceScore, fullMark: 10},
    {subject: "Behavioral", A: data.behavioralScore, fullMark: 10},
  ];

  return (
    <Card className="p-0 gap-0 flex flex-col border-muted overflow-hidden rounded-lg h-full">
      <CardHeader className="p-2.5 bg-muted">
        <CardTitle className="text-xl flex items-center gap-2">
          <SiRadar className="h-4 w-4 text-primary" /> Competency Radar
        </CardTitle>
        <CardDescription>Performance distribution of your skills.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-2.5 flex-1 overflow-y-auto min-h-0 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{fill: "#64748b", fontSize: 12, fontWeight: 500}}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "var(--popover-foreground)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
