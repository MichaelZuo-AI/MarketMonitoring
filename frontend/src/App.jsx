import { useState, useEffect } from 'react'
import { fetchNews, summarizeArticle } from './api'
import { Loader2, Newspaper, RefreshCcw, Sparkles } from 'lucide-react'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState({})
  const [summarizing, setSummarizing] = useState({})

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const data = await fetchNews()
      setArticles(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async (articleIndex, text) => {
    if (!text) return;
    setSummarizing(prev => ({ ...prev, [articleIndex]: true }))
    try {
      const data = await summarizeArticle(text)
      setSummaries(prev => ({ ...prev, [articleIndex]: data.summary }))
    } catch (error) {
      console.error(error)
    } finally {
      setSummarizing(prev => ({ ...prev, [articleIndex]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">World News Brief</h1>
          </div>
          <button
            onClick={loadNews}
            className="p-2 text-slate-500 hover:text-blue-600 transition"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {article.source}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2 mb-3 leading-tight">
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                        {article.title}
                      </a>
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">
                      {new Date(article.published).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {summaries[idx] ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-2">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Summary</span>
                    </div>
                    <p className="text-indigo-900 text-sm leading-relaxed">
                      {summaries[idx]}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button
                      onClick={() => handleSummarize(idx, article.summary_raw || article.title)}
                      disabled={summarizing[idx]}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition bg-slate-50 hover:bg-white px-4 py-2 rounded-lg border border-transparent hover:border-slate-200"
                    >
                      {summarizing[idx] ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Summarize with AI
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
