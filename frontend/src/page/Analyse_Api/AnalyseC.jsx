import React from "react";
import "./analyse/Analyse.css";

const num = (n) => (n ?? 0).toLocaleString("en-IN");

function StatCard({ label, value, hint, tone = "" }) {
  return (
    <div className={`card stat ${tone}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}

function Bar({ label, count, max, sub }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="bar-value">
        {num(count)}
        {sub && <em>{sub}</em>}
      </span>
    </div>
  );
}

function UserCard({ user, index }) {
  const initial = (user.name || "?").charAt(0).toUpperCase();
  return (
    <div className="user-card">
      <div className="avatar">{initial}</div>
      <div className="user-main">
        <div className="user-top">
          <strong>{user.name || "Unnamed record"}</strong>
          {user.age != null && <span className="pill">Age {user.age}</span>}
          {user.isEligible != null && (
            <span className={`pill ${user.isEligible ? "ok" : "no"}`}>
              {user.isEligible ? "Eligible" : "Not eligible"}
            </span>
          )}
        </div>
        <div className="user-meta">
          {user.country && <span>🌍 {user.country}</span>}
          {user.bloodGroup && <span>🩸 {user.bloodGroup}</span>}
          {user.email && <span className="ellipsis">✉️ {user.email}</span>}
          {user.price != null && <span>💰 {num(user.price)}</span>}
        </div>
        {user.hobbies?.length > 0 && (
          <div className="tags">
            {user.hobbies.map((h, i) => (
              <span className="tag" key={i}>{h}</span>
            ))}
          </div>
        )}
      </div>
      <span className="user-index">#{index + 1}</span>
    </div>
  );
}

function AnalyseC({
  eligibleStats = [],
  firstfiveage = [],
  documentCount = 0,
  lastfiveage = [],
  RangBoundarires = [],
  Enclude = [],
  removeDuplcate = [],
  checkminmaxAge = {},
  CheckNumberAgeGroup = [],
}) {
  const eligible = eligibleStats.find((s) => s._id === true)?.count ?? 0;
  const notEligible = eligibleStats.find((s) => s._id === false)?.count ?? 0;
  const unknown = eligibleStats.find((s) => s._id === null)?.count ?? 0;
  const eligiblePct = documentCount
    ? ((eligible / documentCount) * 100).toFixed(1)
    : "0";

  const rangeMax = Math.max(...RangBoundarires.map((r) => r.count), 1);
  const groupMax = Math.max(...CheckNumberAgeGroup.map((g) => g.count), 1);
  const uniqueAges = removeDuplcate
    .map((d) => d._id)
    .filter((a) => a !== null)
    .sort((a, b) => a - b);

  return (
    <div className="analysis-container">
      {/* KPI row */}
      <section className="stats-grid">
        <StatCard label="Total Documents" value={num(documentCount)} hint="records in collection" />
        <StatCard label="Eligible" value={num(eligible)} hint={`${eligiblePct}% of total`} tone="good" />
        <StatCard label="Not Eligible" value={num(notEligible)} hint="flagged false" tone="bad" />
        <StatCard label="Average Age" value={checkminmaxAge.Avg ? checkminmaxAge.Avg.toFixed(1) : "—"} hint="years" />
        <StatCard label="Age Range" value={`${checkminmaxAge.min ?? "—"}–${checkminmaxAge.max ?? "—"}`} hint="min to max" />
        <StatCard label="Unique Ages" value={num(uniqueAges.length)} hint={unknown ? `${unknown} null record` : "distinct values"} />
      </section>

      <div className="two-col">
        {/* Age buckets */}
        <section className="panel">
          <div className="panel-head">
            <h2>Age Distribution</h2>
            <span className="panel-note">{RangBoundarires.length} buckets</span>
          </div>
          {RangBoundarires.length ? (
            RangBoundarires.map((r) => (
              <Bar
                key={String(r._id)}
                label={r._id === "50+" ? "50+" : `${r.minAge}–${r.maxAge}`}
                count={r.count}
                max={rangeMax}
                sub={` (${((r.count / documentCount) * 100).toFixed(0)}%)`}
              />
            ))
          ) : (
            <p className="empty">No data available</p>
          )}
        </section>

        {/* Eligibility split */}
        <section className="panel">
          <div className="panel-head">
            <h2>Eligibility Split</h2>
            <span className="panel-note">{num(documentCount)} records</span>
          </div>
          <div className="split-bar">
            <div
              className="split eligible"
              style={{ width: `${(eligible / (documentCount || 1)) * 100}%` }}
            />
            <div
              className="split ineligible"
              style={{ width: `${(notEligible / (documentCount || 1)) * 100}%` }}
            />
          </div>
          <ul className="legend">
            <li><i className="dot eligible" /> Eligible <b>{num(eligible)}</b></li>
            <li><i className="dot ineligible" /> Not eligible <b>{num(notEligible)}</b></li>
            <li><i className="dot unknown" /> Unknown <b>{num(unknown)}</b></li>
          </ul>
        </section>
      </div>

      {/* Per-age counts */}
      <section className="panel">
        <div className="panel-head">
          <h2>Users per Age</h2>
          <span className="panel-note">{CheckNumberAgeGroup.length} groups</span>
        </div>
        <div className="histogram">
          {CheckNumberAgeGroup.filter((g) => g._id !== null).map((g) => (
            <div className="hist-col" key={g._id} title={`Age ${g._id}: ${g.count} users`}>
              <div
                className="hist-bar"
                style={{ height: `${(g.count / groupMax) * 100}%` }}
              />
              <span className="hist-label">{g._id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Unique ages */}
      <section className="panel">
        <div className="panel-head">
          <h2>Distinct Ages</h2>
          <span className="panel-note">duplicates removed</span>
        </div>
        <div className="tags">
          {uniqueAges.map((a) => (
            <span className="tag mono" key={a}>{a}</span>
          ))}
        </div>
      </section>

      {/* Excluded */}
      <section className="panel">
        <div className="panel-head">
          <h2>Projected Fields (name + country)</h2>
          <span className="panel-note">{Enclude.length} rows</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Country</th></tr>
            </thead>
            <tbody>
              {Enclude.map((u, i) => (
                <tr key={i}>
                  <td className="muted">{i + 1}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Youngest / oldest */}
      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>First Five (Youngest)</h2>
            <span className="panel-note">sorted ascending</span>
          </div>
          {firstfiveage.length ? (
            firstfiveage.map((u, i) => <UserCard key={u._id || i} user={u} index={i} />)
          ) : (
            <p className="empty">No data available</p>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Last Five (Oldest)</h2>
            <span className="panel-note">sorted descending</span>
          </div>
          {lastfiveage.length ? (
            lastfiveage.map((u, i) => <UserCard key={u._id || i} user={u} index={i} />)
          ) : (
            <p className="empty">No data available</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default AnalyseC;