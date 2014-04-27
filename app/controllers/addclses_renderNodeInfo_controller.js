/**
 * Created by whyer on 14-2-13.
 */
var opt_db = require('../middleware/opt_db');
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res, err) {
    var gom_props = req.models.gom_props;
    var gom_clses = req.models.gom_clses;
    var currentNodeID = req.body.id;
    var nodeinfo = [];


    function checkParentsClass(clsid) {
        var classes = [];
        var i = 1;
        checkParentClass(clsid, classes, clsid, i);
        function checkParentClass(classid, classes, nextclassid, i) {
            classes [0] = classid;
            if (nextclassid == 0) {
                ep.emit('returnallclasses', classes);
            } else {
                gom_clses.find({CLS_ID: nextclassid}, function (err, data) {
                    if (data.length != 0) {
                        nextclassid = data[0].PARENT_CLS_ID;
                        classes[i] = parseInt(data[0].PARENT_CLS_ID);
                        i++;
                        checkParentClass(classid, classes, nextclassid, i);
                    } else {
                        return false;
                    }
                })
            }
        }
    }

    function checkAllProps(classes, nodeinfo, nextclassid, db_props, a, classindex) {
        if (nextclassid >= 0) {
            db_props.find({CLS_ID: nextclassid}, function (err, data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PROP_CAN_VISIBLE == 'T') {

                        var propObj = {
                            propid: data[i].PROP_ID,
                            name: data[i].PROP_NAME,
                            type: data[i].PROP_TYPE,
                            col: data[i].PROP_COL,
                            dbms_type: data[i].PROP_DBMS_TYPE,
                            length: data[i].PROP_LENGTH,
                            can_visible: data[i].PROP_CAN_VISIBLE,
                            can_modify: data[i].PROP_CAN_MODIFY,
                            can_delete: data[i].PROP_CAN_DELETE,
                            code: data[i].PROP_CODE,
                            classid: data[i].CLS_ID
                        };
                        nodeinfo[a] = propObj;
                        a++;
                    }
                }
                classindex++;
                nextclassid = classes[classindex];
                checkAllProps(classes, nodeinfo, nextclassid, db_props, a, classindex);
            })
        } else {
            ep.emit('next', nodeinfo);
        }
    }


    checkParentsClass(currentNodeID);
    ep.all('returnallclasses', function (classes) {
        checkAllProps(classes, nodeinfo, classes[0], gom_props, 0, 0);
    });
    ep.all('next', function (nodeinfo) {
        res.json({nodeInfo: nodeinfo});
        res.end();
    });


};