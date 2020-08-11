import React, { useCallback, useEffect, useState, Fragment } from 'react';
import './Home-page.css';
import Search from '../Search/Search';

export default function HomePage() {
    return (
        <div className="Home">
          <header className="Home-header">
            <h1> Food Feels </h1>
            { process.env.NODE_ENV === 'production' 
              ? <p> Website coming soon! </p>
              : <p> This is the developer-mode of Food Feels. </p>
            }
            <Search />
          </header>
        </div>
    );
}
