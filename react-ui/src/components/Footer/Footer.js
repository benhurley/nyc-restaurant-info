import React, { Fragment } from 'react';
import './Footer.css'

export const Footer = () => {
    return (
        <Fragment>
          <div className="mainLine">
              nyc restaurant info™ 2020. all rights reserved.
          </div>
          <div className="disclaimer">
            * disclaimer: the information contained in this website is provided for informational purposes only, and should not be construed as legal advice on any matter. 
            this open-source project makes deterministic predictions on a restaurant's outdoor dining status based on the inspection data provided by <a href="https://data.cityofnewyork.us/Transportation/Open-Restaurants-Inspections/4dx7-axux">nyc open data</a>. 
            these predictions are made by checking recent inspection data for characteristics that would generally result in a restaurant being open or closed for in-person dining. <br /><br />
            the nyc restaurant info™ algorithm is an on-going work in progess, may be incorrect, and does not assume responsibility for providing the correct status of a restaurant in NYC. 
            we recommend this website to be used alongside other popular search engines to improve the accuracy of your nyc restaurant search results.
            if you would like to learn how the nyc restaurant info™ algorithm works, want to know how to get involved in the project, or want to ask any other questions, please  <a href="mailto:benfromtech@gmail.com">contact us</a>.
          </div>
        </Fragment>
    )
}
