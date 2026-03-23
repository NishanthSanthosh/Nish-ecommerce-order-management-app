import { useState, useEffect, useCallback } from "react";

export const useFetch = (apiFunction) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // We wrap the logic in useCallback so it's a stable reference
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await apiFunction();

      // This part handles your specific data structure: data.products
      // But we make it flexible so it works for other APIs too
      const result =
        responseData?.data?.products || responseData?.data || responseData;

      setData(result);
      setError(null);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  // The hook triggers itself on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // We return everything the component needs, including a way to refresh
  return { data, isLoading, error, refetch: fetchData };
};
