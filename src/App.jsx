import './App.css'
import { useState } from "react"

function App() {
  const [keyword, setKeyword] = useState("")
  const [genre, setGenre] = useState("")
  const [animeType, setAnimeType] = useState("")
  const [minScore, setMinScore] = useState("")
  const [results, setResults] = useState([])
  const [sortType, setSortType] = useState("")
  const [theme, setTheme] = useState("dark")
  const [loadingState, setLoadingState] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const searchAnime = async (e) => {
    e.preventDefault()
    setLoadingState(true)
    setErrorMessage("")
    setHasSearched(true)

    const delay = (ms) => new Promise((r) => setTimeout(r, ms))

    try {
      const all = []
      const maxPages = 50
      let page = 1

      while (page <= maxPages) {
        let response
        let animeData
        try {
          response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${keyword}&type=${animeType}&min_score=${minScore}&genres=${genre}&limit=25&page=${page}`
          )
          animeData = await response.json()
        } catch {
          break
        }

        if (!response.ok) {
          if (all.length === 0) {
            throw new Error("request failed")
          }
          break
        }

        if (Array.isArray(animeData.data)) all.push(...animeData.data)
        if (!animeData.pagination?.has_next_page) break

        page++
        await delay(400)
      }

      setResults(all)
    } catch {
      setResults([])
      setErrorMessage("MyAnimeList is unavailable right now. Try again in a moment.")
    } finally {
      setLoadingState(false)
    }
  }

  const sortedAnime = [...results].sort((a, b) => {
    if (sortType === "score") return (b.score ?? 0) - (a.score ?? 0)
    if (sortType === "alpha") return (a.title || "").localeCompare(b.title || "")
    return 0
  })

  return (
    <div className={`container ${theme}`}>
      <header className="hero">
        <div className="hero-row">
          <span className="hero-tag">// anime_search</span>
          <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <h1>Anime Search Terminal</h1>
        <p className="hero-intro">
          Welcome to the Anime Search Terminal. Explore thousands of titles by name,
          genre, type, and score, powered by live MyAnimeList data.
        </p>
      </header>

      <form onSubmit={searchAnime} className="search-panel">
        <input
          className="search-input"
          type="text"
          placeholder="Search anime..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select value={animeType} onChange={(e) => setAnimeType(e.target.value)}>
          <option value="">Type</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="special">Special</option>
          <option value="ona">ONA</option>
        </select>

        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Genre</option>
          <option value="1">Action</option>
          <option value="2">Adventure</option>
          <option value="4">Comedy</option>
          <option value="8">Drama</option>
          <option value="10">Fantasy</option>
          <option value="14">Horror</option>
          <option value="22">Romance</option>
          <option value="24">Sci-Fi</option>
          <option value="36">Slice of Life</option>
          <option value="37">Supernatural</option>
        </select>

        <input
          type="number"
          placeholder="Min score"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
          min="1"
          max="10"
        />
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="" disabled hidden>Sort by</option>
          <option value="score">Rating</option>
          <option value="alpha">A-Z</option>
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>

      {loadingState && <p className="status status-loading">Searching…</p>}
      {!loadingState && errorMessage && <p className="status status-error">{errorMessage}</p>}
      {!loadingState && !errorMessage && hasSearched && sortedAnime.length === 0 && (
        <p className="status">No results found. Try a different search.</p>
      )}
      {!loadingState && !errorMessage && sortedAnime.length > 0 && (
        <p className="status">{sortedAnime.length} result{sortedAnime.length !== 1 ? "s" : ""}</p>
      )}

      <div className="results">
        {sortedAnime.map((anime) => (
          <div className="card" key={anime.mal_id}>
            <div className="poster">
              {anime.images?.jpg?.image_url && (
                <img src={anime.images.jpg.image_url} alt={anime.title || "Anime poster"} />
              )}
              {anime.score != null && (
                <span className="score-badge">★ {anime.score}</span>
              )}
              <p className="synopsis">{anime.synopsis || "No synopsis available."}</p>
            </div>
            <div className="card-body">
              <h2>{anime.title || "Untitled"}</h2>
              <div className="meta">
                <span>{anime.type || "—"}</span>
                <span>{anime.episodes ? `${anime.episodes} eps` : "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
