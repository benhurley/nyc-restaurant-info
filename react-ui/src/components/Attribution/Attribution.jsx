import React from 'react';
import './Attribution.css';

function Attribution() {
    return (
        <div className='attributionContainer'>
            By
            <a
                className='styledLink'
                href='https://justben.fyi'
                target="_blank"
                rel="noopener noreferrer"
            >
                justben.fyi
            </a>
            <img
                className='attributionImage'
                src='/me.webp'
                alt="justben.fyi logo"
            />
                        <a
                className='Link'
                href='https://pay.justben.fyi'
                target="_blank"
                rel="noopener noreferrer"
            >
                Donate
            </a>
        </div>
    );
}

export default Attribution;