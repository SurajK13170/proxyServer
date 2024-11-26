const axios = require('axios');
const https = require('https');

let instance;

module.exports = function () {
    if (!instance) {
        instance = axios.create({
            timeout: 60000, // Set an appropriate timeout (60 seconds in this case)
            httpsAgent: new https.Agent({ keepAlive: true }), // Keep connections alive
        });
    }
    return instance;
};
