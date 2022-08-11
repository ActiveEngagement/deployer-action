const exec = require('@actions/exec');
const path = require('path');
const inputs = require('./inputs');

module.exports = async function(bundlePath, bundleName, keyFile) {
    const host = inputs.host;
    const destinationDir = inputs.destinationDir;
    const destinationPath = path.join(destinationDir, bundleName);

    // Try to ensure that the destination directory exists.
    await exec.exec(`ssh -T -i ${keyFile} -p StrictHostKeyChecking=no ${host} "mkdir -p ${destinationDir}`);

    // Send the bundle.
    await exec.exec(`scp -r -i ${keyFile} -o StrictHostKeyChecking=no ${bundlePath} ${host}:${destinationPath}`);
};