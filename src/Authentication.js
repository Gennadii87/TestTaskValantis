import React, { useState } from 'react';
import './Authentication.css';
import CryptoJS from 'crypto-js';

function Authentication({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const correctPassword = 'Valantis'; 

  const generateXAuth = (password, timestamp) => {
    const stringToHash = `${password}_${timestamp}`;
    return CryptoJS.MD5(stringToHash).toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const xAuth = generateXAuth(password, currentDate);

    if (password === correctPassword) {
      onLogin(xAuth);
    } else {
      setError('Неверный пароль. Введите верный пароль!');
    }
  };

  return (
    <div className="Authentication">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Authentication;
