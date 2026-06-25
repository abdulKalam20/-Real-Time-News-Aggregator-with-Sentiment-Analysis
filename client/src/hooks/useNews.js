import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "";

export function useNews(category, query, page = 1) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { category, page };
      if (query) params.q = query;
      const res = await axios.get(`${BASE}/api/news`, { params });
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, [category, query, page]);

  useEffect(() => {
    fetch();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetch, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get(`${BASE}/api/categories`).then((r) => setCategories(r.data)).catch(() => {});
  }, []);
  return categories;
}
