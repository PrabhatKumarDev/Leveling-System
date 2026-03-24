import { api } from "./api";

export const getRewards = async () => {
  const res = await api.get("/rewards");
  return res.data;
};

export const buyReward = async (rewardId) => {
  const res = await api.post(`/rewards/${rewardId}/buy`);
  return res.data;
};