import React from 'react';
import './Footer.css'
import { DetectMobile } from '../../helpers/Window_Helper';
import Attribution from '../Attribution/Attribution';

export const Footer = () => {
  const isMobile = DetectMobile();

  return (
    <div className="disclaimer" style={{ position: isMobile ? 'relative' : 'fixed' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Attribution />
      </div>
      <div>
        NYC Restaurant Info™ 2024. All rights reserved. The information contained in this website is provided for informational purposes only, and should not be construed as legal advice on any matter.
        This open-source project shows restaurant inspection data provided by <a href="https://data.cityofnewyork.us/resource/gra9-xbjk.json">NYC Open Data</a>.
        We recommend this website to be used alongside other popular search engines to improve the accuracy of your NYC restaurant search results.
      </div>
    </div>
  )
}
