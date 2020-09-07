import React from 'react';
import './Home.css';
import { LocationSearchBar } from '../Search_Bars/Location_Search_Bar';
import { Link } from 'react-router-dom'

export const Home = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> food feels </h1>
          </Link>
        </header>
        <p className="topText">the semi-official source of nyc outdoor dining information during covid-19</p>
        <div className="searchBar">
          <LocationSearchBar/>
        </div>
        <div className="">
          data updates daily via <a href="https://data.cityofnewyork.us/Transportation/Open-Restaurants-Inspections/4dx7-axux">nyc open data</a>
        </div>
        <div className="footer">
          food feels™ 2020. all rights reserved.
        </div>
      </div>
  );
}
