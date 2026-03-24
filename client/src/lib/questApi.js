import { api } from "./api";

export const createQuest = async (data) => {
  const res = await api.post("/quests", data);
  return res.data;
};

export const getQuests = async () => {
  const res = await api.get("/quests");
  return res.data;
};

export const completeQuest = async (questId, date) => {
  const res = await api.post(`/quests/${questId}/complete`, { date });
  return res.data;
};