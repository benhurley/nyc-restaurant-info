import React from 'react';
import './Footer.css'

export const Footer = () => {
    return (
        <div className="footer">
          <div className="mainLine">
              nyc restaurant info™ 2020. all rights reserved.
          </div>
          <div className="updateLine">
            if you would like us to update incorrect results for your restaurant, please <a href="mailto:benfromtech@gmail.com">contact us</a>. 
          </div>
          <div className="disclaimer">
            ** disclaimer: the information contained in this website is provided for informational purposes only, and should not be construed as legal advice on any matter. 
            this open-source project makes deterministic predictions on a restaurant's outdoor dining status based on the inspection data provided by <a href="https://data.cityofnewyork.us/Transportation/Open-Restaurants-Inspections/4dx7-axux">nyc open data</a>. 
            these predictions are made by checking recent inspection data for characteristics that would generally result in a restaurant being open or closed for in-person dining. <br /><br />
                the algorithm currently works as follows: <br />
                open: most-recent inspection yielded a compliant rating<br />
                closed: cease and desist issued or a skipped inspection due to no seating available<br />
                unknown: cannot determine based on given data (may be non-compliant but still operating) <br /><br />
            the nyc restaurant info™ algorithm is an on-going work in progess, may be incorrect, and does not assume responsibility for providing the correct status of a restaurant in NYC. 
          </div>
        </div>
    )
}