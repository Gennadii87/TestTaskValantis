import React, { useState, useEffect } from 'react';

function BrandFilter({ onFilterChange, items, currentPage }) {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    if (items && items.length > 0) {
      const uniqueBrands = [...new Set(items.map(item => item.brand))];
      const filteredBrands = uniqueBrands.filter(brand => brand); // Фильтруем пустые бренды
      setBrands(filteredBrands);
    }
  }, [items]);

  useEffect(() => {
    setSelectedBrand('');
  }, [currentPage]);

  const handleBrandChange = event => {
    setSelectedBrand(event.target.value);
    onFilterChange(event.target.value);
  };

  return (
    <div className="brand-filter">
      <label htmlFor="brand">Brand:</label>
      <select id="brand" value={selectedBrand} onChange={handleBrandChange}>
        <option key="all" value="">
          All
        </option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BrandFilter;
