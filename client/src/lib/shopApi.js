import { api } from "./api";

export const getShopRewards = async () => {
  const res = await api.get("/shop");
  return res.data;
};

export const buyReward = async (rewardId) => {
  const res = await api.post(`/shop/${rewardId}/buy`);
  return res.data;
};

export const createCustomReward = async (payload) => {
  const res = await api.post("/shop/custom", payload);
  return res.data;
};