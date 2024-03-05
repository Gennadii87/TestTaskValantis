import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Authentication from './Authentication';
import fetch from 'node-fetch';
import BrandFilter from './BrandFilter';
import PriceFilter from './PriceFilter'; 
import NameFilter from './NameFilter'; 
import LoadingDots from './LoadingDots';

export const URL = 'http://api.valantis.store:40000/';

function App() {
  const [itemIds, setItemIds] = useState([]);
  const [itemsInfo, setItemsInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(50);
  const [xAuth, setXAuth] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');
  const [items, setItems] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
 
  const fetchItemIds = useCallback(async () => {
    try {
      const idsResponse = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth': xAuth
        },
        body: JSON.stringify({
          action: 'get_ids',
          params: {
            offset: (currentPage - 1) * perPage,
            limit: perPage
          }
        })
      });

      if (idsResponse.ok) {
        const idsData = await idsResponse.json();
        const ids = idsData.result;
        setItemIds(ids);
      } else {
        throw new Error('Failed to fetch item IDs');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  }, [currentPage, perPage, xAuth]);

  const fetchItemsInfo = useCallback(async () => {
    try {
      const itemsResponse = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth': xAuth
        },
        body: JSON.stringify({
          action: 'get_items',
          params: {
            ids: itemIds
          }
        })
      });

      const itemsData = await itemsResponse.json();

      const uniqueItems = {};
      itemsData.result.forEach(item => {
        if (!uniqueItems[item.id]) {
          uniqueItems[item.id] = item;
        }
      });

      const uniqueItemsArray = Object.values(uniqueItems);
      setItemsInfo(uniqueItemsArray);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [itemIds, xAuth]);

  useEffect(() => {
    const storedXAuth = localStorage.getItem('xAuth');
    if (storedXAuth) {
      setXAuth(storedXAuth);
    }
  }, []);

  useEffect(() => {
    if (xAuth) {
      fetchItemIds();
    }
  }, [currentPage, xAuth, fetchItemIds]);

  useEffect(() => {
    if (xAuth && itemIds.length > 0) {
      setLoading(true);
      fetchItemsInfo();
    }
  }, [itemIds, xAuth, fetchItemsInfo]);

  useEffect(() => {
    setItems(itemsInfo);
  }, [itemsInfo]);

  const handleLogin = (xAuth) => {
    setXAuth(xAuth);
    localStorage.setItem('xAuth', xAuth);
  };

  const handleLogout = () => {
    setXAuth('');
    localStorage.removeItem('xAuth');
    setItemIds([]);
    setItemsInfo([]);
  };

  const handlePagination = async (newPage) => {
    setCurrentPage(newPage);
    setBrandFilter(''); 
    setError('');
    setLoading(true);
  };

  const handleFilterChange = (brand) => {
    setBrandFilter(brand);
  };

  const handleFilterByNameChange = (name) => {
    setNameFilter(name);
  };

  const filteredItems = items.filter(item => 
    (brandFilter === '' || item.brand === brandFilter) &&
    (nameFilter === '' || item.product.toLowerCase().includes(nameFilter.toLowerCase()))
  );

  const handlePriceFilterChange = async (filteredItemIds) => {
    try {
      setLoading(true);
      const itemsResponse = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth': xAuth
        },
        body: JSON.stringify({
          action: 'get_items',
          params: {
            ids: filteredItemIds
          }
        })
      });

      const itemsData = await itemsResponse.json();

      const uniqueItems = {};
      itemsData.result.forEach(item => {
        if (!uniqueItems[item.id]) {
          uniqueItems[item.id] = item;
        }
      });

      const uniqueItemsArray = Object.values(uniqueItems);
      setItemsInfo(uniqueItemsArray);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Product List</h1>
      {xAuth ? (
        <div>
          <button className='click' onClick={handleLogout}>Logout</button>
          {error && <pre><div className="error">{error}</div></pre>}
          <div className='filters'>
            <PriceFilter onFilterChange={handlePriceFilterChange} setError={setError} />
            <BrandFilter onFilterChange={handleFilterChange} items={items} />
            <NameFilter onFilterChange={handleFilterByNameChange} />
          </div>
          <div className="item-ids">
            <div className="pagination">
              <button className='click' onClick={() => handlePagination(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Prev</button>
              <span>{currentPage}</span>
              <button className='click' onClick={() => handlePagination(currentPage + 1)}>Next</button>
            </div>
            <h2>Item</h2>
            {loading ? (
              <LoadingDots />
            ) : (
              <table className="table-container">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.product}</td>
                      <td>{item.price}</td>
                      <td>{item.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="pagination">
            <button className='click' onClick={() => handlePagination(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage}</span>
            <button className='click' onClick={() => handlePagination(currentPage + 1)}>Next</button>
          </div>
        </div>
      ) : (
        <Authentication onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
