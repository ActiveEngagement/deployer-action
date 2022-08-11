const github = require('@actions/github');
const core = require('@actions/core');
const inputs = require('./inputs');

function toTimestamp(timeString) {
    return Math.round(Date.parse(timeString) / 1000);
}

module.exports = function() {
    return {
        commit: github.context.sha,
        initiator: github.context.actor,
        env: inputs.env,
        version: inputs.version,
        bundled_at: Date.now(),
        committed_at: toTimestamp(github.context.payload.head_commit.timestamp),
        git_ref: github.context.ref,
        ci_job: github.context.job
    };
}