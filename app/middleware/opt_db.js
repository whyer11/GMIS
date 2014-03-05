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
        '   var ' + fm.class_tab_name + ' = db.define("' + fm.class_tab_name + '",{' + '\n' +
        '       INST_ID:Number,' + '\n' +
        printClassProps(fm) +
        '},{' + '\n' +
        '       id:"INST_ID"' + '\n' +
        '   });' + '\n' +
        '   ' + fm.class_tab_name + '.sync(function(err){' + '\n' +
        '   console.log("create ' + fm.class_tab_name + ' table successfully.")' + '\n' +
        '   });' + '\n' +
        '};';

    function printClassProps(fm) {
        var str = "";
        var props = fm.PROP_COL;
        for (var e = 0; e < fm.PROP_COL.length; e++) {
            if (e == fm.PROP_COL.length - 1) {
                str += '       ' + props[e] + ':String' + '\n';
            } else {
                str += '       ' + props[e] + ':String,' + '\n';
            }
        }
        return str;
    }

    return modelStr;
};

function addClassProp(props, table, classid, i) {
    table.find(['PROP_ID', 'Z'], function (err, data) {
        var nextID = data[0].PROP_ID + 1;
        table.create({
            PROP_ID: nextID,
            CLS_ID: classid,
            PROP_NAME: props[i],
            PROP_TYPE: "String",
            PROP_CAN_VISIBLE: "T",
            PROP_CAN_MODIFY: "T",
            PROP_CAN_DELETE: "T",
            PROP_DISP_IND: 1,
            PROP_CODE: ""
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("insert successfully (table gom_props)");
            }
        })
    });
    if (i == props.length) {
        return;
    } else {
        i++;
        addClassProp(props, table, classid, i)
    }
}
exports.addClassProp = addClassProp;
exports.checkParentClassProp = function (currentclassid, db_class, db_prop) {
    var allProp = [];
    var classes = [];
    var i = 1;
    var nextclassid = currentclassid;
    consolecheckParentClass(currentclassid, classes, nextclassid, db_class, i);


};

function checkParentClass(classid, classes, nextclassid, db_class, i) {
    classes[0] = classid;
    if (nextclassid == 0) {
        return classes;
    } else {
        db_class.find({CLS_ID: nextclassid}, function (err, data) {
            if (data.length != 0) {
                nextclassid = data[0].PARENT_CLS_ID;
                classes[i] = data[0].PARENT_CLS_ID;
                i++;
                checkParentClass(classid, classes, nextclassid, db_class, i);
            } else {
                return false;
            }
        })
    }
}