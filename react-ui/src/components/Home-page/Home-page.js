import React, { useState, useEffect } from 'react';
import './Home-page.css';
import { Search } from '../Search/Search';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [searchRestaurant, setSearchRestaurant] = useState({});

  useEffect(() => {
    if (searchRestaurant._id) {
      window.location.assign(`${window.location}restaurant/${searchRestaurant._id}`)
    }
  }, [searchRestaurant]);

  return (
      <div className="Home">
        <header className="Home-header">
          <h1> Food Feels </h1>
          { process.env.NODE_ENV === 'production' 
            ? <p> Website coming soon! </p>
            : <p> This is the developer-mode of Food Feels. </p>
          }
          <Search setSearchRestaurant={setSearchRestaurant} />
          <div style={{"marginTop": "150px"}}>
            <Link to='/add'>
              <button>Add New Restaurant</button>
            </Link>
          </div>
        </header>
      </div>
  );
}
