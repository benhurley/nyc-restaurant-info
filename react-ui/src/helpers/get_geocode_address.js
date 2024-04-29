export async function getGeocodeAddress(address) {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY; // Pull the API key from environment variables
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
            const { lat, lng } = data.results[0].geometry.location;
            return { latitude: lat, longitude: lng };
        } else {
            throw new Error(`Geocoding failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
