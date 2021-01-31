import React, { Fragment, Suspense, lazy } from 'react';
import { Home } from './components/Home/Home';
import { RestaurantDetail } from './components/Restaurant_Detail/Restaurant_Detail';
import { Browse } from './components/Browse/Browse';

import { HeatMap } from './components/Heat_Map/Heat_Map'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

//lazy-loaded components
const Footer = lazy(() => import('./components/Footer/Footer').then(module => ({ default: module.Footer })));

function App() {
  return (
    <Fragment>
        <Router>
          <Fragment>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/location/:borough" component={Browse} />
              <Route exact path="/restaurant/:restaurantname" component={RestaurantDetail}/>
              <Route exact path="/heatmap" component={HeatMap} />
            </Switch>
          </Fragment>
        </Router>
        <Suspense fallback={<div></div>}>
          <Footer />
      </Suspense>
    </Fragment>
  );
}

export default App;
