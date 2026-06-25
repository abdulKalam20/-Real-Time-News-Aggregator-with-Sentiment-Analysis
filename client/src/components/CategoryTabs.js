import React from "react";

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
      scrollbarWidth: "none", marginBottom: 24,
    }}>
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              background: isActive ? "var(--accent)" : "var(--surface)",
              border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 20, padding: "7px 16px", fontSize: 13,
              color: isActive ? "#fff" : "var(--text-muted)",
              cursor: "pointer", whiteSpace: "nowrap", fontWeight: isActive ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        );
      })}
    </div>
  );
}
