const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Sentiment = require("sentiment");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const sentiment = new Sentiment();
const cache = new NodeCache({ stdTTL: 300 }); // Cache 5 minutes

// --- Middleware ---
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// --- Sentiment Helper ---
function analyzeSentiment(text) {
  const result = sentiment.analyze(text || "");
  const score = result.score;
  if (score > 1) return { label: "Positive", score, emoji: "😊", color: "#22c55e" };
  if (score < -1) return { label: "Negative", score, emoji: "😠", color: "#ef4444" };
  return { label: "Neutral", score, emoji: "😐", color: "#f59e0b" };
}

// --- Enrich articles with sentiment ---
function enrichArticles(articles) {
  return articles
    .filter((a) => a.title && a.title !== "[Removed]")
    .map((article) => ({
      id: Buffer.from(article.url || article.title).toString("base64").slice(0, 20),
      title: article.title,
      description: article.description || "",
      url: article.url,
      urlToImage: article.urlToImage,
      source: article.source?.name || "Unknown",
      publishedAt: article.publishedAt,
      author: article.author,
      sentiment: analyzeSentiment(article.title + " " + (article.description || "")),
    }));
}

// --- Routes ---

// GET /api/news?category=technology&q=search&page=1
app.get("/api/news", async (req, res) => {
  const { category = "general", q = "", page = 1, pageSize = 20 } = req.query;
  const cacheKey = `news_${category}_${q}_${page}`;

  const cached = cache.get(cacheKey);
  if (cached) return res.json({ ...cached, fromCache: true });

  try {
    const params = {
      apiKey: process.env.NEWS_API_KEY,
      language: "en",
      pageSize: parseInt(pageSize),
      page: parseInt(page),
      sortBy: "publishedAt",
    };

    let url;
    if (q) {
      url = "https://newsapi.org/v2/everything";
      params.q = q;
    } else {
      url = "https://newsapi.org/v2/top-headlines";
      params.category = category;
      params.country = "us";
    }

    const response = await axios.get(url, { params });
    const enriched = enrichArticles(response.data.articles || []);

    // Sentiment summary
    const sentimentCounts = enriched.reduce(
      (acc, a) => {
        acc[a.sentiment.label]++;
        return acc;
      },
      { Positive: 0, Neutral: 0, Negative: 0 }
    );

    const result = {
      articles: enriched,
      totalResults: response.data.totalResults,
      sentimentSummary: sentimentCounts,
      category,
      query: q,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("NewsAPI error:", error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid API key. Get a free key at newsapi.org" });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: "NewsAPI rate limit reached. Try again later." });
    }
    res.status(500).json({ error: "Failed to fetch news. Please try again." });
  }
});

// GET /api/categories — list of supported categories
app.get("/api/categories", (req, res) => {
  res.json([
    { id: "general", label: "General", icon: "🌍" },
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "business", label: "Business", icon: "📈" },
    { id: "sports", label: "Sports", icon: "⚽" },
    { id: "health", label: "Health", icon: "🏥" },
    { id: "science", label: "Science", icon: "🔬" },
    { id: "entertainment", label: "Entertainment", icon: "🎬" },
  ]);
});

// GET /api/health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
