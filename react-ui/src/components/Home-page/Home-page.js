import React from 'react';
import './Home-page.css';
import { Search } from '../Search/Search';

export const HomePage = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <h1> Food Feels </h1>
        </header>
        <p className="topText">Bring the restaurant experience home!</p>
        <p className="bottomText">Search for your favorite restaurant to get information on how to replicate their experience during your takeout meal.</p>
        <div className="searchBar">
          <Search />
        </div>
      </div>
  );
}
