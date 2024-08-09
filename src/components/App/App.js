
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import './App.css';
import api from '../../servers/api';
import { debounce } from '../../utils/utils';
import RatedTab from '../RatedTab/RatedTab';
import SearchTab from '../SearchTab/SearchTab';
import MoviesRender from '../MoviesRender/MoviesRender'; 
import { GenresProvider } from '../../contexts/genresContext'; 

const App = () => {
  const [guestId, setGuestId] = useState(JSON.parse(localStorage.getItem('guestId')));
  const [searchedMovies, setSearchedMovies] = useState(null);
  const [ratedMovies, setRatedMovies] = useState(null);
  const [allRatedMovies, setAllRatedMovies] = useState(null);
  const [genresContext, setGenresContext] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [totalRatedPages, setTotalRatedPages] = useState(null);
  const [totalRatedResults, setTotalRatedResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const defaultErrorMessage = 'Произошла ошибка во время поиска.\nПожалуйста, попробуйте перезагрузить страницу.';

  const searchMovies = debounce(async (evt) => {
    setSearchQuery(evt.target.value);
    if (evt.target.value !== '') {
      try {
        setIsFetching(true);
        const { results, total_results } = await api.getSearchedMovies(evt.target.value);
        setSearchedMovies(results);
        setTotalResults(total_results === 0 ? null : total_results);
        setIsError(false);
        window.scroll(0, 0);
      } catch (err) {
        console.error(err);
        setIsError(true);
        setErrorMessage(err.status_message);
      } finally {
        setIsFetching(false);
      }
    }
  }, 1000);

  const getMoviesFromPage = async (pageNumber) => {
    setIsFetching(true);
    window.scroll(0, 0);
    try {
      const { results } = await api.getPaginationMovies(searchQuery, pageNumber);
      setSearchedMovies(results);
    } catch (err) {
      const error = await err.json();
      console.error(error);
      setIsError(true);
      setErrorMessage(error.status_message);
    } finally {
      setIsFetching(false);
    }
  };

  const getRatedMoviesFromPage = async (pageNumber) => {
    if (pageNumber > totalRatedPages) {
      console.warn('Запрошена страница, которая превышает общее количество страниц.');
      return;
    }
    
    setIsFetching(true);
    window.scroll(0, 0);
    setCurrentPage(pageNumber);
    
    try {
      const { results } = await api.getRatedMoviesFromPage(guestId, pageNumber);
      setRatedMovies(results);
      setIsError(false);
    } catch (err) {
      console.error('Ошибка при получении данных:', err);
      setIsError(true);
      setErrorMessage(err.status_message || 'Произошла ошибка при получении данных.');
    } finally {
      setIsFetching(false);
    }
  };

  const setRatedMoviesHandler = async () => {
    try {
      const { results, total_pages, total_results } = await api.getRatedMovies(guestId);
      setRatedMovies(results);
      setTotalRatedPages(total_pages);
      setAllRatedMovies(results);
      setTotalRatedResults(total_results);
      if (total_pages > 1) getAllRatedMovies(2);
    } catch (err) {
      const error = await err.json();
      console.error(error);
      if (error.status_code !== 34) {
        setIsError(true);
        setErrorMessage(err.message);
      }
    }
  };

  const getAllRatedMovies = async (pageNumber) => {
    if (pageNumber <= totalRatedPages) {
      const { results } = await api.getRatedMoviesFromPage(guestId, pageNumber);
      setAllRatedMovies((prev) => [...prev, ...results]);
      getAllRatedMovies(pageNumber + 1);
    }
  };

  const rateMovie = async (movieId, guestId, value) => {
    try {
      const { success } = await api.addRating(movieId, guestId, value);
      if (success) {
        setTimeout(async () => await setRatedMoviesHandler(), 1000);
      }
    } catch (err) {
      const error = await err.json();
      console.error(error);
      setIsError(true);
      setErrorMessage(error.status_message);
    }
  };

  useEffect(() => {
    if (guestId === null) {
      const fetchGuestId = async () => {
        try {
          const { guest_session_id } = await api.getGuestId();
          localStorage.setItem('guestId', JSON.stringify(guest_session_id));
          setGuestId(guest_session_id);
        } catch (err) {
          const error = await err.json();
          console.error(error);
          setIsError(true);
          setErrorMessage(error.status_message);
        }
      };
      fetchGuestId();
    }
    if (guestId !== null) setRatedMoviesHandler();
    const fetchGenres = async () => {
      try {
        const { genres } = await api.getGenres();
        setGenresContext(genres);
      } catch (err) {
        const error = await err.json();
        console.error(error);
        setIsError(true);
        setErrorMessage(error.status_message);
      }
    };
    fetchGenres();
  }, [guestId]);

  return (
    <GenresProvider value={genresContext}>
    <Tabs
      defaultActiveKey="search"
      centered={true}
      items={[
        {
          key: 'search',
          label: 'Search',
          children: (
            <SearchTab 
              searchMovies={searchMovies}
              isFetching={isFetching}
              isError={isError}
              errorMessage={errorMessage}
              defaultErrorMessage={defaultErrorMessage}
              totalResults={totalResults}
              searchedMovies={searchedMovies}
              searchQuery={searchQuery}
              renderMovies={() => (
                <MoviesRender
                  moviesArray={searchedMovies}
                  guestId={guestId}
                  rateMovie={rateMovie}
                  allRatedMovies={allRatedMovies}
                />
              )}
              getMoviesFromPage={getMoviesFromPage}
              genresContext={genresContext}
              guestId={guestId}
              rateMovie={rateMovie}
              allRatedMovies={allRatedMovies}
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage}
            />
          ),
        },
        {
          key: 'rated',
          label: 'Rated',
          children: (
            <RatedTab
              isFetching={isFetching}
              isError={isError}
              errorMessage={errorMessage}
              defaultErrorMessage={defaultErrorMessage}
              totalRatedResults={totalRatedResults}
              ratedMovies={ratedMovies}
              renderMovies={() => (
                <MoviesRender
                  moviesArray={ratedMovies}
                  guestId={guestId}
                  rateMovie={rateMovie}
                  allRatedMovies={allRatedMovies}
                />
              )}
              getRatedMoviesFromPage={getRatedMoviesFromPage}
              genresContext={genresContext}
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage}
            />
          ),
        },
      ]}
      onChange={() => {}}
    />
    </GenresProvider>
  );
};

export default App;
