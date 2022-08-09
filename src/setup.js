const path = require('path');
const fs = require('fs');
const inputs = require('./inputs');

module.exports = function() {
    const tempDir = inputs.tempDir;

    if(fs.existsSync(tempDir)) {
        throw 'Deployer directory already exists!';
    }

    fs.mkdirSync(tempDir);

    return { tempDir };
};