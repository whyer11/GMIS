/**
 * Created by whyer on 14-3-7.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var db = req.db;
    var currentClassId = req.body.id;
    var gom_clses = req.models.gom_clses;
    var gom_props = req.models.gom_props;
    var classes = [];
    var i = 1;
    gom_clses.find({CLS_ID: currentClassId}, function (err, data) {
        ep.emit('returnclassobj', data);
    });
    ep.all('returnclassobj', function (data) {
        var currentClassTabName = data[0].CLS_TAB_NAME;
        db.driver.execQuery('DROP TABLE `gmis`.`' + currentClassTabName + '`', function (err, d) {
            if (err) throw err;
            ep.emit('todelprops', data);
        });
    });
    ep.all('todelprops', function (data) {
        gom_props.find({CLS_ID: data[0].CLS_ID}).each(function (prop) {
            prop.remove(function () {
                console.log('del success');
            });
        })
    });

    function checkChildClass(classid, classes, nextclassid, db_class, i) {
        classes[0] = classid;
        db_class.find({CLS_ID: nextclassid}).count(function (count) {
            ep.emit('returncount', count);
        });
        ep.all('returncount', function (count) {
            if (count == 0) {
                ep.emit('returnallclasses', classes);
            } else {
                db_class.find({PARENT_CLS_ID: currentClassId}, function (data) {
                    for (var j = 0; j < data.length; j++) {
                        classes[i] = data[j].CLS_ID;
                    }
                    currentClassId = data[0].CLS_ID;
                })
            }
        })
    }

    res.end();
};