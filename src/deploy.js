const https = require('https');
const inputs = module.require('./inputs');

module.exports = function() {
    const deployUrl = inputs.deployUrl;
    if(deployUrl) {
        https.get(deployUrl);
    }
};