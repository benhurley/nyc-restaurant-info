import React, { useCallback, useEffect, useState, Fragment } from 'react';
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
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route path="/restaurant" component={RestaurantInfo}/>
    </Router>
  );

}

export default App;
