import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

require('dotenv').config();
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../src')));

// Define route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.post('/calculate-roof', async (req, res) => {
    const address: string = req.body.address;
    try {
        const result = await calculateRoof(address);
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while calculating roof perimeter and area.' });
    }
});

// Configure HTTPS options
const httpsOptions = {
    key: fs.readFileSync('../cert/key.pem'),
    cert: fs.readFileSync('../cert/cert.pem')
};

// Create HTTPS server
const server = https.createServer(httpsOptions, app);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//calculate roof perimeter and area based on an address
async function calculateRoof(address: string){
    const API_KEY = process.env.Google_API;

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    const location = geocodingData.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;
    
    // Solar API request to obtain solar potential data
    const solarApi = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&requiredQuality=HIGH&key=${API_KEY}`;
    const solarResponse = await fetch(solarApi);
    const solarData = await solarResponse.json();

    // Calculate roof perimeter and area based on solar potential data
    const roofM2 = parseInt(solarData.solarPotential.wholeRoofStats.areaMeters2);
    const roofSqft = roofM2 * 10.7639;
    const roofPerimeter = Math.sqrt(roofSqft) * 4;

    return { perimeter: roofPerimeter, area: roofSqft };
}