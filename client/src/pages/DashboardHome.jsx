import React from "react";
import { useAuthStore } from "../store/authStore";
import StatsRadarChart from "../components/StatsRadarChart";
import SystemPanel from "../components/SystemPanel";
import {
  Dumbbell,
  Heart,
  Lightbulb,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";

const statLabels = {
  STR: "STR",
  VIT: "VIT",
  INT: "INT",
  FOC: "FOC",
  DIS: "DIS",
  CON: "CON",
};

const statIcons = {
  STR: <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-primary text-red-400" />,
  VIT: <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary text-rose-400" />,
  INT: (
    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary text-yellow-300" />
  ),
  FOC: <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary text-cyan-400" />,
  DIS: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary text-violet-400" />,
  CON: (
    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary text-emerald-400" />
  ),
};

const defaultStats = {
  STR: { level: 1, xp: 0 },
  VIT: { level: 1, xp: 0 },
  INT: { level: 1, xp: 0 },
  FOC: { level: 1, xp: 0 },
  DIS: { level: 1, xp: 0 },
  CON: { level: 1, xp: 0 },
};

const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const progression = useAuthStore((state) => state.progression);
  const loading = useAuthStore((state) => state.loading);

  const hunterName = user?.hunterName || "Shadow";
  const jobName = user?.job?.name || "No Job";
  const titleName = user?.title?.name || user?.title || "No Title";
  const level = progression?.level || 1;

  const totalXp = progression?.totalXp || 0;
  const xpIntoLevel = progression?.xpIntoLevel || 0;
  const xpNeededForNextLevel = progression?.xpNeededForNextLevel || 0;
  const levelTitle = progression?.levelTitle || "The Awakening";
  const rank = progression?.rank || "E-Rank Hunter";

  const xpPercent =
    xpNeededForNextLevel > 0
      ? Math.min((xpIntoLevel / xpNeededForNextLevel) * 100, 100)
      : 100;

  const stats = {
    ...defaultStats,
    ...(user?.stats || {}),
  };

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading hunter status...</div>;
  }

  if (!user) {
    return <div className="p-6 text-zinc-400">No hunter data found.</div>;
  }
  console.log(user);
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          Welcome back, <span className="text-primary">{hunterName}</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Continue your journey to become the Strongest Hunter.
        </p>
      </section>
      <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-5">
        <div className="flex-1 min-w-[280px]">
          <section className="flex-4 min-w-0 system-border rounded-2xl p-3 sm:p-4 lg:p-6 bg-white/5">
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-wide">
                  STATUS
                </h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex flex-col items-center justify-center rounded-2xl px-4 sm:px-5 lg:px-6 py-3 sm:py-4 lg:py-5 min-w-[110px] sm:min-w-[125px] lg:min-w-[140px]">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {level}
                  </span>
                  <span className="mt-1 text-[10px] sm:text-xs lg:text-sm tracking-[0.18em] text-zinc-400">
                    LEVEL
                  </span>
                </div>

                <div className="flex-1 grid gap-3">
                  <div className="rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-zinc-400">
                      Job
                    </p>
                    <p className="mt-1 text-sm sm:text-base lg:text-lg font-semibold text-white break-words">
                      {jobName}
                    </p>
                  </div>

                  <div className="rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-zinc-400">
                      Title
                    </p>
                    <p className="mt-1 text-sm sm:text-base lg:text-lg font-semibold text-white break-words">
                      {titleName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 lg:p-5 mb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-white break-words">
                      Rank
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      {rank}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-zinc-400">
                      Current Arc
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      {levelTitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 text-[11px] sm:text-xs lg:text-sm text-zinc-400">
                  <span>XP Progress</span>
                  <span>
                    {xpIntoLevel}/{xpNeededForNextLevel || xpIntoLevel}
                  </span>
                </div>

                <div className="mt-2 h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Total XP: {totalXp}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
                {Object.entries(stats).map(([statKey, statValue]) => {
                  const level = statValue?.level ?? 1;
  const xp = statValue?.xp ?? 0;
                  const neededXp = 4;

                  return (
                    <div
                      key={statKey}
                      className="rounded-2xl px-3 sm:px-4 py-3 sm:py-4 border border-white/10 bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          {statIcons[statKey] || <span className="w-5 h-5" />}
                          <div className="flex flex-col">
                            <span className="text-[11px] sm:text-xs lg:text-sm text-zinc-400 truncate">
                              {statLabels[statKey] || statKey}
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-white">
                          {statValue?.level ?? 1}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
        <span>XP</span>
        <span>{xp}/{neededXp}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: `${(xp / neededXp) * 100}%`,
          }}
        />
      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
        <div className="flex-1 min-w-[280px]">
          <StatsRadarChart />
        </div>
      </div>
      <div className="w-full">
        <SystemPanel
          system={{
            dailyLoginStreak: 4,
            gifts: ["Daily reward available"],
            warnings: ["Your daily quests are not completed yet"],
            nextGate: {
              name: "C-Rank Gate",
              unlockXp: 500,
            },
            questsSummary: {
              total: 5,
              completed: 2,
              remaining: 3,
            },
          }}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
