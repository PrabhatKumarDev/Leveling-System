import { api } from "./api";

export const getAvailableJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export const chooseJob = async (jobId) => {
  const res = await api.post(`/jobs/${jobId}/choose`);
  return res.data;
};