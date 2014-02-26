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
/*
 */
exports.newModel = function (modelName, modelContent) {
    fs.open('./app/models/' + modelName + '.js', 'a', 0644, function (e, fd) {
        if (e) throw e;
        fs.write(fd, '//' + modelName + '\n' +
            modelContent, 0, 'utf8', function (e) {
            if (e) throw e;
            fs.closeSync(fd);
        });
    });
};
/* via the data of form from the frontend,
 * translate data obj 'fm' to the model for function newModel
 *
 * @param fm [obj]
 * @function public
 */
exports.newModelContent = function (fm) {
    var modelStr = 'module.exports = function(orm,db){' + '\n' +
        '   var ' + fm.class_name + ' = db.define("' + fm.class_name + '",{' + '\n' +
        '       INST_ID:Number,' + '\n' +
        '       INST_NAME:String,' + '\n' +
        printClassProps(fm) +
        '},{' + '\n' +
        '       id:"INST_ID"' + '\n' +
        '   });' + '\n' +
        '   ' + fm.class_name + '.sync(function(err){' + '\n' +
        '   console.log("create ' + fm.class_name + ' table successfully.")' + '\n' +
        '   });' + '\n' +
        '};';

    function printClassProps(fm) {
        var props = [];
        var i = 0;
        var str = "";
        for (var p in fm) {
            props[i] = fm[p];
            console.log(i + ':' + props[i]);
            i++;

        }
        for (var q = 1; q < props.length; q++) {
            if (q == props.length - 1) {
                str += '       ' + props[q] + ':String' + '\n';
            } else {
                str += '       ' + props[q] + ':String,' + '\n';
            }
        }
        return str;
    }

    return modelStr;
};