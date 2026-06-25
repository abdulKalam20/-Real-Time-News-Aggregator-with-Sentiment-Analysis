// Positive/negative word lists for lightweight sentiment scoring
const POSITIVE = new Set([
  'good','great','excellent','positive','success','win','wins','won','happy','best',
  'amazing','wonderful','love','perfect','fantastic','brilliant','outstanding','strong',
  'gain','gains','growth','rise','rises','rose','soar','soars','record','profit',
  'profits','improve','improves','improved','recovery','recover','boost','boosts',
  'support','peace','hope','hopes','breakthrough','innovation','award','celebrate',
]);
const NEGATIVE = new Set([
  'bad','terrible','awful','negative','fail','fails','failure','loss','losses','sad',
  'worst','horrible','disaster','hate','wrong','crisis','danger','warning','attack',
  'attacks','war','conflict','crash','crashes','drop','drops','fell','fall','scandal',
  'fraud','death','deaths','killed','kills','violence','riot','riots','collapse',
  'collapsed','collapses','devastating','devastate','tragedy','tragic',
]);

function analyzeSentiment(text) {
  const words = (text || '').toLowerCase().split(/\W+/);
  let score = 0;
  for (const w of words) {
    if (POSITIVE.has(w)) score++;
    if (NEGATIVE.has(w)) score--;
  }
  if (score > 1) return { label: 'Positive', score, emoji: '😊', color: '#22c55e' };
  if (score < -1) return { label: 'Negative', score, emoji: '😠', color: '#ef4444' };
  return { label: 'Neutral', score, emoji: '😐', color: '#f59e0b' };
}

function enrichArticles(articles) {
  return articles
    .filter((a) => a.title && a.title !== '[Removed]')
    .map((article) => ({
      id: btoa(article.url || article.title).slice(0, 20),
      title: article.title,
      description: article.description || '',
      url: article.url,
      urlToImage: article.urlToImage,
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt,
      author: article.author,
      sentiment: analyzeSentiment(article.title + ' ' + (article.description || '')),
    }));
}

export default async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || 'general';
  const q = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);

  const apiKey = Netlify.env.get('NEWS_API_KEY');
  if (!apiKey) {
    return Response.json(
      { error: 'Invalid API key. Get a free key at newsapi.org' },
      { status: 401 }
    );
  }

  const params = new URLSearchParams({
    apiKey,
    language: 'en',
    pageSize: String(pageSize),
    page: String(page),
    sortBy: 'publishedAt',
  });

  let apiUrl;
  if (q) {
    apiUrl = 'https://newsapi.org/v2/everything';
    params.set('q', q);
  } else {
    apiUrl = 'https://newsapi.org/v2/top-headlines';
    params.set('category', category);
    params.set('country', 'us');
  }

  try {
    const response = await fetch(`${apiUrl}?${params}`);

    if (response.status === 401) {
      return Response.json(
        { error: 'Invalid API key. Get a free key at newsapi.org' },
        { status: 401 }
      );
    }
    if (response.status === 429) {
      return Response.json(
        { error: 'NewsAPI rate limit reached. Try again later.' },
        { status: 429 }
      );
    }
    if (!response.ok) {
      throw new Error(`NewsAPI responded with ${response.status}`);
    }

    const data = await response.json();
    const enriched = enrichArticles(data.articles || []);

    const sentimentSummary = enriched.reduce(
      (acc, a) => { acc[a.sentiment.label]++; return acc; },
      { Positive: 0, Neutral: 0, Negative: 0 }
    );

    return Response.json({
      articles: enriched,
      totalResults: data.totalResults,
      sentimentSummary,
      category,
      query: q,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('NewsAPI error:', err.message);
    return Response.json(
      { error: 'Failed to fetch news. Please try again.' },
      { status: 500 }
    );
  }
};

export const config = {
  path: '/api/news',
};
