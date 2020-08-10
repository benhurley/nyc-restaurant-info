import React, { Fragment } from 'react';
import './App.css';
import HomePage from "./components/Home-page/Home-page";
import RestaurantInfo from './components/Restaurant-info/Restaurant-info';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route path="/restaurant" component={RestaurantInfo}/>
    </Router>
  );

}

export default App;
