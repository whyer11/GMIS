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
    var arraynum = 1;
    var myarray = [];

    function a(pid) {
        gom_clses.find({PARENT_CLS_ID: pid}).count(function (err, count) {
            if (count != 0) {
                gom_clses.find({PARENT_CLS_ID: pid}).each(function (cls) {
                    cls.remove(function (err) {
                        console.log('class remove err' + err);
                    });
                    gom_props.find({CLS_ID: cls.CLS_ID}).each(function (prop) {
                        prop.remove();

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
                })
            } else {
                gom_clses.get(pid, function (err, cls) {
                    cls.remove();
                });
            }
        })

    }

    a(currentClassId);
    gom_props.find({CLS_ID: currentClassId}).each(function (prop) {
        prop.remove();
    });
    gom_clses.get(currentClassId, function (err, cls) {
        cls.remove();
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


    //console.log(myarray);
    res.end();
    /*
     gom_clses.find(['CLS_ID', 'Z'], function (err, data) {
     ep.emit('allCLS_ID', data);
     });

     ep.all('allCLS_ID', function (data) {
     for (var i = 0; i < data.length; i++) {
     checkIfParentClass(currentClassId, data[i].CLS_ID, data[i].CLS_ID, gom_clses);
     }
     });
     /* 递归检测是否有该父类型
     * @param parentid 输入当前父类型id
     * @param childclassid 输入子类型id
     * @param nextclassid 输入下一个检查的类型id
     * @param db_class 输入需要操作的模型
     */
    /*
     function checkIfParentClass(parentid, childclassid, nextclassid, db_class) {

     if (parentid == nextclassid) {
     ep.emit('returnChildClass', childclassid);
     console.log('该类型下所有子类型和本类型的ID：' + childclassid);
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


     ep.tail('returnChildClass', function (data) {
     if (data == 0) {
     console.log("无法对根类型进行操作");
     } else {

     }
     console.log(data + ' i just want to see how many times');
     ep.emit('delChildClass', data);
     });
     /*
     ep.tail('delChildClass', function (data) {
     var classTabName = '';
     gom_clses.get(data, function (err, cls) {
     cls.remove();
     console.log(data + '我就是看看重复了多少次！！');
     ep.emit('delChildTab', classTabName);
     });
     });

     ep.tail('delChildTab', function (data) {
     db.driver.execQuery("DROP TABLE `gmis`.`" + data + "`", function (err, result) {
     console.log(data + '我就是看看重复了多少次！！');
     //ep.emit('delclassmodel', data);
     })
     });

     ep.tail('delclassmodel', function (data) {
     var modelsPath = './app/models/' + data + '.js';
     console.log(data + '我就是看看重复了多少次！！');
     /*
     if (fs.existsSync(modelsPath)) {
     //fs.unlinkSync(modelsPath);

     } else {
     console.log(modelsPath + ' have been del!')
     }

     });
     */


};