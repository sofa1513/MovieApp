import React from "react";
import { Spin, Alert, Pagination, ConfigProvider } from "antd";
import MoviesList from "../MoviesList/MoviesList";


const RatedTab = ({
  isFetching,
  isError,
  errorMessage,
  defaultErrorMessage,
  totalRatedResults,
  ratedMovies,
  renderMovies,
  getRatedMoviesFromPage,
  currentPage,
  setCurrentPage
}) => {
  return (
    
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
   
  )
}

export default RatedTab