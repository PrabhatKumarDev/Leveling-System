import React, { useEffect, useMemo, useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";

const formatRemaining = (ms) => {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const ActiveRewardTimer = () => {
  const activeRewardTimer = useInventoryStore((state) => state.activeRewardTimer);
  const cleanupExpired = useInventoryStore((state) => state.cleanupExpired);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!activeRewardTimer?.endsAt) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRewardTimer]);

  const remaining = useMemo(() => {
    if (!activeRewardTimer?.endsAt) return 0;
    return new Date(activeRewardTimer.endsAt).getTime() - now;
  }, [activeRewardTimer, now]);

  useEffect(() => {
    if (activeRewardTimer?.endsAt && remaining <= 0) {
      cleanupExpired();
    }
  }, [remaining, activeRewardTimer, cleanupExpired]);

  if (!activeRewardTimer?.name || !activeRewardTimer?.endsAt || remaining <= 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] rounded-2xl border border-primary/20 bg-[#0b0f17]/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-xs uppercase tracking-wider text-zinc-400">Active Reward</p>
      <p className="text-sm font-semibold text-white">{activeRewardTimer.name}</p>
      <p className="mt-1 text-lg font-bold text-primary">{formatRemaining(remaining)}</p>
    </div>
  );
};

export default ActiveRewardTimer;