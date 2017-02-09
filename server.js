let express = require('express');
let path = require('path');
let parse = require('./parse');
let fs = require('fs');

let app = express();
let productConfigFolder = process.cwd() + '/prod/ATOM.WEB';

app.set('port', (process.env.PORT || 3000));

app.use('/list', function (req, res, send) {
    let files = parse.list(productConfigFolder);
    res.send(files.join('<br/>'));
});
app.use('/current', function (req, res, send) {
    let data = parse.read(productConfigFolder);
    res.write(data);
    fs.writeFileSync('current.csv', data);
    res.end();
});
app.use('/v2', function (req, res, send) {
    let data = parse.v2(productConfigFolder);
    res.write(data);
    fs.writeFileSync('v2.csv', data);
    res.end();
});
app.listen(app.get('port'), () => {
    console.log('app running on port ' + app.get('port'));
});

module.exports = app;