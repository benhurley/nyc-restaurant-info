import React from 'react';
import './Footer.css'
import { DetectMobile } from '../../helpers/Window_Helper';

export const Footer = () => {
  const isMobile = DetectMobile();

  return (
    <div className="disclaimer" style={{position: isMobile ? 'relative' : 'fixed'}}>
      nyc restaurant info™ 2024. all rights reserved. <br /><br />
      * disclaimer: the information contained in this website is provided for informational purposes only, and should not be construed as legal advice on any matter.
      this open-source project makes deterministic predictions on a restaurant's outdoor dining grade based on the inspection data provided by <a href="https://data.cityofnewyork.us/resource/gra9-xbjk.json">nyc open data</a>.
      these predictions are made by checking recent inspection data for characteristics that would generally result in a restaurant being open or closed for in-person dining. <br /><br />
      the nyc restaurant info™ algorithm is an on-going work in progess, may be incorrect, and does not assume responsibility for providing the correct grade of a restaurant in NYC.
      we recommend this website to be used alongside other popular search engines to improve the accuracy of your nyc restaurant search results.
      if you would like to learn how the nyc restaurant info™ algorithm works, want to know how to get involved in the project, or want to ask any other questions, please  <a href="mailto:justbenfyi@pm.me">contact us</a>.
    </div>
  )
}
