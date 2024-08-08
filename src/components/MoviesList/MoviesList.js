
import React from 'react'
import './MoviesList.css'

const MoviesList = ({ children }) => {
  return <ul className="movies-list">{children}</ul>
}

export default MoviesList
