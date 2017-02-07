let express = require('express');
let path = require('path');
let parse = require('./parse');

let app = express();
let filePath = process.cwd() + '/GADGETS.yaml';

app.set('port', (process.env.PORT || 3000));
app.use('/set', function (req, res, send) {
   let val= parse.load(process.cwd());
    res.send(val);
});

app.listen(app.get('port'), () => {
    console.log('app running on port ' + app.get('port'));
});

module.exports = app;