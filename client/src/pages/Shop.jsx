import React, { useEffect, useMemo, useState } from "react";
import { Coins, Clock3, Gift, Sparkles, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useShopStore } from "../store/shopStore";
import { useAuthStore } from "../store/authStore";

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

const CreateCustomRewardModal = ({ open, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    cost: 50,
    type: "custom_reward",
    durationMinutes: 30,
  });

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit({
      name: form.name.trim(),
      cost: Number(form.cost),
      type: form.type,
      durationMinutes:
        form.type === "time_reward" ? Number(form.durationMinutes) : 0,
    });

    setForm({
      name: "",
      cost: 50,
      type: "custom_reward",
      durationMinutes: 30,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-3">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0f17] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Custom Reward</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Reward name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="1"
              value={form.cost}
              onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))}
              placeholder="Cost"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />

            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            >
              <option value="custom_reward" className="bg-[#0b0f17]">
                Custom Reward
              </option>
              <option value="time_reward" className="bg-[#0b0f17]">
                Time Reward
              </option>
            </select>
          </div>

          {form.type === "time_reward" && (
            <input
              type="number"
              min="1"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm((p) => ({ ...p, durationMinutes: e.target.value }))
              }
              placeholder="Duration in minutes"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Reward"}
          </button>
        </form>
      </div>
    </div>
  );
};

const RewardCard = ({ reward, onBuy, buying }) => {
  const meta = typeMeta[reward.type] || typeMeta.custom_reward;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            {meta.icon}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {reward.name}
            </h3>
            <div
              className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[10px] font-medium ${meta.badge}`}
            >
              {meta.label}
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-zinc-400">Cost</p>
          <p className="text-sm font-bold text-amber-300">{reward.cost} Gold</p>
        </div>
      </div>

      <div className="space-y-1 text-sm text-zinc-400">
        {reward.type === "xp_boost" && (
          <p>
            Multiplier: <span className="text-white">{reward.multiplier}x XP</span>
          </p>
        )}
        {reward.type === "gold_boost" && (
          <p>
            Multiplier: <span className="text-white">{reward.multiplier}x Gold</span>
          </p>
        )}
        {reward.durationMinutes > 0 && (
          <p>
            Duration:{" "}
            <span className="text-white">{reward.durationMinutes} min</span>
          </p>
        )}
      </div>

      <button
        onClick={() => onBuy(reward._id)}
        disabled={buying}
        className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {buying ? "Purchasing..." : "Buy Reward"}
      </button>
    </div>
  );
};

const Shop = () => {
  const { rewards, loading, fetchRewards, purchaseReward, addCustomReward } =
    useShopStore();
  const user = useAuthStore((state) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchRewards().catch((error) => {
      toast.error(error?.response?.data?.message || "Failed to load shop");
    });
  }, [fetchRewards]);

  const gold = user?.gold || 0;

  const sortedRewards = useMemo(() => {
    return [...rewards].sort((a, b) => a.cost - b.cost);
  }, [rewards]);

  const handleBuy = async (rewardId) => {
    try {
      setBuyingId(rewardId);
      await purchaseReward(rewardId);
      toast.success("Reward purchased");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to buy reward");
    } finally {
      setBuyingId(null);
    }
  };

  const handleCreateCustom = async (payload) => {
    try {
      setCreating(true);
      await addCustomReward(payload);
      await fetchRewards();
      setShowModal(false);
      toast.success("Custom reward created");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create custom reward"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            <span className="text-primary">Shop</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Spend your gold on boosts and personal rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
            Gold: {gold}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Custom Reward
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-zinc-400">Loading shop...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {sortedRewards.map((reward) => (
            <RewardCard
              key={reward._id}
              reward={reward}
              buying={buyingId === reward._id}
              onBuy={handleBuy}
            />
          ))}
        </div>
      )}

      <CreateCustomRewardModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCustom}
        loading={creating}
      />
    </div>
  );
};

export default Shop;