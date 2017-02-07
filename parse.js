const yaml = require('js-yaml');
const fs = require('fs');
const dir = require('node-dir');
const walkSync = require('walk-sync')

exports.load = function (folder) {
    let data = '';
    let prefix = process.cwd() + '/atom.web';
    const files = walkSync(folder);
    let yamlFiles = [];
    files.forEach(function (file) {
        let fullPath = `${prefix}/${file}`;
        if (fs.statSync(fullPath).isFile()) {
            yamlFiles.push(fullPath);
        }
    });
    yamlFiles.forEach(function (file) {
        var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        let updatedDoc = regexMatch(doc);
        if (updatedDoc != null) {
            data += `${file},${updatedDoc.landingUrl},${updatedDoc.studyPlan.defaultLesson}\r\n`;
        }else{
            console.log('ok');
        }
        //now lets change it

    });
    writeFile(data);
    return 'okies';
}

function regexMatch(doc) {
    const studyPlan = /.*studyplan.*/gi;
    if (doc.landingUrl) {
        var matches = doc.landingUrl.match(studyPlan);
        if (matches && matches.length == 1) {
            if (!doc.studyPlan) {
                doc.studyPlan = {};
            }
            doc.studyPlan.defaultLesson = matches[0];
            doc.landingUrl='/studyplan';
            return doc;
        }
    }
    return null;
}

function writeFile(data) {
    fs.writeFileSync('input.txt', data);
}
