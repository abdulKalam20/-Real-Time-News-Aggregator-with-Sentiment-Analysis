import React from "react";

const shimmer = {
  background: "linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  borderRadius: 6,
};

export default function SkeletonCard() {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", overflow: "hidden",
    }}>
      <div style={{ ...shimmer, height: 180 }} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...shimmer, height: 12, width: "40%" }} />
        <div style={{ ...shimmer, height: 16, width: "90%" }} />
        <div style={{ ...shimmer, height: 16, width: "75%" }} />
        <div style={{ ...shimmer, height: 12, width: "60%", marginTop: 8 }} />
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}
