export default async () => {
  return Response.json([
    { id: 'general', label: 'General', icon: '🌍' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'business', label: 'Business', icon: '📈' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  ]);
};

export const config = {
  path: '/api/categories',
};
