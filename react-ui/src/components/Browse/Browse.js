import React, { useState, useEffect, Fragment, Suspense } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import './Browse.css';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { massageApiResponse, mapBorough } from '../../helpers/NYC_Data_Massaging'
import { RestaurantSearchBar } from '../Search_Bars/Restaurant_Search_Bar';

export const Browse = (props) => {    
    const [results, setResults] = useState([])
    const [showMoreVal, setShowMoreVal] = useState(40);

    // nyc request requires capital names
    let {borough} = props.match.params
    borough = mapBorough(borough)
    const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=20000&$order=inspectedon DESC`;

    const tableHeader = [<RestaurantSearchBar borough={borough} />, "outdoor dining status", "inspection date", "most-recent compliance status", "outdoor seating configuration"];

    useEffect(() => {
        fetch(nycCompliantRestaurantApi).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            setResults(json);
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          })
      }, []);

    const handleClick = () => {
        setShowMoreVal(showMoreVal + 20);
        window.scrollTo(0, window.scrollY - 140)
    }

    return (
        <div className="Home">

            <header className="Home-header">
                <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                    <h1> food feels </h1>
                </Link>
                <h3>Location: {borough}</h3>
            </header>

            <div className="results">
                <table>
                  <thead>
                    <tr>{tableHeader.map((h, index) => <th key={index}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                  {results.slice(0, showMoreVal).map((result, index) => {
                    return (
                      <tr className="result" key={index}>
                        <td>{result.restaurantname}</td>
                        <td>{result.isroadwaycompliant === "Cease and Desist"
                                ? <div className="closed">Closed</div>
                                : result.isroadwaycompliant === "Compliant"
                                    ? <div className="open">Open</div>
                                    : "Unknown"
                        }</td>
                        <td>{result.inspectedon.slice(0,10)}</td>
                        <td>{result.isroadwaycompliant}</td>
                        <td>{ result.seatingchoice === "both"
                                ? "sidewalk and roadwalk seating"
                                : result.seatingchoice === "sidewalk"
                                    ? "sidewalk seating only"
                                    : "roadwalk seating only"
                        }</td>
                    </tr>
                    );
                  })}
                  </tbody>
                </table>
            </div>

            <div className="button">
            <Button variant="contained" color="primary" onClick={handleClick}>
                show more
            </Button>
            </div>
        </div>
    )
}
