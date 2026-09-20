import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAllAdminJobs } from "../redux/jobSlice";
import { JOB_API_ENDPOINT } from "../utils/endpoints";
import API from "../utils/axiosInstance";
import { unwrapList } from "../services/http";

export const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`${JOB_API_ENDPOINT}/getadminjobs`);
      if (res.data?.success || res.data?.status) {
        const jobs = unwrapList(res, "jobs");
        dispatch(setAllAdminJobs(jobs));
      } else {
        setError(res.data?.message || "Failed to fetch recruiter jobs.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAdminJobs();
  }, [fetchAdminJobs]);

  return { loading, error, refetch: fetchAdminJobs };
};

export default useGetAllAdminJobs;
