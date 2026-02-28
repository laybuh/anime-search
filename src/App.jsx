import { useState } from "react"

function App() {
  const [keyword, setKeyword] = useState("")
  const [genre, setGenre] = useState("")
  const [animeType, setAnimeType] = useState("")
  const [minScore, setMinScore] = useState("")
  const [results, setResults] = useState([])
  const [sortType, setSortType] = useState("score")
  const [theme, setTheme] = useState("dark")
  const [loadingState, setLoadingState] = useState(false)

  const searchAnime = async (e) => {
    e.preventDefault()
    setLoadingState(true)

    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${keyword}&type=${animeType}&min_score=${minScore}&genres=${genre}&limit=20`
    )
    const animeData = await response.json()
    setResults(animeData.data)
    setLoadingState(false)
  }

  const sortedAnime = [...results].sort((a, b) => {
    if (sortType === "score") return b.score - a.score
    return 0
  })

  return (
    <div className="container">
      <h1>Anime Search</h1>
      <form onSubmit={searchAnime}>
        <input
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
          placeholder="Minimum Score"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
          min="1"
          max="10"
        />
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="score">Sort by Rating</option>
          <option value="default">Relevance</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {loadingState && <p>Searching...</p>}

      <div className="results">
        {sortedAnime.map((anime) => (
          <div className="card" key={anime.mal_id}>
            <img src={anime.images.jpg.image_url} alt={anime.title} />
            <h2>{anime.title}</h2>
            <p>Score: {anime.score}</p>
            <p>Episodes: {anime.episodes}</p>
            <p>{anime.synopsis}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App