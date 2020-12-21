import React from 'react';
import './Borough_Map.css'

export const BoroughMap =() => {
    const handleClick = (borough) => {
        const newURL = window.location + `location/${borough}`
        window.location.assign(newURL)
      }

    return (
        <div className="container">
            <img alt="nyc map" className="borough-image" src={require("../../helpers/nyc_boroughs.png")} />
            <div onClick={() => handleClick("manhattan")} className="manhattan">manhattan</div>
            <div onClick={() => handleClick("bronx")} className="bronx">bronx</div>
            <div onClick={() => handleClick("brooklyn")} className="brooklyn">brooklyn</div>
            <div onClick={() => handleClick("staten island")} className="staten-island">staten <br />island</div>
            <div onClick={() => handleClick("queens")} className="queens">queens</div>
        </div>
    )
}