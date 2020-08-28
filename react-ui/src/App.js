import React, { Fragment } from 'react';
import { Search } from './components/Search/Search';
import { SearchResults } from './components/Search_Results/Search_Results';
import { NewRestaurant } from './components/New_Restaurant/New_Restaurant';
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
          <Route exact path="/" component={Search} />
          <Route exact path="/location/:borough" component={Browse} />
          <Route path="/restaurant/:restaurantname" component={SearchResults}/>
          <Route path="/add" component={NewRestaurant}/>
        </Switch>
      </Fragment>
    </Router>
  );

}

export default App;
