import React, { useState, useEffect } from "react";
import axios from "axios";
import AnalyseC from "./AnalyseC";

const initialState = {
  eligibleStats: [],
  firstfiveage: [],
  documentCount: 0,
  lastfiveage: [],
  RangBoundarires: [],
  Enclude: [],
  removeDuplcate: [],
  checkminmaxAge: {},
  CheckNumberAgeGroup: [],
  body: [],
};

function AnalyseP() {
  const [users, setUsers] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userapi = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:9000/analyseapi");
      const data = res.data?.data?.[0] || {};

      // documentCount may be [{countDocument}] or {countDocument}
      const rawCount = data.documentCount;
      const totalDocs = Array.isArray(rawCount)
        ? rawCount[0]?.countDocument ?? 0
        : rawCount?.countDocument ?? 0;

      setUsers({
        eligibleStats: data.eligibleStats || [],
        firstfiveage: data.firstfiveage || [],
        documentCount: totalDocs,
        lastfiveage: data.lastfiveage || [],
        RangBoundarires: data.RangBoundarires || [],
        Enclude: data.Enclude || [],
        removeDuplcate: data.removeDuplcate || [],
        checkminmaxAge: data.checkminmaxAge?.[0] || {},
        CheckNumberAgeGroup: data.CheckNumberAgeGroup || [],
        body: data.body || [],
      });
    } catch (err) {
      console.log("API Error:", err);
      setError("Could not load analytics. Is the server on port 9000 running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userapi();
  }, []);

  return (
    <div className="analyse-page">
      <header className="page-head">
        <div>
          <h1>Users Analysis</h1>
          <p className="page-sub">Aggregated insights from the users collection</p>
        </div>
        <button className="refresh-btn" onClick={userapi} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : (
        <AnalyseC {...users} />
      )}
    </div>
  );
}

export default AnalyseP;