const github = require('@actions/github');

module.exports = function() {
    return {
        commit: github.context.sha,
        initiator: github.context.triggering_actor,
        ref_name: github.context.ref_name,
        bundled_at: Date.now()
    };
}