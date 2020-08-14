import React from 'react';
import './Search.css';
import { Link } from 'react-router-dom';
import { RestaurantSearch } from './RestaurantSearch';

export const Search = (props) => {
    const {location} = props.match.params

  return (
      <div className="Home">
        <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> Food Feels </h1>
          </Link>
        </header>
        <p>Location: <b>{location}</b></p>
        <div className="searchBar">
          <RestaurantSearch location={location}/>
        </div>
      </div>
  );
}
