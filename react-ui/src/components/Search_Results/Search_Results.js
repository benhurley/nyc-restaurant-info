import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import { mapBorough, massageSearchResponse } from '../../helpers/NYC_Data_Massaging'
import { HtmlTooltip } from '../../helpers/Tooltip_Helper';
import Typography from '@material-ui/core/Typography';
import './Search_Results.css';

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
            </header>

                <div className="searchResults">
                <h2> {details.restaurantname}</h2>
                <div className="result">{details.businessaddress}</div>
                <div className="lineItem">
                        <div>
                            <HtmlTooltip
                                title={
                                    <Fragment>
                                        <Typography>outdoor dining status</Typography><br />
                                        <b>{"open: "}</b>{"most-recent inspection yielded a compliant rating"}<br /><br />
                                        <b>{"closed: "}</b>{"cease and desist issued or no outdoor seating options available"}<br /><br />
                                        <b>{"unknown: "}</b>{"cannot determine based on given data (may be non-compliant but still operating)"}
                                    </Fragment>
                                }>
                                  <div className="title">status <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></div>
                            </HtmlTooltip>
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
                            <HtmlTooltip
                                title={ 
                                    <Fragment>
                                        <Typography>inspection date</Typography><br />
                                        {"most-recent inspection date for this restaurant"}
                                    </Fragment>
                                }>
                                <div className="title">date <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></div>
                            </HtmlTooltip>
                            <div className="result">{details.inspectedon.slice(0,10)}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.isroadwaycompliant &&
                        <div>
                            <HtmlTooltip
                                title={
                                <React.Fragment>
                                    <Typography>inspection results</Typography><br />
                                    <b>{"compliant: "}</b>{"outdoor seating options listed have passed an inspection"}<br /><br />
                                    <b>{"non-compliant: "}</b>{"inspection failed, but restaurant may still be operating"}<br /><br />
                                    <b>{"for hiqa review: "}</b>{"pending highway inspection and quality assurance review"}<br /><br />
                                    <b>{"skipped inspection: "}</b>{"inspection could not be performed (usually due to lack of seating options)"}
                                </React.Fragment>
                                }
                            >
                              <div className="title">compliancy <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></div>
                            </HtmlTooltip>
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
                            <HtmlTooltip
                                title={
                                <React.Fragment>
                                    <Typography>outdoor seating options</Typography><br />
                                    <b>{"sidewalk only: "}</b>{"outdoor seating available on sidewalk"}<br /><br />
                                    <b>{"roadway only: "}</b>{"outdoor seating available on the street in a protective barrier"}<br /><br />
                                    <b>{"sidwealk and roadway: "}</b>{"both options above are available"}<br /><br />
                                    <b>{"no seating: "}</b>{"inspection was skipped due to lack of seating options"}
                                </React.Fragment>
                                }
                            >
                                <div className="title">seating <img width={12} src={require("../../helpers/question.png")} alt={"tooltip question mark"}></img></div>
                            </HtmlTooltip>
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
                        <Button variant="outlined" style={{textTransform: "lowercase"}}>
                            back
                        </Button>
                    </div>
                </Link>
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
