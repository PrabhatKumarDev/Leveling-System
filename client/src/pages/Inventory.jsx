import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Package, Play, Clock3, Sparkles, Coins, Gift } from "lucide-react";
import { useInventoryStore } from "../store/inventoryStore";

const typeMeta = {
  xp_boost: {
    label: "XP Boost",
    icon: <Sparkles className="h-5 w-5 text-violet-300" />,
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  },
  gold_boost: {
    label: "Gold Boost",
    icon: <Coins className="h-5 w-5 text-amber-300" />,
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  },
  time_reward: {
    label: "Time Reward",
    icon: <Clock3 className="h-5 w-5 text-cyan-300" />,
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  },
  custom_reward: {
    label: "Custom Reward",
    icon: <Gift className="h-5 w-5 text-emerald-300" />,
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  },
};

const formatRemaining = (ms) => {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const InventoryItemCard = ({ item, onUse, using }) => {
  const meta = typeMeta[item.type] || typeMeta.custom_reward;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            {meta.icon}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {item.name}
            </h3>
            <div
              className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[10px] font-medium ${meta.badge}`}
            >
              {meta.label}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-zinc-400">Qty</p>
          <p className="text-sm font-bold text-white">{item.quantity}</p>
        </div>
      </div>

      {item.durationMinutes > 0 && (
        <p className="text-sm text-zinc-400">
          Duration: <span className="text-white">{item.durationMinutes} min</span>
        </p>
      )}

      <button
        onClick={() => onUse(item.rewardId)}
        disabled={using}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        <Play className="h-4 w-4" />
        {using ? "Using..." : "Use Reward"}
      </button>
    </div>
  );
};

const Inventory = () => {
  const {
    inventory,
    activeRewardTimer,
    loading,
    fetchInventory,
    useItem,
    cleanupExpired,
  } = useInventoryStore();

  const [usingId, setUsingId] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchInventory().catch((error) => {
      toast.error(error?.response?.data?.message || "Failed to load inventory");
    });
  }, [fetchInventory]);

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

  const handleUse = async (rewardId) => {
    try {
      setUsingId(String(rewardId));
      const data = await useItem(rewardId);
      toast.success(data.message || "Reward used");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to use reward");
    } finally {
      setUsingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          <span className="text-primary">Inventory</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Use owned rewards and manage active timers.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-white">Active Reward</h2>
        </div>

        {activeRewardTimer?.name && activeRewardTimer?.endsAt && remaining > 0 ? (
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm text-zinc-300">{activeRewardTimer.name}</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {formatRemaining(remaining)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No active timed reward.</p>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-zinc-400">Loading inventory...</div>
      ) : inventory.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <InventoryItemCard
              key={String(item.rewardId)}
              item={item}
              using={usingId === String(item.rewardId)}
              onUse={handleUse}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          Your inventory is empty.
        </div>
      )}
    </div>
  );
};

export default Inventory;