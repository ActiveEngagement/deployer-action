const github = require('@actions/github');
const inputs = require('./inputs');

module.exports = function() {
    return {
        commit: github.context.sha,
        initiator: github.context.actor,
        env: inputs.env,
        version: inputs.version,
        bundled_at: Math.round(Date.now() / 1000),
        extra: {
            committed_at: Math.round(Date.parse(github.context.payload.head_commit.timestamp) / 1000),
            git_ref: github.context.ref,
            ci_job: github.context.job
        }
    };
}