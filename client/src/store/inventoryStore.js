import { create } from "zustand";
import {
  getInventory,
  useInventoryItem,
  clearExpiredActiveReward,
} from "../lib/inventoryApi";

export const useInventoryStore = create((set) => ({
  inventory: [],
  activeRewardTimer: null,
  loading: false,

  fetchInventory: async () => {
    set({ loading: true });
    try {
      const data = await getInventory();
      set({
        inventory: data.inventory || [],
        activeRewardTimer: data.activeRewardTimer || null,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  useItem: async (rewardId) => {
    const data = await useInventoryItem(rewardId);
    set({
      inventory: data.inventory || [],
      activeRewardTimer: data.activeRewardTimer || null,
    });
    return data;
  },

  cleanupExpired: async () => {
    const data = await clearExpiredActiveReward();
    set({
      activeRewardTimer: data.activeRewardTimer || null,
    });
  },
}));