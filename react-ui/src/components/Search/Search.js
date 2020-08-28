import React from 'react';
import './Search.css';
import { LocationSearchBar } from '../Search_Bars/Location_Search_Bar';
import { Link } from 'react-router-dom'

export const Search = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> food feels </h1>
          </Link>
        </header>
        <p className="topText">The official source of nyc dining information during covid-19</p>
        <div className="bottomText">
          select a borough to see nearby restaurants and their outdoor dining statuses (information updates daily)
        </div>
        <div className="searchBar">
          <LocationSearchBar/>
        </div>
      </div>
  );
}
