import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import './RestaurantInfo.css';

export const RestaurantInfo = (props) => {
    const {id} = props.match.params
    const [details, setDetails] = useState({})

    useEffect(() => {
        fetch(`/api/restaurants/${id}`).then(response => {
            if (!response.ok) {
              throw new Error(`status ${response.status}`);
            }
            return response.json();
          })
          .then(json => {
            setDetails(json);
          }).catch(e => {
            throw new Error(`API call failed: ${e}`);
          })
      }, []);

    return (
        <div className="Home">
            <header className="Home-header">
                <Link to={"/"} style={{ textDecoration: 'none', color: "black" }}>
                    <h1> Food Feels </h1>
                </Link>
                <div className="results">
                    <div>{details.name && 
                        <div className="lineItem">
                            <div className="title">Restaurant Name</div>
                            <div className="result">{details.name}</div>
                        </div>}
                    </div>
                    <div>{details.location && 
                        <div className="lineItem">
                            <div className="title">Location</div>
                            <div className="result">{details.location}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.playlist && 
                        <div>
                            <div className="title">Music Playlist</div>
                            <div className="result">{details.playlist}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.scent && 
                        <div>
                            <div className="title">Aroma</div>
                            <div className="result">{details.scent}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.lighting && 
                        <div>
                            <div className="title">Dim the Lights</div>
                            <div className="result">{details.lighting}</div>
                        </div>}
                    </div>
                    <Link 
                        to={`/restaurants/location/${details.location}`} 
                        style={{ textDecoration: 'none', color: "black",flexDirection:"row" }}
                    >
                        <div className="button">
                            <Button variant="contained" color="primary">
                                Back
                            </Button>
                        </div>
                    </Link>
                    <Link 
                        to={'/'} 
                        style={{ textDecoration: 'none', color: "black",flexDirection:"row" }} 
                    >
                        <div className="button">
                            <Button variant="contained" color="primary">
                                New Location
                            </Button>
                        </div>
                    </Link>
                </div>
            </header>
        </div>
    )
}
