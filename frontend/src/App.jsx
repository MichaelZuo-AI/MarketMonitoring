import { useState, useEffect } from 'react'
import { fetchNews, summarizeArticle, fetchConfig } from './api'
import { Loader2, Newspaper, RefreshCcw, Sparkles, Cpu } from 'lucide-react'

const CATEGORIES = ["All", "Global Markets", "Technology", "Geopolitics", "Crypto", "Startups"]

export default function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState({})
  const [summarizing, setSummarizing] = useState({})
  const [language, setLanguage] = useState("English")
  const [category, setCategory] = useState("All")
  const [modelName, setModelName] = useState("")

  useEffect(() => {
    loadConfig()
  }, [])

  useEffect(() => {
    loadNews()
  }, [category, language])

  const loadConfig = async () => {
    try {
      const config = await fetchConfig()
      setModelName(config.model)
    } catch (error) {
      console.error("Failed to load config", error)
    }
  }

  const loadNews = async () => {
    setLoading(true)
    try {
      const data = await fetchNews(category, language)
      setArticles(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async (articleLink, text) => {
    if (!text) return;
    const key = `${articleLink}-${language}`
    setSummarizing(prev => ({ ...prev, [key]: true }))
    try {
      const data = await summarizeArticle(text, language)
      setSummaries(prev => ({ ...prev, [key]: data.summary }))
    } catch (error) {
      console.error(error)
    } finally {
      setSummarizing(prev => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        {/* Header */}
        <header className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg shadow-purple-500/10">
                <Newspaper className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200">
                  World News Brief
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-slate-400 text-sm mt-1">Global headlines, summarized by AI.</p>
                  {modelName && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">
                      <Cpu className="w-3 h-3" />
                      {modelName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <div className="flex bg-black/20 backdrop-blur-md border border-white/5 rounded-full p-1">
                <button
                  onClick={() => setLanguage("English")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${language === "English" ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-slate-200"}`}
                >
                  🇺🇸 En
                </button>
                <button
                  onClick={() => setLanguage("Chinese")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${language === "Chinese" ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-slate-200"}`}
                >
                  🇨🇳 中
                </button>
              </div>

              <button
                onClick={loadNews}
                className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-md"
                title="Refresh News"
              >
                <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 gap-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${category === cat
                  ? "bg-blue-600/20 text-blue-200 border-blue-500/30 shadow-lg shadow-blue-900/20 backdrop-blur-xl"
                  : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin" />
            </div>
            <p className="text-slate-500 animate-pulse">Fetching latest stories...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {articles.map((article, idx) => {
              const summaryKey = `${article.link}-${language}`;
              return (
                // Card Component
                <div key={idx} className="group relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                  {/* Source & Date */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-200 border border-blue-500/20">
                      {article.source}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(article.published).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-100 mb-3 leading-snug group-hover:text-blue-200 transition-colors">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                      {article.title}
                    </a>
                  </h2>

                  <div className="flex-1" /> {/* Spacer to push bottom content */}

                  {/* Summary Area */}
                  {summaries[summaryKey] ? (
                    <div className="relative z-10 mt-6 p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 backdrop-blur-md animate-fade-in-up">
                      <div className="flex items-center gap-2 mb-3 text-blue-300 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        {language === "Chinese" ? "AI 摘要 (Gemini)" : "AI Summary (Gemini)"}
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed antialiased">
                        {summaries[summaryKey]}
                      </p>
                    </div>
                  ) : (
                    <div className="relative z-10 mt-6 pt-2 border-t border-white/5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSummarize(article.link, article.summary_raw || article.title);
                        }}
                        disabled={summarizing[summaryKey]}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/btn"
                      >
                        {summarizing[summaryKey] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                            <span className="text-blue-200">{language === "Chinese" ? "思考中..." : "Analyzing..."}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-purple-400 group-hover/btn:text-purple-300 transition-colors" />
                            <span>{language === "Chinese" ? "生成 AI 摘要" : "Generate AI Summary"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
