import React, { useState } from 'react';
import { DetectMobile } from '../../helpers/Window_Helper'

import './Ad_Banner.css'

export const AdBanner = () => {
    const [closedInCurrentSession, setClosedInCurrentSession] = useState(false);
    const isVisible = !sessionStorage.getItem('hideAd')

    const handleClick = () => {
        sessionStorage.setItem('hideAd', 'true')
        setClosedInCurrentSession(true);
    }

    const amazonAd = DetectMobile() 
        ? <iframe title="mobile-amazon-ad" src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=42&l=ur1&category=homegarden&banner=1MF7R00PZZ7VAG1BZD02&f=ifr&linkID=2eb0f45e1271e1c5a9472bca79317354&t=turbogamer7000-20&tracking_id=turbogamer7000-20" width="234" height="60" scrolling="no" border="0" marginWidth="0" style={{border: 'none'}} frameBorder="0"></iframe>
        : <iframe title="desktop-amazon-ad" src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=48&l=ur1&category=kitchen&banner=0EQTT1PJSFVACNQ29W02&f=ifr&linkID=f7d4eb1ab922fba4058f107ab754d252&t=turbogamer7000-20&tracking_id=turbogamer7000-20" width="728" height="90" scrolling="no" border="0" marginWidth="0" style={{border: 'none'}} frameBorder="0"></iframe>

    return (
        isVisible && !closedInCurrentSession && (
            <div className="adBanner">
                <div className="closeButton" onClick={handleClick}>
                    X
                </div>
                { amazonAd }
            </div>
        )
    )
}
