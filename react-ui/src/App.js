import React, { Fragment } from 'react';
import HomePage from "./components/Home-page/Home-page";
import RestaurantInfo from './components/Restaurant-info/Restaurant-info';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NewRestaurant from './components/New-Restaurant/New-Restaurant';

function App() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route path="/restaurant" component={RestaurantInfo}/>
      <Route path="/add" component={NewRestaurant}/>
    </Router>
  );

}

export default App;
