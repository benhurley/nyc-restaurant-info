import React from 'react';
import './Home-page.css';
import { Location } from '../Location/Location';

export const HomePage = () => {
  return (
      <div className="Home">
        <header className="Home-header">
          <h1> Food Feels </h1>
        </header>
        <div className="locationBar">
          <Location />
        </div>
      </div>
  );
}
