import React, { Fragment, Suspense, lazy } from 'react';
import { AdBanner } from '../Banners/Ad_Banner';
import { Link } from 'react-router-dom'
import './Home.css';

//lazy-loaded components
const LocationSearchBar = lazy(() => import('../Search_Bars/Location_Search_Bar').then(module => ({ default: module.LocationSearchBar })));

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
          <Suspense fallback={<div></div>}>
            <LocationSearchBar/>
          </Suspense>
        </div>
      </div>
    </Fragment>
  );
}
