import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MovieList.css';

function MovieList({ movies }) {
  const navigate = useNavigate();

  if (!movies.length) {
    return <p>No movies found.</p>;
  }

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  const renderStars = (rating) => {
    if (!rating || rating <= 0) return 'N/A';
    const fullStars = '⭐'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '✩' : '';
    return fullStars + halfStar;
  };

  return (
    <div className="movieListWrapper">
      <div className="movieList">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movieCard"
            onClick={() => navigate(`/movies/${movie.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/movies/${movie.id}`);
            }}
          >
            <h3 title={movie.title}>{movie.title}</h3>
            <p><strong>Genre:</strong> {capitalize(movie.genre)}</p>
            <p><strong>Year:</strong> {movie.release_year}</p>
            <p><strong>Rating:</strong> {renderStars(movie.rating)}</p>
           
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;