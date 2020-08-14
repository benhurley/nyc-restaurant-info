import React from 'react';
import { HomePage } from "./components/Homepage/Homepage";
import { RestaurantInfo } from './components/Info/RestaurantInfo';
import { NewRestaurant } from './components/New/NewRestaurant';
import { Search } from './components/Search/Search';
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
        <Route exact path="/restaurants/location/:location" component={Search}/>
        <Route path="/add" component={NewRestaurant}/>
      </Switch>
    </Router>
  );

}

export default App;
