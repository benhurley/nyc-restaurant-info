import React, { Fragment } from 'react';
import { LocationSearchBar } from '../Search_Bars/Location_Search_Bar';
import { AdBanner } from '../Banners/Ad_Banner';
import { Link } from 'react-router-dom'
import './Home.css';

export const Home = () => {
  return (
    <Fragment>
      <AdBanner />
      <div className="Home">
         <header className="Home-header">
          <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
            <h1> nyc restaurant info™ </h1>
          </Link>
        </header>
        <p className="topText">near-real-time outdoor dining information during covid-19*</p>
        <div className="searchBar">
          <LocationSearchBar/>
        </div>
      </div> 
    </Fragment>
  );
}
