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
                <h1> Food Feels </h1>
                    <p>To best replicate the dining experience at <b>{details.name}</b>, we recommend:</p>
                    <div className="results">
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
                        <Link to={'/'} >
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
