import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import { mapBorough } from '../../helpers/NYC_Data_Massaging'
import { useWindowSize } from '../../helpers/Window_Helper'
import { RestaurantSearchBar } from '../Search_Bars/Restaurant_Search_Bar';
import './Browse.css';

export const Browse = (props) => {    
    const [results, setResults] = useState([])
    const [showMoreVal, setShowMoreVal] = useState(40);
    const windowSize = useWindowSize() 
    const isMobile = windowSize.width < 1050;
    
    // nyc request requires capital names
    let {borough} = props.match.params
    borough = mapBorough(borough)
    const nycCompliantRestaurantApi = `https://data.cityofnewyork.us/resource/4dx7-axux.json?borough=${borough}&$limit=20000&$order=inspectedon DESC`;

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

    const handleRestaurant = (name) => {
      const newURL = window.location.origin + `/restaurant/${name}`
      window.location.assign(newURL)
    }

    const handleClick = () => {
      setShowMoreVal(showMoreVal + 40);
      window.scrollTo(0, window.scrollY - 200)
    }

    const HtmlTooltip = withStyles((theme) => ({
      tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 300,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }))(Tooltip);

    return (
      <div className="Home">
        <header className="Home-header">
            <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                <h1> food feels </h1>
            </Link>
            <h3>Location: {borough}</h3>
            {!isMobile && <div class="subheader">browse all recent inspections or search for a specific restaurant</div>}
        </header>
      { isMobile ? 
        <div className="mobileResults">
            <table>
              <thead>
                <tr>
                  <th><RestaurantSearchBar borough={borough} isMobile={true} /></th>
                  <th>dining status</th>
                </tr>
              </thead>
              <tbody>
              {results.slice(0, showMoreVal).map((result, index) => {
                return (
                  <tr className="result" key={index} onClick={() => handleRestaurant(result.restaurantname)}>
                    <td>{result.restaurantname}</td>
                    <td>{result.isroadwaycompliant === "Cease and Desist" ||
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
        :
        <div className="results">
            <table>
              <thead>
                <tr>
                  <th>
                    <RestaurantSearchBar borough={borough} isMobile={false} />
                  </th>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <b>{"open: "}</b>{"inspection yielded a compliant rating"}<br />
                        <b>{"closed: "}</b>{"cease and desist has been issued or there were no outdoor seating options reported"}<br />
                        <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
                      </React.Fragment>
                    }
                  >
                  <th>dining status  <img width={12} src={require("./question.png")}></img></th>
                  </HtmlTooltip>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        {"showing results for all nyc inspections, sorted by inspection date in descending order"}
                      </React.Fragment>
                    }
                  >
                  <th>inspection date  <img width={12} src={require("./question.png")}></img></th>
                  </HtmlTooltip>
                  <th>inspection status</th>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <b>{"sidewalk only: "}</b>{"outdoor seating available on sidewalk"}<br />
                        <b>{"roadway only: "}</b>{"outdoor seating in a protective barrier on the street"}<br />
                        <b>{"sidwealk and roadway: "}</b>{"both options above are available"}<br />
                        <b>{"no seating: "}</b>{"recent inspection was skipped due to no seating options"}
                      </React.Fragment>
                    }
                  >
                  <th>seating  <img width={12} src={require("./question.png")}></img></th>
                  </HtmlTooltip>
                </tr>
              </thead>
              <tbody>
              {results.slice(0, showMoreVal).map((result, index) => {
                return (
                  <tr className="result" key={index} onClick={() => handleRestaurant(result.restaurantname)}>
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
        }
          <div className="button">
          <Button variant="contained" onClick={handleClick}>
              show more
          </Button>
          </div>
          <div>
            data updates daily via <a href="https://data.cityofnewyork.us/Transportation/Open-Restaurants-Inspections/4dx7-axux">nyc open data</a>
          </div>
          <div className="footer">
            food feels™ 2020. all rights reserved.
          </div>
      </div>
    )
}
