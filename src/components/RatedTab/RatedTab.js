import React from "react";
import { Spin, Alert, Pagination, ConfigProvider } from "antd";
import MoviesList from "../MoviesList/MoviesList";
import { GenresProvider } from "../../contexts/genresContext";

const RatedTab = ({
  isFetching,
  isError,
  errorMessage,
  defaultErrorMessage,
  totalRatedResults,
  ratedMovies,
  renderMovies,
  getRatedMoviesFromPage,
  genresContext,
  currentPage,
  setCurrentPage
}) => {
  return (
    <GenresProvider value={genresContext}>
      <main>
        <div className="movies-wrapper">
          {isFetching ? (
            <Spin size="large" />
          ) : isError ? (
            <Alert type="error" message={errorMessage ? errorMessage : defaultErrorMessage} />
          ) : totalRatedResults ? (
            <MoviesList>{renderMovies(ratedMovies)}</MoviesList>
          ) : (
            <Alert type="info" message="Вы еще не оценили ни одного фильма" />
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
          {totalRatedResults && (
            <Pagination
              current={currentPage}
              onChange={(page) => {
                setCurrentPage(page);
                getRatedMoviesFromPage(page);
              }}
              defaultCurrent={1}
              total={totalRatedResults}
              pageSize={20}
              showSizeChanger={false}
            />
          )} 
        </ConfigProvider>
        </main>
    </GenresProvider>
  )
}

export default RatedTab