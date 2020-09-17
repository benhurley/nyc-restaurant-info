import React, { Fragment } from 'react';
import { Home } from './components/Home/Home';
import { RestaurantDeatil } from './components/Restaurant_Detail/Restaurant_Detail';
import { Browse } from './components/Browse/Browse';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/location/:borough" component={Browse} />
          <Route exact path="/restaurant/:restaurantname" component={RestaurantDeatil}/>
        </Switch>
      </Fragment>
    </Router>
  );

}

export default App;
