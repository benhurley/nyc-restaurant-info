import React, { Fragment, useState, useEffect } from 'react';

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
        <Fragment>
            <div>{details.name}</div>
            <div>{details.scent}</div>
            <div>{details.playlist}</div>
            <div>{details.lighting}</div>
        </Fragment>
    )
}
