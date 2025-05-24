import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Filter from '../components/Filter';
import Sort from '../components/Sort';
import MovieList from '../components/MovieList';
import '../css/HomePage.css'
import Search from '../components/Search';

function HomePage() {
  const [filters, setFilters] = useState({ genres: [], languages: [], years: [] });
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch filter options once on mount
    axios.get('http://localhost:5000/api/movies/filters')
      .then(res => {
        // Sort years ascending just in case
        const sortedYears = res.data.years.sort((a, b) => a - b);
        setFilters({
          genres: res.data.genres,
          languages: res.data.languages,
          years: sortedYears,
        });
      })
      .catch(err => console.error('Error fetching filters:', err));
  }, []);

  useEffect(() => {
    // Fetch movies whenever filters or sort changes
    const params = {};
    if (selectedGenre) params.genre = selectedGenre;
    if (selectedLanguage) params.language = selectedLanguage;
    if (selectedYear) params.year = selectedYear;
    if (sortOption) params.sort = sortOption;

    axios.get('http://localhost:5000/api/movies', { params })
      .then(res => setMovies(res.data))
      .catch(err => console.error('Error fetching movies:', err));
  }, [selectedGenre, selectedLanguage, selectedYear, sortOption]);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      

      <main>
        <div>
          <Search></Search>
        </div>
        <div className="filterSorting">
  <div className="filterGroup">
    <Filter
      filters={filters}
      selectedGenre={selectedGenre}
      setSelectedGenre={setSelectedGenre}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
    />
  </div>
  <div className="sortGroup">
    <Sort sortOption={sortOption} setSortOption={setSortOption} />
  </div>
</div>


        <h2>All Movies</h2>
        <MovieList movies={movies} />
      </main>
    </div>
  );
}

export default HomePage;