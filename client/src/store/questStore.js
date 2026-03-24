import { create } from "zustand";
import { completeQuest, createQuest, getQuests } from "../lib/questApi";
import { useAuthStore } from "./authStore";

export const useQuestStore = create((set) => ({
  quests: [],
  loading: false,

  fetchQuests: async () => {
    set({ loading: true });
    try {
      const quests = await getQuests();
      set({ quests, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  addQuest: async (payload) => {
    const quest = await createQuest(payload);
    set((state) => ({
      quests: [quest, ...state.quests],
    }));
  },

  markQuestDone: async (questId, date) => {
    const data = await completeQuest(questId, date);

    set((state) => ({
      quests: state.quests.map((quest) =>
        quest._id === questId ? data.quest : quest
      ),
    }));

    useAuthStore.getState().setUserData({
      user: data.user,
      progression: data.progression,
    });

    return data;
  },
}));