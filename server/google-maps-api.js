const { default: Axios } = require('axios');
const googleApiKey = process.env.GOOGLE_API_KEY;
const geoLocationUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleApiKey}&address=`;

async function getCoordinatesFromAddress(address) {
    return Axios.get(`${geoLocationUrl}${address}`);
}

module.exports = {
    getCoordinatesFromAddress
};