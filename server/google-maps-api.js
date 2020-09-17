const geoLocationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const axios = require('axios');
const { default: Axios } = require('axios');

async function getCoordinatesFromAddress(address) {
    return Axios.get(`${geoLocationUrl}${address}`);
}

module.exports = {
    getCoordinatesFromAddress
};