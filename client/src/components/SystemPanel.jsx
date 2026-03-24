import React from "react";
import {
  TriangleAlert,
  Gift,
  Flame,
  ScrollText,
  ShieldAlert,
  Lock,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const SystemPanel = ({
  system = {},
  todayQuests = [],
  completedQuestsCount = 0,
}) => {
  const user = useAuthStore((state) => state.user);
  const progression = useAuthStore((state) => state.progression);

  const dailyLoginStreak = system?.dailyLoginStreak || user?.dailyLoginStreak || 0;
  const totalXp = progression?.totalXp || system?.totalXp || 0;

  const totalTasks =
    system?.questsSummary?.total ?? todayQuests.length ?? 0;

  const completedTasks =
    system?.questsSummary?.completed ?? completedQuestsCount ?? 0;

  const remainingTasks =
    system?.questsSummary?.remaining ??
    Math.max(totalTasks - completedTasks, 0);

  const progressPercent =
    totalTasks > 0 ? Math.min((completedTasks / totalTasks) * 100, 100) : 0;

  const nextGateUnlockXp = system?.nextGate?.unlockXp || 500;
  const nextGateName = system?.nextGate?.name || "C-Rank Gate";

  const gifts = system?.gifts || ["No gifts available right now"];
  const warnings =
    system?.warnings ||
    (remainingTasks > 0
      ? ["Your daily quests are not completed yet"]
      : ["No system warnings"]);

  const xpToNextGate = Math.max(nextGateUnlockXp - totalXp, 0);

  return (
    <section className="w-full min-w-0 system-border rounded-2xl bg-white/5 p-3 sm:p-4 lg:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
          <Sparkles className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">SYSTEM</h2>
          <p className="text-sm text-zinc-400">
            Real-time hunter support overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <p className="text-sm font-semibold text-white">Daily Login Streak</p>
          </div>
          <p className="text-2xl font-bold text-white">{dailyLoginStreak}</p>
          <p className="mt-1 text-sm text-zinc-400">Keep logging in to maintain your streak.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-semibold text-white">Quest Progress</p>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
            <span>
              {completedTasks}/{totalTasks} completed
            </span>
            <span>{remainingTasks} remaining</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-zinc-400">
            Finish all daily quests to maximize rewards.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">System Gifts</p>
          </div>

          <div className="space-y-2">
            {gifts.map((gift, index) => (
              <div
                key={index}
                className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-sm text-zinc-300"
              >
                {gift}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <p className="text-sm font-semibold text-white">System Warnings</p>
          </div>

          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="rounded-xl border border-red-500/10 bg-red-500/5 px-3 py-2 text-sm text-zinc-300"
              >
                {warning}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-yellow-300" />
            <p className="text-sm font-semibold text-white">Remaining Tasks</p>
          </div>
          <p className="text-2xl font-bold text-white">{remainingTasks}</p>
          <p className="mt-1 text-sm text-zinc-400">
            Daily quests still pending completion.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyan-300" />
            <p className="text-sm font-semibold text-white">Next Gate Unlock</p>
          </div>
          <p className="text-lg font-bold text-white">{nextGateName}</p>
          <p className="mt-1 text-sm text-zinc-400">
            Unlocks at {nextGateUnlockXp} XP
          </p>
          <p className="mt-2 text-sm text-cyan-300">
            {xpToNextGate > 0
              ? `${xpToNextGate} XP remaining`
              : "Gate unlocked"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Total EXP</p>
          <p className="text-xl font-bold text-primary">{totalXp}</p>
        </div>
      </div>
    </section>
  );
};

export default SystemPanel;