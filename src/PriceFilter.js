import React, { useState } from 'react';
import { URL } from './App';

function PriceFilter({ onFilterChange, setError }) {
  const [price, setPrice] = useState('');

  const handlePriceChange = event => {
    setPrice(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth': localStorage.getItem('xAuth')
        },
        body: JSON.stringify({
          action: 'filter',
          params: { price: parseFloat(price) }
        })
      });

      if (response.ok) {
        const data = await response.json();
        onFilterChange(data.result);
        setPrice('');
      } else {
        throw new Error('Failed to fetch filtered items');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); 
    }
  };

  return (
    <div className="price-filter">
      <form className='price-form' onSubmit={handleSubmit}>
        <label htmlFor="price">Filter by Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handlePriceChange}
          placeholder="Enter price"
        />
        <button className='submit' type="submit">Filter</button>
      </form>
    </div>
  );
}

export default PriceFilter;