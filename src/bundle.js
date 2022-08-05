const path = require('path');
const exec = require('@actions/exec');
const github = require('@actions/github');

async function copyArtifacts(artifacts, from, to) {
    for(const [name, relativePath] of Object.entries(artifacts)) {
        const fromPath = path.join(from, relativePath);
        const toPath = path.join(to, name);
        await exec.exec(`cp -r ${fromPath} ${toPath}`);
    }
}

async function bundleArtifacts(artifacts, dir) {
    const bundleName = github.context.sha;
    const bundleFileName = bundleName + '.tar.gz';
    const bundlePath = path.join(dir, bundleFileName);
    const filesString = Object.keys(artifacts).join(' ');

    await exec.exec(`tar -cvzf ${bundlePath} -C ${dir} ${filesString}`);

    return { bundlePath, bundleFile: bundleFileName };
}

module.exports = async function(artifacts, from, to) {
    await copyArtifacts(artifacts, from, to);
    return await bundleArtifacts(artifacts, to);
};