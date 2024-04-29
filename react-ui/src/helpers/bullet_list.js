import React from 'react';

const BulletList = ({ text }) => {

    if (!text) return null;

    // Split the text into an array based on ';', and trim whitespace
    const items = text.split(';').map(item => item.trim()).filter(item => item);

    return (
        <ul>
            {items.map((item, index) => (
                <li key={index} style={{ marginBottom: '16px' }}>{item}</li>
            ))}
        </ul>
    );
};

export default BulletList;
