import React, { useState } from 'react';

function NameFilter(props) {
  const [nameFilter, setNameFilter] = useState('');

  const handleInputChange = (event) => {
    const { value } = event.target;
    setNameFilter(value);
    props.onFilterChange(value); 
  };

  return (
    <div>
      <label htmlFor="nameFilter">Filter by Name:</label>
      <input
        type="text"
        id="nameFilter"
        value={nameFilter}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default NameFilter;
