import React from 'react';
import './Home-page.css';
import { Link } from 'react-router-dom'
import { LocationSearch } from '../Location-Search/Location-Search';

export const HomePage = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> Food Feels </h1>
          </Link>
        </header>
        <p className="topText">Take the restaurant home with you!</p>
        <p className="bottomText">Whether it's date night, a family meal, or if your city closed indoor dining in the wake of Covid-19, Food Feels helps you replicate your favorite restaurant's experience at home.</p>
        <div className="locationBar">
          <LocationSearch />
        </div>
      </div>
  );
}
