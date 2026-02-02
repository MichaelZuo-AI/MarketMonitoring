export const fetchNews = async (category = "All", language = "English") => {
    const params = new URLSearchParams({ category, language });
    const response = await fetch(`/api/news?${params}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
};

export const summarizeArticle = async (text, language = "English") => {
    const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
    });
    if (!response.ok) throw new Error('Failed to summarize');
    return response.json();
};

export const fetchConfig = async () => {
    const response = await fetch('/api/config');
    if (!response.ok) throw new Error('Failed to fetch config');
    return response.json();
};
