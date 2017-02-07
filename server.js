let express = require('express');
let path = require('path');
let parse = require('./parse');

let app = express();
let productConfigFolder = process.cwd() + '/ATOM.WEB';

app.set('port', (process.env.PORT || 3000));
app.use('/set', function (req, res, send) {
    let val = parse.load(productConfigFolder);
    res.send(val);
});

app.listen(app.get('port'), () => {
    console.log('app running on port ' + app.get('port'));
});

module.exports = app;