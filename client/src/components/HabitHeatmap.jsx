import React, { useMemo, useState } from "react";

const colorThemes = {
  violet: {
    empty: "bg-white/5",
    filled: "bg-violet-500/70",
  },
  emerald: {
    empty: "bg-white/5",
    filled: "bg-emerald-500/70",
  },
  rose: {
    empty: "bg-white/5",
    filled: "bg-rose-500/70",
  },
  cyan: {
    empty: "bg-white/5",
    filled: "bg-cyan-500/70",
  },
  amber: {
    empty: "bg-white/5",
    filled: "bg-amber-500/70",
  },
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getStartOfCalendar(year) {
  const firstDay = new Date(year, 0, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());
  return start;
}

function getEndOfCalendar(year) {
  const lastDay = new Date(year, 11, 31);
  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  return end;
}

const HabitHeatmap = ({ data = {}, color = "violet" }) => {
  const theme = colorThemes[color] || colorThemes.violet;
  const currentYear = new Date().getFullYear();

  const years = useMemo(() => {
    const yearsFromData = Object.keys(data)
      .map((date) => Number(date.slice(0, 4)))
      .filter(Boolean);

    const minYear = yearsFromData.length
      ? Math.min(...yearsFromData)
      : currentYear;

    const list = [];
    for (let y = currentYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [data, currentYear]);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { weeks, monthLabels } = useMemo(() => {
    const start = getStartOfCalendar(selectedYear);
    const end = getEndOfCalendar(selectedYear);

    const dates = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }

    const monthLabels = weeks.map((week) => {
      const first = week[0];
      return first.getDate() <= 7
        ? first.toLocaleString("en-US", { month: "short" })
        : "";
    });

    return { weeks, monthLabels };
  }, [selectedYear]);
const [hoveredTile, setHoveredTile] = useState(null);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Habit Heatmap</h3>
          <p className="text-xs text-zinc-400">
            One tile per day. Filled means completed.
          </p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-[#0b0f17] text-white">
              {year}
            </option>
          ))}
        </select>
      </div>


<div className="mb-3 min-h-[20px] text-xs text-zinc-400">
  {hoveredTile ? (
    <span>
      <span className="text-white font-medium">{hoveredTile.date}</span> •{" "}
      {hoveredTile.done ? "Completed" : "Not completed"}
    </span>
  ) : (
    <span>Hover or tap a tile to see the date</span>
  )}
</div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="mb-2 flex">
            <div className="w-10" />
            <div className="flex gap-1">
              {monthLabels.map((label, idx) => (
                <div key={idx} className="w-3 text-[10px] text-zinc-500">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {/* Day labels */}
            <div className="flex flex-col gap-1">
              {dayLabels.map((day) => (
                <div
                  key={day}
                  className="h-3 text-[10px] text-zinc-500 flex items-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date) => {
                    const key = formatDate(date);
                    const year = date.getFullYear();
                    const isInSelectedYear = year === selectedYear;
                    const done = !!data[key];

                    return (
                      <div
  key={key}
  onMouseEnter={() =>
    setHoveredTile({
      date: key,
      done,
    })
  }
  onMouseLeave={() => setHoveredTile(null)}
  onClick={() =>
    setHoveredTile({
      date: key,
      done,
    })
  }
  className={`h-3 w-3 rounded-[3px] border border-white/5 transition cursor-pointer ${
    isInSelectedYear
      ? done
        ? theme.filled
        : theme.empty
      : "bg-transparent border-transparent pointer-events-none"
  }`}
/>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-zinc-500">
            <span>Not done</span>
            <div className={`h-3 w-3 rounded-[3px] border border-white/5 ${theme.empty}`} />
            <div className={`h-3 w-3 rounded-[3px] border border-white/5 ${theme.filled}`} />
            <span>Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitHeatmap;