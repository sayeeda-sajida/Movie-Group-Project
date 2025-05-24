import React from 'react';

function Sort({ sortOption, setSortOption }) {
  return (
    <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
  <option value="">Sort By</option>
  <option value="titleAsc">Title (A-Z)</option>       {/* Changed */}
  <option value="titleDesc">Title (Z-A)</option>      {/* Changed */}
   <option value = "yearAsc">Year Ascending</option>
   <option value = "yearDesc">Year Descending</option>
     {/* Add this */}
</select>

  );
}

export default Sort;