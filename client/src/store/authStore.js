import { create } from "zustand";
import { loginUser, registerUser, getMe } from "../lib/authApi";

export const useAuthStore = create((set) => ({
  user: null,
  progression: null,
  token: localStorage.getItem("token") || null,
  loading: false,

  setUserData: (data) =>
    set({
      user: data.user,
      progression: data.progression || null,
    }),

  register: async (payload) => {
    set({ loading: true });

    try {
      const data = await registerUser(payload);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        progression: data.progression || null,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  login: async (payload) => {
    set({ loading: true });

    try {
      const data = await loginUser(payload);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        progression: data.progression || null,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchMe: async () => {
    set({ loading: true });

    try {
      const data = await getMe();

      set({
        user: data.user,
        progression: data.progression || null,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({
        user: null,
        progression: null,
        token: null,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      progression: null,
      token: null,
      loading: false,
    });
  },
}));