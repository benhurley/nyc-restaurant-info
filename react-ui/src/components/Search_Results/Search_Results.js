import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Card } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AdBanner } from '../Banners/Ad_Banner';
import { Link } from 'react-router-dom'
import { mapBorough, massageSearchResponse, encodeRestaurantName } from '../../helpers/NYC_Data_Massaging'
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import ThumbsUpDownOutlinedIcon from '@material-ui/icons/ThumbsUpDownOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@material-ui/icons/AirlineSeatReclineNormalOutlined';
import { Footer } from '../Footer/Footer';
import './Search_Results.css';

export const SearchResults = (props) => {
    let {restaurantname} = props.match.params;
    restaurantname = encodeRestaurantName(restaurantname);
    const [details, setDetails] = useState({});

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
        <Fragment>
            <AdBanner />
            <div className="Home">
                <header className="Home-header">
                    <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                        <h1> nyc restaurant info </h1>
                    </Link>
                    <h4 className="subTitle">search results</h4>
                </header>
            </div>
            <div className="resultsCard">
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                >
                  <Grid item md={12}>
                    <Card>
                        <div className="lineItem">
                            <div className="title">
                                <RestaurantOutlinedIcon style={{fontSize: "large"}} /> &nbsp;
                                { details.restaurantname }
                            </div>
                        </div>
                        <div className="lineItem">
                            <div className="title">
                                <RoomOutlinedIcon style={{fontSize: "large"}} /> &nbsp;
                                { details.businessaddress }
                            </div>
                        </div>
                        <div className="lineItem">
                            <div className="title">
                                <ThumbsUpDownOutlinedIcon style={{fontSize: "large"}} /> &nbsp;
                                {details.isroadwaycompliant === "Cease and Desist" ||
                                    details.skippedreason === "No Seating"
                                    ? <div className="closed">closed</div>
                                    : details.isroadwaycompliant === "Compliant"
                                        ? <div className="open">open</div>
                                        : "unknown"
                                }
                            </div>
                        </div>
                        <div className="lineItem">
                            <div className="title">
                                <AssignmentOutlinedIcon style={{fontSize: "large"}}/> &nbsp;
                                { details.isroadwaycompliant && details.inspectedon && details.skippedreason &&
                                    details.isroadwaycompliant + " on " + details.inspectedon.slice(0,10) +
                                    " due to " + details.skippedreason
                                }
                                { details.isroadwaycompliant && details.inspectedon && !details.skippedreason &&
                                    details.isroadwaycompliant + " on " + details.inspectedon.slice(0,10)
                                }
                            </div>
                        </div>
                        <div className="lineItem">
                            <div className="title">{ details.seatingchoice && !details.skippedreason &&
                                <Fragment>
                                    <AirlineSeatReclineNormalOutlinedIcon style={{fontSize: "large"}}/> &nbsp;
                                    {details.seatingchoice && details.skippedreason !== "No Seating" &&
                                        details.seatingchoice === "both"
                                            ? "sidewalk and roadway"
                                            : details.seatingchoice === "sidewalk"
                                                ? "sidewalk only"
                                                : "roadway only"
                                    }
                                </Fragment>
                                }
                            </div>
                        </div>
                    </Card>  
                  </Grid>
                </Grid>
                <Link to={`/location/${mapBorough(details.borough)}`} style={{ textDecoration: 'none'}} >
                    <div className="button">
                        <Button variant="outlined" style={{textTransform: "lowercase"}}>
                            back
                        </Button>
                    </div>
                </Link>
            </div>
          <Footer />
        </Fragment>
    )
}
