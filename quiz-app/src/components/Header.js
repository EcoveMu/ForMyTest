import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="container">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h1>互動式測驗系統</h1>
        </Link>
      </div>
    </header>
  );
}

export default Header; 