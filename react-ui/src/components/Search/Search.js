import React from 'react';
import './Search.css';
import { SearchBar } from '../Search_Bar/Search_Bar';
import { Link } from 'react-router-dom'

export const Search = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> Food Feels </h1>
          </Link>
        </header>
        <p className="topText">Take the restaurant home with you!</p>
        <div className="bottomText">
          Whether it's date night, a family meal, 
          or if your city closed indoor dining in the wake of Covid-19, 
          Food Feels helps you replicate your favorite restaurant's 
          experience at home.
        </div>
        <div className="searchBar">
          <SearchBar/>
        </div>
      </div>
  );
}
