/**
 * Created by whyer on 14-2-25.
 */
var fs = require('fs');
exports.newModel = function (modelName, modelContent) {
    fs.open('./app/models/' + modelName + '.js', 'w', 0644, function (e, fd) {
        if (e) throw e;
        fs.write(fd, '//' + modelName + '\n' +
            modelContent, 0, 'utf8', function (e) {
            if (e) throw e;
            fs.closeSync(fd);
        });
    });
}
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
        var dbms_type = '';

        if (typeof(fm.PROP_COL) == 'string') {
            switch (fm.PROP_DBMS_TYPE) {
                case 'VARCHAR':
                    dbms_type = 'String';
                    break;
                case 'INT':
                    dbms_type = 'Number';
                    break;
                case 'BOOLEAN':
                    dbms_type = 'Boolean';
                    break;
            }
            str += '        ' + props + ':' + dbms_type + '\n';
        } else {
            for (var e = 0; e < fm.PROP_COL.length; e++) {
                switch (fm.PROP_DBMS_TYPE[e]) {
                    case 'VARCHAR':
                        dbms_type = 'String';
                        break;
                    case 'INT':
                        dbms_type = 'Number';
                        break;
                    case 'BOOLEAN':
                        dbms_type = 'Boolean';
                        break;
                }
                if (e == fm.PROP_COL.length - 1) {
                    str += '       ' + props[e] + ':' + dbms_type + '\n';
                } else {
                    str += '       ' + props[e] + ':' + dbms_type + ',' + '\n';
                }
            }
        }

        return str;
    }

    return modelStr;
}
exports.addClassProp = function (props, table, classid, i) {
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