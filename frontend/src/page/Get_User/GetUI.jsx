import React from "react";
import "./style/get.css";

const money = (n) => (n == null ? "—" : `₹${Number(n).toLocaleString("en-IN")}`);

const FIELDS = [
  { name: "name", icon: "🔍", placeholder: "Search name" },
  { name: "countrys", icon: "🌍", placeholder: "Country" },
  { name: "hoobies", icon: "🎯", placeholder: "Hobby" },
  { name: "priceless", icon: "💰", placeholder: "Min price", type: "number" },
  { name: "pricegreat", icon: "💸", placeholder: "Max price", type: "number" },
  { name: "agelessValue", icon: "🎂", placeholder: "Min age", type: "number" },
  { name: "agegreatValues", icon: "🎉", placeholder: "Max age", type: "number" },
];

const SkeletonCard = () => (
  <div className="user-card skeleton-card">
    <div className="card-header">
      <div className="sk sk-avatar" />
      <div style={{ flex: 1 }}>
        <div className="sk sk-line" style={{ width: "55%" }} />
        <div className="sk sk-line" style={{ width: "75%", height: 10 }} />
      </div>
    </div>
    <div className="sk sk-line" style={{ width: "90%" }} />
    <div className="sk sk-line" style={{ width: "70%" }} />
  </div>
);

/* Offset pager: no total from the API, so we render a sliding window
   of pages we know are reachable, plus prev/next driven by hasMore. */
const Pager = ({ page, hasMore, maxSeenPage, loading, onPageChange }) => {
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(maxSeenPage, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="pager" aria-label="Pagination">
      <button
        className="pg-btn"
        onClick={() => onPageChange(1)}
        disabled={page === 1 || loading}
        aria-label="First page"
      >
        «
      </button>
      <button
        className="pg-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || loading}
      >
        ‹ Prev
      </button>

      {start > 1 && <span className="pg-gap">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          className={`pg-btn num ${p === page ? "active" : ""}`}
          onClick={() => onPageChange(p)}
          disabled={loading}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {hasMore && end === page && <span className="pg-gap">…</span>}

      <button
        className="pg-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore || loading}
      >
        Next ›
      </button>
    </nav>
  );
};

const GetUI = ({
  filters, data, meta, maxSeenPage, headers, error, loading, ttl,
  onFilterChange, onPageChange, onLimitChange, onReset, onRefresh,
}) => {
  const activeCount =
    FIELDS.filter((f) => filters[f.name] !== "").length + (filters.truess !== "" ? 1 : 0);

  const offset = (meta.page - 1) * meta.limit;
  const from = meta.count === 0 ? 0 : offset + 1;
  const to = offset + meta.count;

  const cacheHit = String(headers.cache).toUpperCase() === "HIT";
  const showPager = meta.page > 1 || meta.hasMore;

  return (
    <div className="paginated-list">
      <header className="page-head">
        <div>
          <h2>Redis Filtered Search</h2>
          <p className="sub">Offset pagination · server-side filtering</p>
        </div>
        <div className="head-actions">
          <button className="ghost-btn" onClick={onRefresh} disabled={loading}>⟳ Refresh</button>
          <button className="ghost-btn" onClick={onReset} disabled={!activeCount}>
            Clear{activeCount ? ` (${activeCount})` : ""}
          </button>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}

      <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
        {FIELDS.map((f) => (
          <div className="input-group" key={f.name}>
            <span>{f.icon}</span>
            <input
              name={f.name}
              type={f.type || "text"}
              min={f.type === "number" ? 0 : undefined}
              value={filters[f.name]}
              onChange={onFilterChange}
              placeholder={f.placeholder}
            />
          </div>
        ))}
        <div className="input-group">
          <span>✅</span>
          <select name="truess" value={filters.truess} onChange={onFilterChange}>
            <option value="">Eligible: any</option>
            <option value="true">Eligible only</option>
            <option value="false">Not eligible</option>
          </select>
        </div>
      </form>

      <div className="status-bar">
        <div className="chips">
          <span className={`chip ${cacheHit ? "hit" : "miss"}`}>
            {cacheHit ? "● Cache HIT" : "○ Cache MISS"}
          </span>
          <span className="chip">Source: {headers.source}</span>
          <span className="chip">{headers.time}</span>
          {ttl !== null && (
            <span className={`chip ttl ${ttl <= 5 ? "expiring" : ""}`}>TTL {ttl}s</span>
          )}
        </div>

        <div className="status-right">
          <span className="count">
            {loading
              ? "Loading…"
              : meta.count === 0
              ? "No results"
              : `Showing ${from}–${to}${meta.hasMore ? "" : " (end)"}`}
          </span>
          <label className="per-page">
            Per page
            <select value={filters.limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="results">
          {Array.from({ length: Math.min(filters.limit, 6) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <h3>No matching records</h3>
          <p>Try widening the price or age range, or clear the filters.</p>
          {activeCount > 0 && <button className="ghost-btn" onClick={onReset}>Clear filters</button>}
        </div>
      ) : (
        <div className="results">
          {data.map((item) => (
            <article key={item._id} className="user-card">
              <div className="card-header">
                <div className="avatar">{item.name?.charAt(0)?.toUpperCase() || "?"}</div>
                <div className="user-info">
                  <h3 title={item.name}>{item.name || "Unnamed"}</h3>
                  <p className="email" title={item.email}>{item.email || "—"}</p>
                </div>
                <span className={`badge ${item.isEligible ? "yes" : "no"}`}>
                  {item.isEligible ? "Eligible" : "Not eligible"}
                </span>
              </div>

              <div className="card-body">
                <div className="kv"><span>Age</span><strong>{item.age ?? "—"}</strong></div>
                <div className="kv"><span>Country</span><strong>{item.country || "—"}</strong></div>
                <div className="kv"><span>Price</span><strong>{money(item.price)}</strong></div>
                <div className="kv"><span>Blood</span><strong>{item.bloodGroup || "—"}</strong></div>
              </div>

              {item.hobbies?.length > 0 && (
                <div className="tags">
                  {item.hobbies.map((h, i) => <span className="tag" key={i}>{h}</span>)}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {showPager && (
        <div className="pager-wrap">
          <Pager
            page={meta.page}
            hasMore={meta.hasMore}
            maxSeenPage={maxSeenPage}
            loading={loading}
            onPageChange={onPageChange}
          />
          <span className="pager-note">
            Page {meta.page}
            {!meta.hasMore && " · last page"}
          </span>
        </div>
      )}
    </div>
  );
};

export default GetUI;