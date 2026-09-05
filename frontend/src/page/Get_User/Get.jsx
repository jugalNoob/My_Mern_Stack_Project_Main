import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import GetUI from "./GetUI";

// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";
const DEBOUNCE_MS = 400;

const INITIAL_FILTERS = {
  name: "",
  countrys: "",
  truess: "",
  hoobies: "",
  priceless: "",
  pricegreat: "",
  agelessValue: "",
  agegreatValues: "",
  page: 1,
  limit: 10,
};

const Get = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [query, setQuery] = useState(INITIAL_FILTERS);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, count: 0, hasMore: false });
  const [headers, setHeaders] = useState({ cache: "—", source: "—", time: "—" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ttl, setTtl] = useState(null);
  const [ttlDeadline, setTtlDeadline] = useState(null);

  // Highest page we've confirmed exists — lets us render a few page buttons
  const [maxSeenPage, setMaxSeenPage] = useState(1);

  const skipDebounce = useRef(false);
  const abortRef = useRef(null);

  // ---------- DEBOUNCE ----------
  useEffect(() => {
    if (skipDebounce.current) {
      skipDebounce.current = false;
      setQuery(filters);
      return;
    }
    const t = setTimeout(() => setQuery(filters), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filters]);

  // ---------- FETCH ----------
  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const params = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== "" && v !== null)
      );

      const res = await axios.get("https://my-mern-stack-project-main.onrender.com/get", {
        params,
        signal: controller.signal,
      });

      const body = res.data || {};
      const rows = body.data || [];

      setData(rows);
      setMeta({
        page: body.page ?? query.page,
        limit: body.limit ?? query.limit,
        count: body.count ?? rows.length,
        hasMore: Boolean(body.hasMore),
      });

      // Track the furthest page known to hold data
      setMaxSeenPage((prev) => {
        const reachable = body.hasMore ? (body.page ?? query.page) + 1 : (body.page ?? query.page);
        return Math.max(prev, reachable);
      });

      // Landed past the end (stale deep link, or filters narrowed the set)
      if (rows.length === 0 && (body.page ?? query.page) > 1) {
        skipDebounce.current = true;
        setFilters((prev) => ({ ...prev, page: 1 }));
      }

      setHeaders({
        cache: res.headers["x-cache"] || "—",
        source: res.headers["x-cache-source"] || "—",
        time: res.headers["x-response-time"] || "—",
      });

      const ttlHeader = Number(res.headers["x-ttl-seconds"]);
      setTtlDeadline(ttlHeader > 0 ? Date.now() + ttlHeader * 1000 : null);
    } catch (err) {
      if (axios.isCancel(err) || err.name === "CanceledError") return;

      if (err.response?.status === 429) {
        const retry = err.response.data?.retryAfter;
        setError(`Too many requests. Retry${retry ? ` after ${retry}` : " shortly"}.`);
      } else if (err.code === "ERR_NETWORK") {
        setError("Can't reach the server on port 9000.");
      } else {
        setError("Failed to fetch data.");
      }
      setData([]);
      setMeta((m) => ({ ...m, count: 0, hasMore: false }));
      setTtlDeadline(null);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  // ---------- TTL ----------
  useEffect(() => {
    if (!ttlDeadline) {
      setTtl(null);
      return;
    }
    const tick = () => setTtl(Math.max(0, Math.ceil((ttlDeadline - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ttlDeadline]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaxSeenPage(1); // filter changed → the old page map is meaningless
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const goToPage = (page) => {
    if (page < 1 || page === filters.page || loading) return;
    if (page > filters.page && !meta.hasMore) return; // can't go past the end
    skipDebounce.current = true;
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (limit) => {
    skipDebounce.current = true;
    setMaxSeenPage(1);
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleReset = () => {
    skipDebounce.current = true;
    setMaxSeenPage(1);
    setFilters(INITIAL_FILTERS);
  };

  return (
    <GetUI
      filters={filters}
      data={data}
      meta={meta}
      maxSeenPage={maxSeenPage}
      headers={headers}
      error={error}
      loading={loading}
      ttl={ttl}
      onFilterChange={handleChange}
      onPageChange={goToPage}
      onLimitChange={handleLimitChange}
      onReset={handleReset}
      onRefresh={fetchData}
    />
  );
};

export default Get;