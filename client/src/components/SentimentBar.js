import React from "react";

export default function SentimentBar({ summary }) {
  if (!summary) return null;
  const total = summary.Positive + summary.Neutral + summary.Negative || 1;
  const pct = (n) => Math.round((n / total) * 100);

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
          Sentiment Overview
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{total} articles</span>
      </div>

      {/* Bar */}
      <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
        {pct(summary.Positive) > 0 && (
          <div style={{ width: `${pct(summary.Positive)}%`, background: "#22c55e", borderRadius: 4, transition: "width 0.8s ease" }} />
        )}
        {pct(summary.Neutral) > 0 && (
          <div style={{ width: `${pct(summary.Neutral)}%`, background: "#f59e0b", borderRadius: 4, transition: "width 0.8s ease" }} />
        )}
        {pct(summary.Negative) > 0 && (
          <div style={{ width: `${pct(summary.Negative)}%`, background: "#ef4444", borderRadius: 4, transition: "width 0.8s ease" }} />
        )}
      </div>

      {/* Labels */}
      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
        {[
          { label: "Positive", emoji: "😊", color: "#22c55e", count: summary.Positive },
          { label: "Neutral",  emoji: "😐", color: "#f59e0b", count: summary.Neutral  },
          { label: "Negative", emoji: "😠", color: "#ef4444", count: summary.Negative },
        ].map(({ label, emoji, color, count }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>{emoji}</span>
            <span style={{ fontSize: 13, color }}>
              {label} <strong>{count}</strong>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> ({pct(count)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
