const https = require('https');
const inputs = module.require('./inputs');

module.exports = function(bundleName) {
    const deployUrl = inputs.deployUrl;
    if(deployUrl) {
        https.get(deployUrl + `&bundle=${bundleName}`);
    }
};