import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import './Search_Results.css';
import { mapBorough, massageSearchResponse } from '../../helpers/NYC_Data_Massaging'

export const SearchResults = (props) => {
    const {restaurantname} = props.match.params
    const [details, setDetails] = useState({})

    const nycCompliantRestaurantApi = 'https://data.cityofnewyork.us/resource/4dx7-axux.json';

    useEffect(() => {
        fetch(nycCompliantRestaurantApi + `?restaurantname=${restaurantname}&$order=inspectedon DESC`).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            setDetails(massageSearchResponse(json[0]));
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          })
      }, []);

    return (
        <div className="Home">
            <header className="Home-header">
                <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                    <h1> food feels </h1>
                </Link>
                <div className="results">
                <h2> {details.restaurantname}</h2>
                <div className="result">{details.businessaddress}</div>
                <div className="lineItem">
                        <div>
                            <div className="title">dining status</div>
                            <div className="result">
                            {details.isroadwaycompliant === "Cease and Desist" ||
                                details.skippedreason === "No Seating"
                                ? <div className="closed">Closed</div>
                                : details.isroadwaycompliant === "Compliant"
                                    ? <div className="open">Open</div>
                                    : "Unknown"
                            }
                            </div>
                        </div>
                    </div>
                    <div className="lineItem">{details.inspectedon &&
                        <div>
                            <div className="title">inspection date</div>
                            <div className="result">{details.inspectedon.slice(0,10)}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.isroadwaycompliant &&
                        <div>
                            <div className="title">compliance status</div>
                            <div className="result">{details.isroadwaycompliant}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.skippedreason &&
                        <div>
                            <div className="title">skipped reason</div>
                            <div className="result">{details.skippedreason}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.seatingchoice 
                        && details.skippedreason !== "No Seating" &&
                        <div>
                            <div className="title">seating</div>
                    <div className="result">
                        { details.seatingchoice === "both"
                            ? "sidewalk and roadway"
                            : details.seatingchoice === "sidewalk"
                                ? "sidewalk only"
                                : "roadway only"
                        }</div>
                    </div>}
                </div>
                <Link to={`/location/${mapBorough(details.borough)}`} style={{ textDecoration: 'none'}} >
                    <div className="button">
                        <Button variant="contained" color="primary">
                            Back
                        </Button>
                    </div>
                </Link>
                </div>
            </header>
        </div>
    )
}
