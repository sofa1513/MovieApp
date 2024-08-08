
import React from 'react'
import './SearchMovie.css'

const SearchMovie = ({ searchMovies }) => {
  return <input onChange={searchMovies} type="text" className="search" placeholder="Type to search..." />
}

export default SearchMovie
