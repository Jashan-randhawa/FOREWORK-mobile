import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../redux/companySlice";
import { COMPANY_API_ENDPOINT } from "../utils/endpoints";
import API from "../utils/axiosInstance";
import { unwrapItem } from "../services/http";

export const useGetCompanyById = (companyId: string | null | undefined) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`${COMPANY_API_ENDPOINT}/get/${companyId}`);
      if (res.data?.success || res.data?.status) {
        const company = unwrapItem(res, "company");
        dispatch(setSingleCompany(company));
      } else {
        setError(res.data?.message || "Failed to fetch company details.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return { loading, error, refetch: fetchCompany };
};

export default useGetCompanyById;
