import React, { Fragment, Suspense, lazy } from 'react';
import { AdBanner } from '../Banners/Ad_Banner';
import { Link } from 'react-router-dom'
import './Home.css';

//lazy-loaded components
const BoroughMap = lazy(() => import('../Borough_Map/Borough_Map').then(module => ({ default: module.BoroughMap })));

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
        <p className="sub-header">near-real-time outdoor dining information during covid-19*</p>
        <Suspense fallback={<div></div>}>
          <BoroughMap />
        </Suspense>
      </div>
    </Fragment>
  );
}
