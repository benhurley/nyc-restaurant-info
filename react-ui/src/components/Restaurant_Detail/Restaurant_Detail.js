import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Card } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AdBanner } from '../Banners/Ad_Banner';
import { Link } from 'react-router-dom'
import { mapBorough, massageSearchResponse, encodeRestaurantName } from '../../helpers/NYC_Data_Massaging'
import ThumbsUpDownOutlinedIcon from '@material-ui/icons/ThumbsUpDownOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@material-ui/icons/AirlineSeatReclineNormalOutlined';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import GoogleMapReact from 'google-map-react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { detectMobile } from '../../helpers/Window_Helper'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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

export const RestaurantDetail = (props) => {
    let {restaurantname} = props.match.params;
    restaurantname = encodeRestaurantName(restaurantname);
    const [details, setDetails] = useState({});
    const [coordinates, setCoordinates] = useState({});
    const isMobile = detectMobile();

    const nycCompliantRestaurantApi = 'https://data.cityofnewyork.us/resource/4dx7-axux.json?$limit=1';
    const coordinatesUrl = process.env.NODE_ENV === 'production' 
        ?  '/api/coordinates'
        :  'http://localhost:5000/api/coordinates'

    const addressLine1 = details.businessaddress && details.businessaddress.substr(0, details.businessaddress.indexOf(',')); 
    const addressLine2 = details.businessaddress && details.businessaddress.substr(details.businessaddress.indexOf(',')+2); 

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
                 <Link to={`/location/${mapBorough(details.borough)}`} style={{ textDecoration: 'none'}} >
                     <div class="backArrow">
                        <ArrowBackIcon />
                     </div>
                 </Link>
                 <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                        <h1> nyc restaurant info™ </h1>
                    </Link>
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
                                <Typography variant="h5" className="standard-padding" gutterBottom>
                                    {details.restaurantname}
                                </Typography>
                                <CardContent>
                                    <RoomOutlinedIcon className="icon"/> &nbsp;
                                    <span className="details">
                                        {!isMobile && details.businessaddress}
                                    </span>
                                    <span className="details">
                                        { isMobile && addressLine1 }<br />
                                        { isMobile && addressLine2 }
                                    </span>
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
                                        {!isMobile && details.isroadwaycompliant && details.inspectedon && details.skippedreason &&
                                            details.isroadwaycompliant + " as of " + details.inspectedon.slice(0,10) +
                                            ", " + details.skippedreason
                                        }   
                                    </span>
                                    <span className="details">
                                        {!isMobile && details.isroadwaycompliant && details.inspectedon && !details.skippedreason &&
                                            details.isroadwaycompliant + " as of " + details.inspectedon.slice(0,10)
                                        } 
                                    </span>
                                    <span className="details">
                                        {isMobile && details.isroadwaycompliant && details.inspectedon && !details.skippedreason &&
                                            details.isroadwaycompliant
                                        } 
                                        <br />
                                        {isMobile && details.isroadwaycompliant && details.inspectedon && !details.skippedreason &&
                                            " as of " + details.inspectedon.slice(0,10)
                                        } 
                                    </span>
                                    <span className="details">
                                        {isMobile && details.isroadwaycompliant && details.inspectedon && details.skippedreason &&
                                            details.isroadwaycompliant
                                        }
                                        <br />
                                        {isMobile && details.isroadwaycompliant && details.inspectedon && details.skippedreason &&
                                            " as of " + details.inspectedon.slice(0,10)
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
                            lng={coordinates.lng}x
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
          
        </Fragment>
    )
}