import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "../store/authStore";

const defaultStats = {
  STR: { level: 1, xp: 0 },
  VIT: { level: 1, xp: 0 },
  INT: { level: 1, xp: 0 },
  FOC: { level: 1, xp: 0 },
  DIS: { level: 1, xp: 0 },
  CON: { level: 1, xp: 0 },
};

const StatsRadarChart = () => {
  const user = useAuthStore((state) => state.user);

  const stats = {
    ...defaultStats,
    ...(user?.stats || {}),
  };

  const chartData = [
    { stat: "STR", fullName: "Strength", value: stats.STR?.level || 1 },
    { stat: "VIT", fullName: "Vitality", value: stats.VIT?.level || 1 },
    { stat: "INT", fullName: "Intellect", value: stats.INT?.level || 1 },
    { stat: "FOC", fullName: "Focus", value: stats.FOC?.level || 1 },
    { stat: "DIS", fullName: "Discipline", value: stats.DIS?.level || 1 },
    { stat: "CON", fullName: "Consistency", value: stats.CON?.level || 1 },
  ];

  const maxStat = Math.max(...chartData.map((item) => item.value), 5);

  return (
    <div className="w-full min-w-0 system-border rounded-2xl bg-white/5 p-3 sm:p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Hunter Stats Radar
        </h2>
        <p className="text-sm text-zinc-400">
          Real-time attribute growth based on your habits and quests.
        </p>
      </div>
     <div className="flex items-center justify-center">
  <div className="w-full h-[220px] sm:h-[430px] lg:h-[450px] relative">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData}>
        <PolarGrid stroke="rgba(255,255,255,0.12)" />
        <PolarAngleAxis
          dataKey="stat"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxStat]}
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
</div>
      

      {/* <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {chartData.map((item) => (
          <div
            key={item.stat}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <p className="text-xs text-zinc-400">{item.fullName}</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {item.stat}: {item.value}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default StatsRadarChart;