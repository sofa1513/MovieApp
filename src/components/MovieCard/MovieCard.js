

import React, { useEffect, useRef } from 'react'
import { Rate } from 'antd'
import { format } from 'date-fns'
import { getDescriptionText } from '../../utils/utils'
import { GenresConsumer } from '../../contexts/genresContext'
import './MovieCard.css'
import noImage from './no-image.jpg'

const MovieCard = ({ movieId, selfRating, guestId, description, movieGenres, title, releaseDate, addRating, poster, rating }) => {
  const descriptionRef = useRef(null)

  useEffect(() => {
    getDescriptionText(descriptionRef.current)
  }, [])

  return (
    <GenresConsumer>
      {(genres) => (
        <li className="movies-item">
          <div className="movie">
            <div className="movie__img-wrapper">
              <img className="movie__img" src={poster ? `https://image.tmdb.org/t/p/original${poster}` : noImage} />
            </div>
            <div className="movie__header">
              <h2 className="movie__title">{title}</h2>
              <p className="movie__released">{releaseDate && format(new Date(releaseDate), 'MMMM d, yyyy')}</p>
              <ul className="movie__genres-list">
                {movieGenres &&
                  movieGenres.map((genreId, idx) => (
                    <li key={idx} className="movie__genre">
                      <span>{genres && genres.find(({ id }) => id === genreId).name}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="movie__description-container">
              <p ref={descriptionRef} className="movie__description">
                {description}
              </p>
            </div>
            <div className="movie__rate">
              <Rate
                count={10}
                defaultValue={selfRating}
                allowHalf={true}
                onChange={async (value) => {
                  await addRating(movieId, guestId, value)
                }}
              />
            </div>
            <span className={`movie__rating movie__rating--value--${rating >= 7 ? 'excellent' : rating >= 5 ? 'good' : rating >= 3 ? 'medium' : 'low'}`}>
              {rating.toFixed(1)}
            </span>
          </div>
        </li>
      )}
    </GenresConsumer>
  )
}

export default MovieCard
