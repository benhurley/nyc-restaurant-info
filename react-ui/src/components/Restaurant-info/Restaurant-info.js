import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import './Restaurant-info.css';

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
                    <div className="lineItem">{details.city && details.state &&
                        <div>
                            <div className="title">Location</div>
                            <div className="result">{details.city + ", " + details.state}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.playlistUrl && 
                        <div>
                            <div className="title">Music Playlist</div>
                    <div className="result">{<a href={`${details.playlistUrl}`}>Spotify</a>}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.scent && 
                        <div>
                            <div className="title">Aroma</div>
                            <div className="result">{details.scent}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.light && 
                        <div>
                            <div className="title">Lights</div>
                            <div className="result">{details.light}</div>
                        </div>}
                    </div>
                    <div className="lineItem">{details.items && 
                        <div>
                            <div className="title">Important Items</div>
                            <div className="result">{details.items}</div>
                        </div>}
                    </div>
                    <Link to={'/'} style={{ textDecoration: 'none'}} >
                        <div className="button">
                            <Button variant="contained" color="primary">
                                New Search
                            </Button>
                        </div>
                    </Link>
                </div>
            </header>
        </div>
    )
}
