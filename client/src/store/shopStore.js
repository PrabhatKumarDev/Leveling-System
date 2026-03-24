import { create } from "zustand";
import {
  getShopRewards,
  buyReward,
  createCustomReward,
} from "../lib/shopApi";
import { useAuthStore } from "./authStore";

export const useShopStore = create((set) => ({
  rewards: [],
  loading: false,

  fetchRewards: async () => {
    set({ loading: true });
    try {
      const rewards = await getShopRewards();
      set({ rewards, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  purchaseReward: async (rewardId) => {
    const data = await buyReward(rewardId);
    useAuthStore.getState().setUserData({
      user: data.user,
      progression: useAuthStore.getState().progression,
    });
    return data;
  },

  addCustomReward: async (payload) => {
    return await createCustomReward(payload);
  },
}));