const core = require('@actions/core');

function getInput(name) {
    return core.getInput(name);
}

function isInputMissing(input) {
    return input === '' || input === null || input === undefined;
}

function getRequiredInput(name) {
    const input = getInput(name);

    if(isInputMissing(input)) throw `"${name}" is a required input!`;

    return input;
}

module.exports = {
    artifacts: JSON.parse(getRequiredInput('artifacts')),
    tempDir: getInput('temp_dir'),
    host: getRequiredInput('ssh_host'),
    key: getRequiredInput('ssh_key'),
    destinationDir: getRequiredInput('destination'),
    deployUrl: getInput('deploy_url')
};