import React from 'react';
import { HomePage } from "./components/Home-page/Home-page";
import { RestaurantInfo } from './components/Restaurant-info/Restaurant-info';
import { NewRestaurant } from './components/New-Restaurant/New-Restaurant';
import { Location } from './components/Location/Location';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/restaurants/:id" component={RestaurantInfo}/>
        <Route exact path="/restaurants/location/:location" component={Location}/>
        <Route path="/add" component={NewRestaurant}/>
      </Switch>
    </Router>
  );

}

export default App;
