const path = require('path');
const fs = require('fs');
const inputs = require('./inputs');

module.exports = function(dir) {
    const key = inputs.key;
    const keyFile = path.join(dir, 'id_rsa');
    fs.writeFileSync(keyFile, key + "\n");
    fs.chmodSync(keyFile, 0o600);

    return keyFile;
};