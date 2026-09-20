import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setPagination } from "../redux/jobSlice";
import { JOB_API_ENDPOINT } from "../utils/endpoints";
import API from "../utils/axiosInstance";
import { unwrapList, unwrapPagination } from "../services/http";

export const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchedQuery, filters, pagination, sortBy } = useSelector((store: any) => store.job);

  const fetchAllJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      const effectiveKeyword = searchedQuery || filters?.technology || "";
      if (effectiveKeyword) params.append("keyword", effectiveKeyword);
      if (filters?.location) params.append("location", filters.location);
      if (filters?.jobType) params.append("jobType", filters.jobType);
      if (filters?.experienceMin !== undefined && filters.experienceMin !== "") {
        params.append("experienceMin", String(filters.experienceMin));
      }
      if (filters?.experienceMax !== undefined && filters.experienceMax !== "") {
        params.append("experienceMax", String(filters.experienceMax));
      }
      if (filters?.salaryMin !== undefined && filters.salaryMin !== "") {
        params.append("salaryMin", String(filters.salaryMin));
      }
      if (filters?.salaryMax !== undefined && filters.salaryMax !== "") {
        params.append("salaryMax", String(filters.salaryMax));
      }
      if (pagination?.page) params.append("page", String(pagination.page));
      if (pagination?.limit) params.append("limit", String(pagination.limit));
      if (sortBy) params.append("sortBy", sortBy);

      const res = await API.get(`${JOB_API_ENDPOINT}/get?${params.toString()}`);
      if (res.data?.success || res.data?.status) {
        const jobs = unwrapList(res, "jobs");
        const pag = unwrapPagination(res);
        dispatch(setAllJobs(jobs));
        if (pag) {
          dispatch(setPagination(pag));
        }
      } else {
        setError("Failed to fetch jobs.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    searchedQuery,
    filters?.location,
    filters?.technology,
    filters?.jobType,
    filters?.experienceMin,
    filters?.experienceMax,
    filters?.salaryMin,
    filters?.salaryMax,
    pagination?.page,
    pagination?.limit,
    sortBy,
  ]);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  return { loading, error, refetch: fetchAllJobs };
};

export default useGetAllJobs;
