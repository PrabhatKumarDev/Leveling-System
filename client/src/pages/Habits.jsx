import React, { useEffect, useMemo, useState } from "react";
import { Target, Flame, Check, Plus, Trash2, Coins, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useHabitStore } from "../store/habitStore";
import HabitHeatmap from "../components/HabitHeatmap";

const habitColors = [
  { label: "Violet", value: "violet" },
  { label: "Emerald", value: "emerald" },
  { label: "Rose", value: "rose" },
  { label: "Cyan", value: "cyan" },
  { label: "Amber", value: "amber" },
];

const colorMap = {
  violet: {
    soft: "bg-violet-500/10 border-violet-500/20",
    heat0: "bg-white/5",
    heat1: "bg-violet-500/30",
    heat2: "bg-violet-500/55",
    heat3: "bg-violet-500/80",
  },
  emerald: {
    soft: "bg-emerald-500/10 border-emerald-500/20",
    heat0: "bg-white/5",
    heat1: "bg-emerald-500/30",
    heat2: "bg-emerald-500/55",
    heat3: "bg-emerald-500/80",
  },
  rose: {
    soft: "bg-rose-500/10 border-rose-500/20",
    heat0: "bg-white/5",
    heat1: "bg-rose-500/30",
    heat2: "bg-rose-500/55",
    heat3: "bg-rose-500/80",
  },
  cyan: {
    soft: "bg-cyan-500/10 border-cyan-500/20",
    heat0: "bg-white/5",
    heat1: "bg-cyan-500/30",
    heat2: "bg-cyan-500/55",
    heat3: "bg-cyan-500/80",
  },
  amber: {
    soft: "bg-amber-500/10 border-amber-500/20",
    heat0: "bg-white/5",
    heat1: "bg-amber-500/30",
    heat2: "bg-amber-500/55",
    heat3: "bg-amber-500/80",
  },
};
const statOptions = [
  { label: "Strength", value: "STR" },
  { label: "Vitality", value: "VIT" },
  { label: "Intellect", value: "INT" },
  { label: "Focus", value: "FOC" },
  { label: "Discipline", value: "DIS" },
  { label: "Consistency", value: "CON" },
];

const SummaryCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 min-w-0">
    <div className="shrink-0">{icon}</div>
    <div className="min-w-0">
      <h2 className="text-lg font-bold text-white">{value}</h2>
      <p className="text-xs sm:text-sm text-zinc-400">{label}</p>
    </div>
  </div>
);



const CreateHabitModal = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    color: "violet",
    primaryStat: "STR",
  });

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onCreate(form);

    setForm({
  title: "",
  description: "",
  color: "violet",
  primaryStat: "DIS",
});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0f17] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Habit</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
         <input
  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
  placeholder="Habit name"
  value={form.title}
  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
  required
/>

<textarea
  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
  placeholder="Description"
  value={form.description}
  onChange={(e) =>
    setForm((p) => ({ ...p, description: e.target.value }))
  }
/>

<select
  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
  value={form.primaryStat}
  onChange={(e) =>
    setForm((p) => ({ ...p, primaryStat: e.target.value }))
  }
>
  {statOptions.map((stat) => (
    <option key={stat.value} value={stat.value} className="bg-[#0b0f17] text-white">
      {stat.label}
    </option>
  ))}
</select>

          <div>
            <p className="mb-2 text-sm text-zinc-300">Heatmap Color</p>
            <div className="flex flex-wrap gap-2">
              {habitColors.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    form.color === c.value
                      ? "border-white text-white"
                      : "border-white/10 text-zinc-400"
                  } ${colorMap[c.value].soft}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white">
            Create Habit
          </button>
        </form>
      </div>
    </div>
  );
};

const Habits = () => {
  const { habits, loading, fetchHabits, addHabit, markHabitDone, removeHabit } =
    useHabitStore();

  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHabits().catch((error) => {
      toast.error(error?.response?.data?.message || "Failed to load habits");
    });
  }, [fetchHabits]);

  useEffect(() => {
    if (!selectedHabitId && habits.length) {
      setSelectedHabitId(habits[0]._id);
    }
  }, [habits, selectedHabitId]);

  const selectedHabit =
    habits.find((habit) => habit._id === selectedHabitId) || habits[0];

  const summary = useMemo(() => {
    const activeHabits = habits.length;
    const longestStreak = Math.max(
      ...habits.map((h) => h.longestStreak || 0),
      0,
    );

    const today = new Date().toISOString().slice(0, 10);
    const completedToday = habits.filter(
      (h) => h.lastCompletedDate === today,
    ).length;

    return { activeHabits, longestStreak, completedToday };
  }, [habits]);

  const handleCreateHabit = async (habitData) => {
    try {
      const created = await addHabit(habitData);

      if (created?._id) {
        setSelectedHabitId(created._id);
      }

      setShowModal(false);
      toast.success("Habit created");
      return created;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create habit");
      throw error;
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await removeHabit(id);
      toast.success("Habit deleted");

      const remaining = habits.filter((h) => h._id !== id);
      setSelectedHabitId(remaining[0]?._id || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete habit");
    }
  };

  const handleCompleteHabit = async (id) => {
    try {
      const data = await markHabitDone(id);
      toast.success(data.message || "Habit completed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to complete habit");
    }
  };

  const habitHeatmap =
    selectedHabit?.heatmap ||
    (selectedHabit?.lastCompletedDate
      ? { [selectedHabit.lastCompletedDate]: 1 }
      : {});

  const today = new Date().toISOString().slice(0, 10);
  const completedToday = selectedHabit?.lastCompletedDate === today;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          <span className="text-primary">Habits </span> Tracker
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Build powerful habits and earn rewards for consistency
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard
          icon={<Target className="text-primary h-5 w-5" />}
          value={summary.activeHabits}
          label="Active Habits"
        />
        <SummaryCard
          icon={<Flame className="text-orange-400 h-5 w-5" />}
          value={summary.longestStreak}
          label="Longest Active Streak"
        />
        <SummaryCard
          icon={<Check className="text-emerald-400 h-5 w-5" />}
          value={summary.completedToday}
          label="Completed Today"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Your Habits</h2>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-zinc-400">Loading habits...</div>
          ) : habits.length ? (
            <div className="space-y-2">
              {habits.map((habit) => {
                const active = habit._id === selectedHabit?._id;
                const theme =
                  colorMap[habit.color || "violet"] || colorMap.violet;
                const doneToday = habit.lastCompletedDate === today;

                return (
                  <button
                    key={habit._id}
                    onClick={() => setSelectedHabitId(habit._id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      active
                        ? `${theme.soft} border-white/20`
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {habit.title}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          Streak: {habit.streak || 0}
                        </p>
                      </div>

                      {doneToday && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300">
                          Today Done
                        </span>
                      )}
                      <button
  onClick={(e) => {
    e.stopPropagation(); // 🔥 VERY IMPORTANT
    handleCompleteHabit(habit._id);
  }}
  disabled={doneToday}
  className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-all duration-200 ${
  doneToday
    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 scale-95"
    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-primary hover:text-white hover:scale-110"
}`}
>
  <Check className="h-4 w-4" />
</button>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-zinc-400">No habits yet.</div>
          )}
        </div>

        <div className="space-y-4">
          {selectedHabit ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-white break-words">
                      {selectedHabit.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {selectedHabit.description || "No description"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteHabit(selectedHabit._id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-zinc-400">Current Streak</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {selectedHabit.streak || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-zinc-400">Longest Streak</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {selectedHabit.longestStreak || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-zinc-400">Total Completion</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {selectedHabit.totalCompletions || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-zinc-400">Rewards</p>
                    <p className="mt-1 flex items-center gap-3 text-sm font-medium text-white flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-violet-300" />
                        {selectedHabit.xpReward} XP
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Coins className="h-4 w-4 text-amber-300" />
                        {selectedHabit.goldReward}
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-zinc-400">
                      Difficulty: {selectedHabit.difficulty}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    disabled={completedToday}
                    onClick={() => handleCompleteHabit(selectedHabit._id)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      completedToday
                        ? "cursor-not-allowed bg-white/10 text-zinc-500"
                        : "bg-primary text-white"
                    }`}
                  >
                    {completedToday
                      ? "Already completed today"
                      : `Complete Habit (+${selectedHabit.xpReward} XP / +${selectedHabit.goldReward} Gold)`}
                  </button>
                </div>
              </div>

              <HabitHeatmap
  color={selectedHabit.color || "violet"}
  data={habitHeatmap}
/>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">
              No habit selected.
            </div>
          )}
        </div>
      </div>

      <CreateHabitModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateHabit}
      />
    </div>
  );
};

export default Habits;
