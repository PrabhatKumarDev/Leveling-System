import { create } from "zustand";
import { completeHabit, createHabit, getHabits, deleteHabit } from "../lib/habitApi";
import { useAuthStore } from "./authStore";

export const useHabitStore = create((set) => ({
  habits: [],
  loading: false,

  fetchHabits: async () => {
    set({ loading: true });
    try {
      const habits = await getHabits();
      set({ habits, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  addHabit: async (payload) => {
    const createdHabit = await createHabit(payload);

    set((state) => ({
      habits: [createdHabit, ...state.habits],
    }));

    return createdHabit;
  },

  markHabitDone: async (habitId, date) => {
    const data = await completeHabit(habitId, date);

    set((state) => ({
      habits: state.habits.map((habit) =>
        habit._id === habitId ? data.habit : habit
      ),
    }));

    useAuthStore.getState().setUserData({
      user: data.user,
      progression: data.progression,
    });

    return data;
  },
  removeHabit: async (habitId) => {
    await deleteHabit(habitId);

    set((state) => ({
      habits: state.habits.filter((habit) => habit._id !== habitId),
    }));
  },
}));