export const fetchNews = async () => {
    const response = await fetch('/api/news');
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
};

export const summarizeArticle = async (text) => {
    const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to summarize');
    return response.json();
};
