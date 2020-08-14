import React from 'react';
import './Home-page.css';
import { Search } from '../Search/Search'
import { LocationSearch } from '../Location-Search/Location-Search';

export const HomePage = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <h1> Food Feels </h1>
        </header>
        <div className="searchBar">
          <Search />
        </div>
        <p>You can also narrow your search by location</p>
        <div className="locationBar">
          <LocationSearch />
        </div>
      </div>
  );
}
