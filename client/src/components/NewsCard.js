import React from "react";
import { formatDistanceToNow } from "date-fns";

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  animation: "fadeIn 0.4s ease forwards",
};

const sentimentColors = {
  Positive: "#22c55e",
  Neutral: "#f59e0b",
  Negative: "#ef4444",
};

export default function NewsCard({ article }) {
  const { title, description, url, urlToImage, source, publishedAt, sentiment } = article;
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : "";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...cardStyle }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ height: 180, background: "var(--surface2)", position: "relative", overflow: "hidden" }}>
        {urlToImage ? (
          <img
            src={urlToImage}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
            📰
          </div>
        )}
        {/* Sentiment badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: `${sentimentColors[sentiment.label]}22`,
          border: `1px solid ${sentimentColors[sentiment.label]}55`,
          color: sentimentColors[sentiment.label],
          borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600,
          backdropFilter: "blur(8px)",
        }}>
          {sentiment.emoji} {sentiment.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Source + time */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            {source}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 16, fontWeight: 700,
          color: "var(--text)", lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p style={{
            fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            marginTop: "auto",
          }}>
            {description}
          </p>
        )}
      </div>
    </a>
  );
}
