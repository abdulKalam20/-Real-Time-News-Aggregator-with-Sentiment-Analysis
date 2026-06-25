import React from "react";

export default function Header({ search, onSearch, onRefresh, loading }) {
  return (
    <header style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 24 }}>📡</span>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20, fontWeight: 900, color: "var(--text)", lineHeight: 1,
            }}>
              NewsPulse
            </div>
            <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 2, textTransform: "uppercase" }}>
              Live · Sentiment AI
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, position: "relative", maxWidth: 480 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--text-muted)" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search any topic..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "9px 12px 9px 38px",
              color: "var(--text)", fontSize: 14, outline: "none",
            }}
          />
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: "var(--accent)", border: "none", borderRadius: 8,
            padding: "9px 16px", color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          }}
        >
          <span style={{ display: "inline-block", animation: loading ? "spin 1s linear infinite" : "none" }}>↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
    </header>
  );
}
