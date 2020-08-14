import React from 'react';
import './Location.css';
import { Search } from '../Search/Search'

export const Location = (props) => {
    const {location} = props.match.params

  return (
      <div className="Home">
        <header className="Home-header">
          <h1> Food Feels </h1>
        </header>
        <div className="searchBar">
          <Search location={location}/>
        </div>
      </div>
  );
}
