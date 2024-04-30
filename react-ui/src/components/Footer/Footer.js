import React from 'react';
import './Footer.css'
import { DetectMobile } from '../../helpers/Window_Helper';
import Attribution from '../Attribution/Attribution';

export const Footer = () => {
  const isMobile = DetectMobile();

  return (
    <div className="disclaimer" style={{ position: isMobile ? 'relative' : 'fixed', width:'100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Attribution />
      </div>
      <div>
        <p>NYC Restaurant Info™ 2020-2024. All rights reserved. Originally created by <a href='https://justben.fyi' target="_blank" rel="noopener noreferrer">Ben</a> and <a target="_blank" rel="noopener noreferrer" href='https://ericnatelson.dev'>Eric </a> during the pandemic to show people what restaurants were still open in NYC.</p>
        This open-source project shows restaurant inspection data provided by <a href="https://data.cityofnewyork.us/Health/Restaurant-Grades">NYC Open Data</a>.
        We recommend this website to be used alongside other popular search engines to improve the accuracy of your NYC restaurant search results.
      </div>
    </div>
  )
}
