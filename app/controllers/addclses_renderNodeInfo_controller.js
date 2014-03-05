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
    var classes = [];
    var nodeinfo = [];
    var i = 1;
    //使用Eventproxy
    /*
     gom_clses.find({CLS_ID:currentNodeID},function(err,data){
     ep.emit('getcurrentclassCOL',data);
     });
     ep.all('getcurrentclassCOL',function(data){

     });
     */


    function checkParentClass(classid, classes, nextclassid, db_class, i) {
        classes[0] = classid;
        //console.log('classes :'+classes[0]);
        for (var q = 0; q < classes.length; q++) {
            console.log('classes:' + classes[q]);
        }
        console.log('nextclassid:' + nextclassid);
        console.log('i:' + i);
        if (nextclassid == 0) {
            console.log(classes);
            ep.emit('backallclasses', classes);
        } else {
            db_class.find({CLS_ID: nextclassid}, function (err, data) {
                if (data.length != 0) {
                    nextclassid = data[0].PARENT_CLS_ID;
                    classes[i] = parseInt(data[0].PARENT_CLS_ID);
                    i++;
                    checkParentClass(classid, classes, nextclassid, db_class, i);
                } else {
                    return false;
                }
            })
        }
    }

    checkParentClass(currentNodeID, classes, currentNodeID, gom_clses, i);
    ep.all('backallclasses', function (classes) {
        checkAllProps(classes, nodeinfo, classes[0], gom_props, 0, 0);
    });
    ep.all('next', function (nodeinfo) {
        res.json({nodeInfo: nodeinfo});
        res.end();
    });


    function checkAllProps(classes, nodeinfo, nextclassid, db_props, a, classindex) {
        if (nextclassid >= 0) {
            db_props.find({CLS_ID: nextclassid}, function (err, data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PROP_CAN_VISIBLE == 'T') {

                        var propObj = {
                            name: data[i].PROP_NAME,
                            id: data[i].CLS_ID
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
};