/**
 * Created by whyer on 14-3-7.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
var fs = require('fs');
module.exports = function (req, res) {
    var db = req.db;
    var currentClassId = req.body.id;
    var gom_clses = req.models.gom_clses;
    var gom_props = req.models.gom_props;

    gom_clses.find(['CLS_ID', 'Z'], function (err, data) {
        ep.emit('allCLS_ID', data);
    });

    ep.all('allCLS_ID', function (data) {
        for (var i = 0; i < data.length; i++) {
            checkIfParentClass(currentClassId, data[i].CLS_ID, data[i].CLS_ID, gom_clses);
        }
    });

    ep.tail('returnChildClass', function (data) {
        if (data == 0) {
            console.log("无法对根类型进行操作");
        } else {
            gom_props.find({CLS_ID: data}).each(function (prop) {
                prop.remove();
                ep.emit('delChildClass', data);
            });
        }

    });
    ep.tail('delChildClass', function (data) {
        var classTabName = '';
        gom_clses.find({CLS_ID: data}).each(function (cls) {
            classTabName = cls.CLS_TAB_NAME;
            cls.remove();
            ep.emit('delChildTab', classTabName);
        })
    });

    ep.tail('delChildTab', function (data) {
        db.driver.execQuery("DROP TABLE `gmis`.`" + data + "`", function (err, result) {
            ep.emit('delclassmodel', data);
        })
    });

    ep.tail('delclassmodel', function (data) {
        var modelsPath = './app/models/' + data + '.js';
        fs.exists(modelsPath, function (result) {
            if (result) {
                fs.unlinkSync(modelsPath);
            } else {
                console.log(modelsPath + ' have been del!');
            }
        });
    });
    function checkIfParentClass(parentid, childclassid, nextclassid, db_class) {

        if (parentid == nextclassid) {
            ep.emit('returnChildClass', childclassid);
            console.log(childclassid);
        } else {
            db_class.find({CLS_ID: nextclassid}, function (err, data) {
                if (data.length != 0) {
                    nextclassid = data[0].PARENT_CLS_ID;
                    checkIfParentClass(parentid, childclassid, nextclassid, db_class);
                } else {
                    return false;
                }
            })
        }

    }

    res.render('add_classes', {
        title: '添加类型'
    });
    res.end();
};