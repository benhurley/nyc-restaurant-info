import React from 'react';
import './Location.css';
import { Search } from '../Search/Search';
import { Link } from 'react-router-dom';


export const Location = (props) => {
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
          <Search location={location}/>
        </div>
      </div>
  );
}
