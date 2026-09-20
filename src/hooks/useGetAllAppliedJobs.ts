import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_API_ENDPOINT } from "../utils/endpoints";
import API from "../utils/axiosInstance";

export const useGetAllAppliedJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`${APPLICATION_API_ENDPOINT}/get`);
      if (res.data?.success) {
        dispatch(setAllAppliedJobs(res.data.application || []));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load applied jobs");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  return { loading, error, refetch: fetchAppliedJobs };
};

export default useGetAllAppliedJobs;
