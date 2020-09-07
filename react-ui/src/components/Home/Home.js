import React from 'react';
import { LocationSearchBar } from '../Search_Bars/Location_Search_Bar';
import { Link } from 'react-router-dom'
import './Home.css';

export const Home = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> nyc restaurant info </h1>
          </Link>
        </header>
        <p className="topText">near-real-time outdoor dining information during covid-19</p>
        <div className="searchBar">
          <LocationSearchBar/>
        </div>
        <div className="">
          data updates daily via <a href="https://data.cityofnewyork.us/Transportation/Open-Restaurants-Inspections/4dx7-axux">nyc open data</a>
        </div>
        <div className="footer">
          nyc restaurant info™ 2020, all rights reserved
        </div>
      </div>
  );
}
