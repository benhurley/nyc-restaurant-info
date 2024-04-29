import React, { Fragment, Suspense, lazy } from 'react';
import { Home } from './components/Home/Home';
import { RestaurantDetail } from './components/Restaurant_Detail/Restaurant_Detail';
import { Browse } from './components/Browse/Browse';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './App.css';

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
              <Route exact path="/restaurant/:dba" component={RestaurantDetail}/>
            </Switch>
          </Fragment>
        </Router>
        <Suspense fallback={<div className="loadingAnimation"><Loader
          type="ThreeDots"
          color="#d3d3d3"
          height={100}
          width={100} 
        /></div>}>
          <Footer />
      </Suspense>
    </Fragment>
  );
}

export default App;
