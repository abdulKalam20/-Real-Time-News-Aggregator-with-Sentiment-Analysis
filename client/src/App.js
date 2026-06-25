import React, { useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import NewsCard from "./components/NewsCard";
import SentimentBar from "./components/SentimentBar";
import SkeletonCard from "./components/SkeletonCard";
import { useNews, useCategories } from "./hooks/useNews";

// Debounce helper
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Sentiment filter options
const SENTIMENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "Positive", label: "😊 Positive" },
  { id: "Neutral", label: "😐 Neutral" },
  { id: "Negative", label: "😠 Negative" },
];

export default function App() {
  const [category, setCategory] = useState("general");
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 600);
  const categories = useCategories();
  const { data, loading, error, refetch } = useNews(category, debouncedSearch, page);

  // Reset page on category/search change
  useEffect(() => { setPage(1); setSentimentFilter("all"); }, [category, debouncedSearch]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    refetch();
  }, [refetch]);

  const filteredArticles = data?.articles?.filter(
    (a) => sentimentFilter === "all" || a.sentiment.label === sentimentFilter
  ) || [];

  const showSkeletons = loading && !data;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header search={search} onSearch={setSearch} onRefresh={handleRefresh} loading={loading} />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>

        {/* Category tabs */}
        {categories.length > 0 && (
          <CategoryTabs categories={categories} active={category} onChange={setCategory} />
        )}

        {/* Sentiment summary bar */}
        {data?.sentimentSummary && <SentimentBar summary={data.sentimentSummary} />}

        {/* Sentiment filter row */}
        {data && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4 }}>Filter:</span>
            {SENTIMENT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSentimentFilter(f.id)}
                style={{
                  background: sentimentFilter === f.id ? "var(--surface2)" : "transparent",
                  border: `1px solid ${sentimentFilter === f.id ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 6, padding: "5px 12px", fontSize: 12,
                  color: sentimentFilter === f.id ? "var(--accent)" : "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>
              {filteredArticles.length} articles
              {data.fromCache && <span style={{ marginLeft: 8, color: "var(--accent)" }}>⚡ cached</span>}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#ef444420", border: "1px solid #ef444440",
            borderRadius: "var(--radius)", padding: 20, textAlign: "center", marginBottom: 24,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
            <p style={{ color: "#ef4444", fontWeight: 600 }}>{error}</p>
            {error.includes("API key") && (
              <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>
                Get a free key at{" "}
                <a href="https://newsapi.org" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
                  newsapi.org
                </a>{" "}
                and add it to <code style={{ background: "var(--surface2)", padding: "2px 6px", borderRadius: 4 }}>server/.env</code>
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {showSkeletons
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredArticles.map((article, i) => (
                <NewsCard key={article.id || i} article={article} />
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No articles found</p>
            <p style={{ marginTop: 8 }}>Try a different search term or category</p>
          </div>
        )}

        {/* Load more */}
        {data && filteredArticles.length > 0 && sentimentFilter === "all" && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "12px 32px", color: "var(--text)",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center", padding: "20px", color: "var(--text-muted)",
        fontSize: 12, borderTop: "1px solid var(--border)",
      }}>
        NewsPulse · News powered by NewsAPI.org · Sentiment analysis via NLP
      </footer>
    </div>
  );
}
