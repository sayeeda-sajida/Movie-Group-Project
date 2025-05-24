import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const resultsRef = useRef([]);
  const navigate = useNavigate();

  const fetchMovies = async (value) => {
    if (value.trim() === '') {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/movies?q=${value}`);
      if (res.data.length === 0) {
        setResults([{ id: null, title: 'No movie found', genre: '' }]);
      } else {
        setResults(res.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setResults([{ id: null, title: 'Error fetching data', genre: '' }]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1); // Reset active index on new input
    fetchMovies(value);
  };

  const handleMovieClick = (id) => {
    if (id) {
      navigate(`/movies/${id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && activeIndex !== -1) {
      const selected = results[activeIndex];
      if (selected.id) {
        navigate(`/movies/${selected.id}`);
      }
    }
  };

  useEffect(() => {
    if (activeIndex !== -1 && resultsRef.current[activeIndex]) {
      resultsRef.current[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <div className="container">
    <input
  type="text"
  className="search-input"
  placeholder="Search by title or genre..."
  value={query}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  aria-label="Search movies by title or genre"
  role="combobox"
  aria-expanded={results.length > 0}
  aria-controls="search-results"
  aria-autocomplete="list"
/>
<div
  id="search-results"
  className="results-container"
  role="listbox"
  aria-label="Search suggestions"
></div>

      {results.length > 0 && (
        <div
          className="results-container"
          role="listbox"
          aria-label="Search suggestions"
        >
          {results.map((movie, index) => (
            <div
              key={index}
              ref={(el) => (resultsRef.current[index] = el)}
              onClick={() => handleMovieClick(movie.id)}
              tabIndex="0"
              role="option"
              aria-selected={activeIndex === index}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMovieClick(movie.id);
                }
              }}
              className={activeIndex === index ? 'active-suggestion' : ''}
              style={{ cursor: movie.id ? 'pointer' : 'default' }}
            >
              <strong>{movie.title}</strong>
              {movie.genre && <span className="genre"> ({movie.genre})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;