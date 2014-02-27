/**
 * Created by whyer on 14-2-25.
 */
var fs = require('fs');
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
        var str = "";
        var props = fm.class_prop;
        for (var e = 0; e < fm.class_prop.length; e++) {
            if (e == fm.class_prop.length - 1) {
                str += '       ' + props[e] + ':String' + '\n';
            } else {
                str += '       ' + props[e] + ':String,' + '\n';
            }
        }
        return str;
    }

    return modelStr;
};

