import { api } from "./api";

export const createHabit = async (data) => {
  const res = await api.post("/habits", data);
  return res.data;
};

export const getHabits = async () => {
  const res = await api.get("/habits");
  return res.data;
};

export const completeHabit = async (habitId, date) => {
  const res = await api.post(`/habits/${habitId}/complete`, { date });
  return res.data;
};
export const deleteHabit = async (habitId) => {
  const res = await api.delete(`/habits/${habitId}`);
  return res.data;
}

export const getHeatmapData = async () => {
  const res = await api.get("/habits/heatmap/all");
  return res.data;
};