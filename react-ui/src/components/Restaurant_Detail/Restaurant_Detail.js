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
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import GoogleMapReact from 'google-map-react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import './Restaurant_Detail.css';

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const defaultMapProps = {
    center: {
      lat: 40.74,
      lng: -73.98
    },
    zoom: 11
};

const LocationMapIcon = () => <LocationOnIcon style={{fill: "red"}}></LocationOnIcon>

export const RestaurantDeatil = (props) => {
    let {restaurantname} = props.match.params;
    restaurantname = encodeRestaurantName(restaurantname);
    const [details, setDetails] = useState({});
    const [coordinates, setCoordinates] = useState({});

    const nycCompliantRestaurantApi = 'https://data.cityofnewyork.us/resource/4dx7-axux.json?$limit=1';

    const coordinatesUrl = `http://localhost:5000/api/coordinates`;

    const getDetails = () => {
        fetch(nycCompliantRestaurantApi + `&restaurantname=${restaurantname}&$order=inspectedon DESC`).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            setDetails(massageSearchResponse(json[0]));
            getCoordinates(json[0]);
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          });
    }

    const getCoordinates = (data) => {
        console.log(data);
        fetch(coordinatesUrl + `?address=${data.businessaddress}`).then(response => {
            if (!response.ok) {
                throw new Error(`status ${response.status}`);
            }
            return response.json();
        }).then(json => {
            setCoordinates(json);
            console.log(json);
        }).catch(e => {
            throw new Error(`API call failed: ${e}`);
        });
    }

    useEffect(() => {
        getDetails();
      }, []);



    return (
        <Fragment>
            <AdBanner />
            <div className="Home">
                <header className="Home-header">
                    <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                        <h1> nyc restaurant info </h1>
                    </Link>
                    {/* <h4 className="subTitle">search results</h4> */}
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
                    <Box paddingY="2%">
                        <Container maxWidth="md" >
                            <Card className="card-container">
                                <Typography variant="h5" className="standard-padding" gutterBottom>{details.restaurantname}</Typography>
                                <CardContent>
                                    <RoomOutlinedIcon className="icon"/> &nbsp;
                                    <span className="details">{details.businessaddress}</span>
                                </CardContent>
                                <CardContent>
                                <ThumbsUpDownOutlinedIcon className="icon"/> &nbsp;
                                    <span className="details">{
                                        details.isroadwaycompliant === "Cease and Desist" ||
                                        details.skippedreason === "No Seating"
                                        ? <div className="closed">closed</div>
                                        : details.isroadwaycompliant === "Compliant"
                                        ? <div className="open">open</div>
                                        : "unknown"
                                    }</span>
                                </CardContent>
                                <CardContent>
                                    <AssignmentOutlinedIcon className="icon"/> &nbsp;
                                    <span className="details">
                                        { details.isroadwaycompliant && details.inspectedon && details.skippedreason &&
                                            details.isroadwaycompliant + " on " + details.inspectedon.slice(0,10) +
                                            " due to " + details.skippedreason
                                        }
                                        { details.isroadwaycompliant && details.inspectedon && !details.skippedreason &&
                                            details.isroadwaycompliant + " on " + details.inspectedon.slice(0,10)
                                        }    
                                    </span>
                                </CardContent>
                                <CardContent>
                                <AirlineSeatReclineNormalOutlinedIcon className="icon" /> &nbsp;
                                    <span className="details">
                                        {details.seatingchoice && details.skippedreason !== "No Seating" &&
                                            details.seatingchoice === "both"
                                                ? "sidewalk and roadway"
                                                : details.seatingchoice === "sidewalk"
                                                    ? "sidewalk only"
                                                    : "roadway only"
                                        }
                                    </span>
                                </CardContent>
                                <CardContent>
                                    
                                </CardContent>
                            </Card>
                        </Container>
                    </Box>
                  </Grid>
                </Grid>
                <div style={{ height: '100vh', width: '100%', paddingTop: '25px'}}>
                        <GoogleMapReact
                        bootstrapURLKeys={{ key: googleApiKey }}
                        defaultCenter={defaultMapProps.center}
                        defaultZoom={defaultMapProps.zoom}
                        yesIWantToUseGoogleMapApiInternals
                        >
                        <LocationMapIcon
                            lat={coordinates.lat}
                            lng={coordinates.lng}
                            text="My Marker"
                        />
                        </GoogleMapReact>
                    </div>
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
