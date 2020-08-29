import React, { Fragment } from 'react';
import { Home } from './components/Home/Home';
import { SearchResults } from './components/Search_Results/Search_Results';
import { Browse } from './components/Browse/Browse';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Fragment>
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/location/:borough" component={Browse} />
          <Route exact path="/restaurant/:restaurantname" component={SearchResults}/>
        </Switch>
      </Fragment>
    </Router>
  );

}

export default App;
