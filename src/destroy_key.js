const path = require('path');
const fs = require('fs');

module.exports = function(dir) {
    const keyFile = path.join(dir, 'id_rsa');
    fs.rmSync(keyFile);
};