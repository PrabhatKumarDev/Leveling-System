import { api } from "./api";

export const getDashboard = async () => {
  const res = await api.get("/users/dashboard");
  return res.data;
};