import { useState,useEffect } from "react";
import {useDebounce} from "react-use";
import Search from "./components/search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { trendingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTION = {
  method: 'GET',
  headers: {
    accept:'application/json',
    Authorization : `Bearer ${API_KEY}`
  }
}


const App = () => {
  const [search , setSearch] = useState('');
  const [erorMessage, setErorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [trendingMovieListe, setTrendingMovieListe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTerms, setDebounceTerms] = useState('');

  useDebounce(function(){setDebounceTerms(search)},500,[search])

  const fetchMovie = async function(query = ''){
    setLoading(true)
    try{
      console.log(query,'this is query')
      const endpoint =  query ? 
       `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTION)
      if(!response.ok){
        throw new Error("Error fetching data from TMDB")
      }

      const data = await response.json()
      console.log(data.results[0])
      setMovieList(data.results || [])
      if(query && data.results.length > 0){
        await updateSearchCount(query,data.results[0])
      }
    }catch(error){
      console.error(`Error fetching data: ${error}`)
      setErorMessage('Error fetching Movies : veuillez verifier la synchronisation')
    }finally{
      setLoading(false)
    }
  }
  const loadTrendingMovies = async function(){
    try{
      const trending = await trendingMovies()
      setTrendingMovieListe(trending)
    }catch(error){
      console.log(error)
    }
  }
  

  useEffect(function(){
    fetchMovie(debounceTerms)
  },[debounceTerms])
  useEffect(function(){
    loadTrendingMovies()
  },[])
  return (
    <main>
      <div className='patterne' />

      <div className='wrapper'>
        <header>
          <img src="./hero-img.png" alt="Hero img" />
          <h1>Trouve tes <span className='text-gradient'>films</span> préférés et passe du bon temps</h1>
          <Search termSearch={search} setTermSearch={setSearch} />
        </header>
        <section className="trending">
          <ul>
            {trendingMovieListe.map(function(movie,index){
              return(
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt="" srcset="" />
                </li>
              )
            })}
          </ul>
        </section>

        <section className="all-movies">
          <h2 >All movies</h2>
          {loading ? ( <Spinner />) : erorMessage ? 
          (<p className="text-red-500">{erorMessage}</p>) : (<ul>
            {movieList.map((movie)=>(
              <MovieCard key={movie.key} movie={movie} />
            ))}
          </ul>)
          }
        </section>
      </div>
    </main>
  )
}
export default App
