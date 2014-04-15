/**
 * Created by whyer on 14-3-7.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
var fs = require('fs');
module.exports = function (req, res) {
    var db = req.db;
    var currentClassId = req.body.id;
    var gom_clses = req.models.gom_clses,
        gom_props = req.models.gom_props,
        gom_clslinks = req.models.gom_clslinks;

    function a(pid) {
        gom_clses.find({PARENT_CLS_ID: pid}).count(function (err, count) {
            if (count != 0) {
                gom_clses.find({PARENT_CLS_ID: pid}).each(function (cls) {
                    if (typeof (cls) == 'undefined') {
                        return 0;
                    } else {
                        gom_props.find({CLS_ID: cls.CLS_ID}).each(function (prop) {
                            prop.remove();
                        });

                        cls.remove(function (err) {
                            console.log('class remove err' + err);
                        });

                        db.driver.execQuery("DROP TABLE `gmis`.`" + cls.CLS_TAB_NAME + "`", function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        var modelpath = './app/models/' + cls.CLS_TAB_NAME + '.js';
                        fs.exists(modelpath, function (result) {
                            if (result) {
                                fs.unlinkSync(modelpath);
                            } else {
                                console.log(modelpath + ' have been del!')
                            }
                        });

                        a(cls.CLS_ID);
                    }
                })
            }
        })
    }

    a(currentClassId);
    gom_props.find({CLS_ID: currentClassId}).each(function (prop) {
        prop.remove();
    });

    gom_clses.get(currentClassId, function (err, cls) {
        console.log(cls);
        cls.remove(function (err) {
            if (err) {
                console.log(err);
            }
        });
        console.log(cls.CLS_TAB_NAME);
        db.driver.execQuery("DROP TABLE `gmis`.`" + cls.CLS_TAB_NAME + "`", function (err, result) {
            if (err) {
                console.log(err);
            }
        });
        var modelpath = './app/models/' + cls.CLS_TAB_NAME + '.js';
        fs.exists(modelpath, function (result) {
            if (result) {
                fs.unlinkSync(modelpath);
            } else {
                console.log(modelpath + ' have been del!')
            }
        });
    });
    res.render('add_classes', {
        title: '添加类型'
    });
    res.end();

};