import React, { Fragment, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';

import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './Home.css';
import { DetectMobile } from '../../helpers/Window_Helper';

//lazy-loaded components
const BoroughMap = lazy(() => import('../Borough_Map/Borough_Map').then(module => ({ default: module.BoroughMap })));

export const Home = () => {
  const isMobile = DetectMobile();
  return (
      <Fragment>
        <div className="Home">
          <header className="Home-header">
            <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
              <h1> 
                nyc restaurant info
                <img alt="working trademark" className="tm" src={require("../../helpers/tm.png")} />
              </h1>
            </Link>
          </header>
          {isMobile 
          ?<p className="mobile-sub-header">Explore NYC Restaurant Grades and Health Reports</p>
          :<p className="sub-header">Explore NYC Restaurant Grades and Health Reports</p>}
          <Suspense fallback={<Loader
            type="ThreeDots"
            color="#d3d3d3"
            height={100}
            width={100} 
          />}>
            <BoroughMap />
          </Suspense>
        </div>
      </Fragment>
  );
}
