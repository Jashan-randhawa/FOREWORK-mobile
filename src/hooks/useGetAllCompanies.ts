import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setCompanies } from "../redux/companySlice";
import { COMPANY_API_ENDPOINT } from "../utils/endpoints";
import API from "../utils/axiosInstance";
import { unwrapList } from "../services/http";

export const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`${COMPANY_API_ENDPOINT}/get`);
      if (res.data?.success || res.data?.status) {
        const companies = unwrapList(res, "companies");
        dispatch(setCompanies(companies));
      } else {
        setError(res.data?.message || "Failed to fetch companies.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { loading, error, refetch: fetchCompanies };
};

export default useGetAllCompanies;
