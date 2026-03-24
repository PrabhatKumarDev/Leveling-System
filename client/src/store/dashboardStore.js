// src/store/dashboardStore.js
import { create } from "zustand";
import { getDashboard } from "../lib/userApi";
import { getHeatmapData } from "../lib/habitApi";

export const useDashboardStore = create((set) => ({
  dashboard: null,
  heatmap: [],
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const data = await getDashboard();
      set({ dashboard: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchHeatmap: async () => {
    try {
      const data = await getHeatmapData();
      set({ heatmap: data });
    } catch (error) {
      throw error;
    }
  },
}));