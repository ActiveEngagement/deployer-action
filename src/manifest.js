const github = require('@actions/github');
const core = require('@actions/core');

module.exports = function() {
    core.info(JSON.stringify(github.context));
    return {
        commit: github.context.sha,
        initiator: github.context.triggering_actor,
        ref_name: github.context.ref_name,
        bundled_at: Date.now()
    };
}