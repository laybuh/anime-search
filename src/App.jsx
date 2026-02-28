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
      `https://api.jikan.moe/v4/anime?q=${keyword}&type=${animeType}&min_score=${minScore}&limit=20`
    )
    const animeData = await response.json()
    setResults(animeData.data)
    setLoadingState(false)
  }

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
        <button type="submit">Search</button>
      </form>
    </div>
  )
}

export default App