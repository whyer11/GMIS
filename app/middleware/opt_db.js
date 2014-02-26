/**
 * Created by whyer on 14-2-25.
 */
var fs = require('fs');
var content = 'module.exports = function(orm,db){' +
    'var gom_aa = db.define("gom_aa",{' +
    'CLS_ID:Number' +
    '},{' +
    'id:"CLS_ID"' +
    '});' +
    '};';

var newModel = function (modelName, modelContent) {
    fs.open('./app/models/' + modelName + '.js', 'a', 0644, function (e, fd) {
        if (e) throw e;
        fs.write(fd, '//' + modelName + '\n' +
            content, 0, 'utf8', function (e) {
            if (e) throw e;
            fs.closeSync(fd);
        });
    });
}

exports.newModel = newModel;