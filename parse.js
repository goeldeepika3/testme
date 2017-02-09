const yaml = require('js-yaml');
const fs = require('fs');
const dir = require('node-dir');
const walkSync = require('walk-sync')
const studyPlanRegex = /.*studyplan.*/gi;

function getFiles(folder) {
    const files = walkSync(folder);
    let allFiles = [];
    files.forEach(function (file) {
        if (file.toLowerCase().indexOf('backup') !== -1) {
            //   console.log(file);
            return;
        }
        if (file.toLowerCase().indexOf('xktp') !== -1) {
            //console.log(file);
            return;
        }
        let fullPath = `${folder}/${file}`;
        allFiles.push(fullPath);
    });
    return allFiles;
}

exports.list = function (folder) {
    const files = getFiles(folder);
    return files;
};
exports.read = function (folder) {
    let data = `location,isFile,currentLandingUrl\r\n`
    const files = getFiles(folder);
    files.forEach(function (file) {
        const location = file;
        const isFile = fs.statSync(file).isFile();
        let landingUrl = undefined;
        let skip = false;
        if (isFile) {
            try {
                var fileContent = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
                landingUrl = getLandingUrl(fileContent);
            }
            catch (err) {
                skip = true;
                console.log(`skipped:${file}`);
            }
        }
        if (skip) {
            return;
        }
        data += `${location},${isFile},${landingUrl}\r\n`
    });
    return data;
}
function getLandingUrl(fileContent) {
    return fileContent.landingUrl;
}
exports.v2 = function (folder) {
    let data = `location,currentLandingUrl,defaultLesson,newLandingUrl\r\n`
    const files = getFiles(folder);
    files.forEach(function (file) {
        const location = file;
        const isFile = fs.statSync(file).isFile();
        if (!isFile) {
            return;
        }
        let landingUrl = undefined;
        let defaultLesson = undefined;
        let newLandingUrl = undefined;
        try {
            var fileContent = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
            landingUrl = getLandingUrl(fileContent);
            if (!landingUrl) {
                return;
            }
            var regexMatchObj = regexMatchv2(fileContent);
            if (regexMatchObj) {
                defaultLesson = regexMatchObj.defaultLesson;
                newLandingUrl = regexMatchObj.landingUrl;
            } else {
                return;
            }
            if (location.toLowerCase().indexOf('dat.yaml') !== -1) {
                console.log('heyo');
            }
            fileContent.landingUrl = newLandingUrl;
            if (fileContent.studyPlan == undefined) {
                console.log(`skipped ${location}`);
                return;
            }
            fileContent.studyPlan.defaultLesson = defaultLesson;
            let xyz = yaml.safeDump(fileContent, { lineWidth: 100000 });
            fs.writeFileSync(location, xyz);
            data += `${location},${landingUrl},${defaultLesson},${newLandingUrl}\r\n`
        }
        catch (err) {
            console.log(`ignoring: ${file}`);
        }
    });
    return data;
}
function regexMatchv2(doc) {
    if (doc.landingUrl) {
        var matches = doc.landingUrl.match(studyPlanRegex);
        if (matches && matches.length == 1) {
            return {
                defaultLesson: matches[0],
                landingUrl: '/studyplan'
            }
        }
    }
};


exports.load = function (folder) {
    let data = '';
    const files = walkSync(folder);
    let yamlFiles = [];
    files.forEach(function (file) {
        let fullPath = `${folder}/${file}`;
        if (fs.statSync(fullPath).isFile()) {
            yamlFiles.push(fullPath);
        }
    });
    yamlFiles.forEach(function (file) {
        var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        let updatedDoc = regexMatch(doc);
        if (updatedDoc != null) {
            data += `${file},${updatedDoc.landingUrl},${updatedDoc.studyPlan.defaultLesson}\r\n`;
        } else {
            console.log('ok');
        }
        //now lets change it

    });
    writeFile(data);
    return 'okies';
}

function regexMatch(doc) {
    if (doc.landingUrl) {
        var matches = doc.landingUrl.match(studyPlanRegex);
        if (matches && matches.length == 1) {
            if (!doc.studyPlan) {
                doc.studyPlan = {};
            }
            doc.studyPlan.defaultLesson = matches[0];
            doc.landingUrl = '/studyplan';
            return doc;
        }
    }
    return null;
}

function writeFile(data) {
    fs.writeFileSync('input.txt', data);
}
