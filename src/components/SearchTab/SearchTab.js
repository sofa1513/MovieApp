import React from 'react'
import { Spin, Alert, Pagination, ConfigProvider } from 'antd'
import { GenresProvider } from '../../contexts/genresContext'
import SearchMovie from '../SearchMovie/SearchMovie'
import MoviesList from '../MoviesList/MoviesList'


const SearchTab = ({
  searchMovies,
  isFetching,
  isError,
  errorMessage,
  defaultErrorMessage,
  totalResults,
  searchedMovies,
  searchQuery,
  renderMovies,
  getMoviesFromPage,
  genresContext,
  currentPage,
  setCurrentPage
}) => {
  return (
  <GenresProvider value={genresContext}>
  <main>
    <SearchMovie searchMovies={searchMovies} />
    <div className="movies-wrapper">
      {isFetching ? (
        <Spin size="large" />
      ) : isError ? (
        <Alert type="error" message={errorMessage ? errorMessage : defaultErrorMessage} />
      ) : totalResults ? (
        <MoviesList>{renderMovies(searchedMovies)}</MoviesList>
      ) : (
        searchQuery && <Alert type="info" message="Поиск не дал результатов" />
      )}
    </div>
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveBg: '#1677ff',
          },
        },
      }}
    >
      {totalResults && (
       <Pagination
       current={currentPage}
       onChange={(page) => {
         setCurrentPage(page);
         getMoviesFromPage(page);
       }}
       defaultCurrent={1}
       total={totalResults}
       pageSize={20}
       showSizeChanger={false}
     />
      )}
    </ConfigProvider>
  </main>
</GenresProvider>
  )

}

export default SearchTab