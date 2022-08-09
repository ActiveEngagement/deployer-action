const path = require('path');
const exec = require('@actions/exec');
const github = require('@actions/github');
const fs = require('fs');

module.exports = async function(artifacts, from, to) {
    const bundleName = github.context.sha;
    const bundlePath = path.join(to, bundleName);
    fs.mkdirSync(bundlePath);

    for(const [name, relativePath] of Object.entries(artifacts)) {
        const fromPath = path.join(from, relativePath);
        const toPath = path.join(bundlePath, name);
        await exec.exec(`cp -r ${fromPath} ${toPath}`);
    }

    return { bundlePath, bundleName };
};