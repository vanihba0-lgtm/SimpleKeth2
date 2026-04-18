"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { generatePriceTrends } from "@/lib/mock-data";

interface PriceChartProps {
  basePrice: number;
  height?: number;
}

export function PriceChart({ basePrice, height = 300 }: PriceChartProps) {
  const data = useMemo(() => generatePriceTrends(basePrice), [basePrice]);
  const todayIdx = data.findIndex((d) => !d.predicted);
  const todayDate =
    data.find((d, i) => i < data.length - 1 && data[i + 1]?.predicted)?.date || "";

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2F5D3A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2F5D3A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#C89B3C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD6CC" opacity={0.5} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6B6B6B" }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6B6B6B" }}
            tickFormatter={(v) => `₹${v}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #DDD6CC",
              fontSize: 13,
              backgroundColor: "#F7F4EF",
            }}
            formatter={(value: any, name: any) => [
              `₹${Number(value || 0).toLocaleString("en-IN")}`,
              name === "price" ? "Price/Quintal" : name,
            ]}
            labelFormatter={(label) => {
              const d = new Date(label);
              return d.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
            }}
          />
          {todayDate && (
            <ReferenceLine
              x={todayDate}
              stroke="#2F5D3A"
              strokeDasharray="4 4"
              label={{
                value: "Today",
                position: "top",
                fill: "#2F5D3A",
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2F5D3A"
            strokeWidth={2}
            fill="url(#colorActual)"
            dot={false}
            activeDot={{ r: 4, stroke: "#2F5D3A", strokeWidth: 2, fill: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
