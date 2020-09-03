import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import { mapBorough } from '../../helpers/NYC_Data_Massaging'
import { useWindowSize } from '../../helpers/Window_Helper'
import { RestaurantSearchBar } from '../Search_Bars/Restaurant_Search_Bar';
import './Browse.css';

export const Browse = (props) => {    
    const [results, setResults] = useState([])
    const [showMoreVal, setShowMoreVal] = useState(40);
    const windowSize = useWindowSize() 
    const isMobile = windowSize.width < 1000;
    
    // nyc request requires capital names
    let {borough} = props.match.params
    borough = mapBorough(borough)
    const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=20000&$order=inspectedon DESC`;

    const desktopHeader = [<RestaurantSearchBar borough={borough} isMobile={false} />, "dining status", "inspection date", "compliance status", "seating"];
    const mobileHeader = [<RestaurantSearchBar borough={borough} isMobile={true} />, "dining status"];

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
      isMobile 
        ? <div className="Home">
        <header className="Home-header">
            <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                <h1> food feels </h1>
            </Link>
            <h3>Location: {borough}</h3>
            <p>(sorted by most-recent inspections)</p>
        </header>
        <div className="mobileResults">
            <table>
              <thead>
                <tr>{mobileHeader.map((h, index) => <th key={index}>{h}</th>)}</tr>
              </thead>
              <tbody>
              {results.slice(0, showMoreVal).map((result, index) => {
                return (
                  <tr className="result" key={index}>
                    <td>{result.restaurantname}</td>
                    <td>{result.isroadwaycompliant === "Cease and Desist"  ||
                            result.skippedreason === "No Seating"
                            ? <div className="closed">Closed</div>
                            : result.isroadwaycompliant === "Compliant"
                                ? <div className="open">Open</div>
                                : "Unknown"
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
        :
          <div className="Home">
              <header className="Home-header">
                  <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                      <h1> food feels </h1>
                  </Link>
                  <h3>Location: {borough}</h3>
                  <div className="subheader">(sorted by most-recent inspections)</div>
              </header>
              <div className="results">
                  <table>
                    <thead>
                      <tr>{desktopHeader.map((h, index) => <th key={index}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                    {results.slice(0, showMoreVal).map((result, index) => {
                      return (
                        <tr className="result" key={index}>
                          <td>{result.restaurantname}</td>
                          <td>{result.isroadwaycompliant === "Cease and Desist"  ||
                                  result.skippedreason === "No Seating"
                                  ? <div className="closed">Closed</div>
                                  : result.isroadwaycompliant === "Compliant"
                                      ? <div className="open">Open</div>
                                      : "Unknown"
                          }</td>
                          <td>{result.inspectedon.slice(0,10)}</td>
                          <td>{result.isroadwaycompliant}</td>
                          <td>{result.skippedreason === "No Seating"
                                ? "no seating"
                                : result.seatingchoice === "both"
                                  ? "sidewalk and roadway"
                                  : result.seatingchoice === "sidewalk"
                                      ? "sidewalk only"
                                      : "roadway only"
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
