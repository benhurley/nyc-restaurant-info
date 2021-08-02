import React, { useState } from 'react';
import { detectMobile } from '../../helpers/Window_Helper'

import './Ad_Banner.css'

export const AdBanner = () => {
    // hook below used to force re-render on hiding ad in session
    const [removeAd, setRemoveAd] = useState(false);
    const isHidden = sessionStorage.getItem('hideAd')

    const handleClick = () => {
        sessionStorage.setItem('hideAd', 'true')
        setRemoveAd(true);
    }

    const amazonAd = detectMobile() 
        ? <iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=42&l=ur1&category=homegarden&banner=1MF7R00PZZ7VAG1BZD02&f=ifr&linkID=2eb0f45e1271e1c5a9472bca79317354&t=turbogamer7000-20&tracking_id=turbogamer7000-20" width="234" height="60" scrolling="no" border="0" marginwidth="0" style={{border: 'none'}} frameborder="0"></iframe>
        : <iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=48&l=ur1&category=kitchen&banner=0EQTT1PJSFVACNQ29W02&f=ifr&linkID=f7d4eb1ab922fba4058f107ab754d252&t=turbogamer7000-20&tracking_id=turbogamer7000-20" width="728" height="90" scrolling="no" border="0" marginwidth="0" style={{border: 'none'}} frameborder="0"></iframe>

    return (
        !isHidden && (
            <div className="adBanner">
                <div class="closeButton" onClick={handleClick}>
                    X
                </div>
                { amazonAd }
            </div>
        )
    )
}
