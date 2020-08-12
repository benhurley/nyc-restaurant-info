import React from 'react';
import HomePage from "./components/Home-page/Home-page";
import { RestaurantInfo } from './components/Restaurant-info/Restaurant-info';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { NewRestaurant } from './components/New-Restaurant/New-Restaurant';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/restaurant/:id" component={RestaurantInfo}/>
        <Route path="/add" component={NewRestaurant}/>
      </Switch>
    </Router>
  );

}

export default App;
