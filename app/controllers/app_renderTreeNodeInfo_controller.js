/**
 * Created by whyer on 14-4-12.
 */
var opt_db = require('../middleware/opt_db');
var maps = require('../middleware/models_maps');
var EventProxy = require('eventproxy');
var ep = EventProxy();
module.exports = function (req, res) {
    var currentNode = req.body;
    checkParentsClass(req.body.clsid, req.body.instid);
    function checkParentsClass(clsid, instid) {
        var nodeArray = {};
        var i = 0;
        checkParentClass(clsid, clsid, i, instid);
        function checkParentClass(classid, nextclassid, i, instid) {
            req.models.gom_clses.get(nextclassid, function (err, clscols) {
                maps.modelsmaps(req, clscols.CLS_TAB_NAME).get(instid, function (err, data) {
                    console.log(instid + '::' + data + '::' + err);
                    req.models.gom_props.find({CLS_ID: nextclassid}, function (err, propcols) {
                        for (var i = 0; i < propcols.length; i++) {
                            for (val in data) {
                                if (val == propcols[i].PROP_COL) {
                                    nodeArray[propcols[i].PROP_NAME] = data[val];
                                }
                            }
                        }
                    });
                    i++;
                    if (nextclassid == 0) {
                        res.json(nodeArray);
                        res.end();
                        //console.log(nodeArray);
                    } else {
                        nextclassid = clscols.PARENT_CLS_ID;
                        checkParentClass(classid, nextclassid, i, instid);
                    }
                });
            })
        }
    }
}