import React, { Fragment } from 'react';
import { Home } from './components/Home/Home';
import { RestaurantDetail } from './components/Restaurant_Detail/Restaurant_Detail';
import { Browse } from './components/Browse/Browse';
import { Footer } from './components/Footer/Footer';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Fragment>
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/location/:borough" component={Browse} />
            <Route exact path="/restaurant/:restaurantname" component={RestaurantDetail}/>
          </Switch>
        </Fragment>
      </Router>
      <Footer />
    </Fragment>
  );

}

export default App;
