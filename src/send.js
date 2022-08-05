const exec = require('@actions/exec');
const path = require('path');
const inputs = require('./inputs');

module.exports = async function(bundlePath, bundleFile, keyFile) {
    const host = inputs.host;
    const destinationDir = inputs.destinationDir;
    const destinationPath = path.join(destinationDir, bundleFile);

    await exec.exec(`scp -i ${keyFile} -o StrictHostKeyChecking=no ${bundlePath} ${host}:${destinationPath}`);
};