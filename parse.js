const yaml = require('js-yaml');
const fs = require('fs');
const dir = require('node-dir');
const walkSync=require('walk-sync')

exports.load = function (folder) {
    const files = walkSync(folder);
    return files;
    // var doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
    // console.log(doc);
}


