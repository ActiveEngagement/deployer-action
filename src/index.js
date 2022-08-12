const core = require('@actions/core');
const process = require('process');
const inputs = require('./inputs');
const setupDirs = require('./setup');
const bundleArtifacts = require('./bundle');
const createKeyFile = require('./create_key');
const sendBundle = require('./send');
const deploy = require('./deploy');

async function main() {
    try {
        const { tempDir } = setupDirs();
        const appDir = process.cwd();

        const artifacts = inputs.artifacts;
        const { bundlePath, bundleName } = await bundleArtifacts(artifacts, appDir, tempDir);

        const keyFile = createKeyFile(tempDir);
        await sendBundle(bundlePath, bundleName, keyFile);

        deploy();
    }
    catch (error) {
        core.error(error);
        core.setFailed(error);
    }
}

main();