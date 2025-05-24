import React from 'react';

function Filter({
  selectedGenre, setSelectedGenre
}) {
  return (
    <nav style={{ display: 'flex', gap: '1rem' }}>
      {/* Genre Filter */}
      <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
        <option value="">All Genres</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Drama">Drama</option>
        <option value="Comedy">Comedy</option>
        <option value="Action">Action</option>
        <option value="Other">Other</option>
      </select>
    </nav>
  );
}

export default Filter;