const path = require('path');
const fs = require('fs');
const inputs = require('./inputs');

module.exports = function() {
    const tempDir = inputs.tempDir;
    const archivingDir = path.join(tempDir, 'archiving');

    if(fs.existsSync(tempDir)) {
        throw 'Deployer directory already exists!';
    }

    fs.mkdirSync(tempDir);
    fs.mkdirSync(archivingDir);

    return { tempDir, archivingDir };
};