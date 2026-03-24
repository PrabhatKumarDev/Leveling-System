import { api } from "./api";

export const getInventory = async () => {
  const res = await api.get("/inventory");
  return res.data;
};

export const useInventoryItem = async (rewardId) => {
  const res = await api.post(`/inventory/${rewardId}/use`);
  return res.data;
};

export const clearExpiredActiveReward = async () => {
  const res = await api.post("/inventory/active/cleanup");
  return res.data;
};