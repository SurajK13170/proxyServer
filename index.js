const express = require('express');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8080; // You can set this to any available port

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());
app.get('/test', async (req, res) => {
    res.status(200).json({ message: 'Proxy endpoint is working' });
})
// Proxy endpoint
app.post('/HospiDashProxy', async (req, res) => {
    const { apiUrl, body, headers } = req.body;

    if (!apiUrl || !body) {
        return res.status(400).json({ message: 'Missing apiUrl or body in request' });
    }

    // Generate timestamp and request ID
    const timestamp = moment.utc().toISOString();
    const requestId = uuidv4();

    // Create the final headers object
    const finalHeaders = {
        ...headers,
        "TIMESTAMP": timestamp,
        "REQUEST-ID": requestId,
    };

    try {
        // Make the axios request
        const response = await axios({
            method: req.method.toLowerCase(),
            url: apiUrl,
            data: body,
            headers: finalHeaders,
        });

        // Send back the response from the proxied request
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error forwarding request:', error.message);

        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
