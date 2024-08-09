import React from 'react';
import MovieCard from '../MovieCard/MovieCard';

const MoviesRender = ({ moviesArray, guestId, rateMovie, allRatedMovies }) => {
    const checkSelfRating = (ratedMovies, id) => {
      const selfRating = ratedMovies && ratedMovies.find((ratedMovie) => ratedMovie.id === id)?.rating;
      return selfRating ? selfRating : 0;
    };
  
    return (
      <>
        {moviesArray &&
          moviesArray.map(({ genre_ids, id, title, rating, overview, release_date, vote_average, poster_path }) => (
            <MovieCard
              key={id}
              movieId={id}
              guestId={guestId}
              movieGenres={genre_ids}
              title={title}
              releaseDate={release_date}
              rating={vote_average}
              poster={poster_path}
              description={overview}
              addRating={rateMovie}
              selfRating={rating ? rating : checkSelfRating(allRatedMovies, id)}
            />
          ))}
      </>
    );
  };
  
  export default MoviesRender;