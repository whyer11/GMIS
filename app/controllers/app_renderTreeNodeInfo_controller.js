/**
 * Created by whyer on 14-4-12.
 */
var maps = require('../middleware/models_maps');
var EventProxy = require('eventproxy');
var ep = new EventProxy();
var opt_db = require('../middleware/opt_db');
//TODO 创建对象的的时候不应该在父节点的表中创建新的实例,修改创建控制器后再来这边修改
module.exports = function (req, res) {
    var nodeInfo = {
        clsid:req.body.clsid,
        refid:req.body.id,
        instid:req.body.instid
    };
    opt_db.checkClass(req,nodeInfo.clsid, function (err,clscol) {
        if(err){
            console.error(err);
        }else{
            ep.emit('$ClassCol',clscol);
        }
    });
    ep.all('$ClassCol', function (clscols) {
        var nodeProps = {};
        var checkAllProps = function (_class) {
            req.models.gom_props.find({CLS_ID:_class.CLS_ID}, function (err,propcols) {
                maps.modelsmaps(req,_class.CLS_TAB_NAME).get(nodeInfo.instid, function (err, instcol) {
                    if(err){
                        console.error(err);
                        return res.send(200,err);
                    }else{
                        for (var i = 0; i < propcols.length; i++) {
                            for (val in instcol) {
                                if (val == propcols[i].PROP_COL) {
                                    if (propcols[i].PROP_CAN_VISIBLE == "T") {
                                        nodeProps[propcols[i].PROP_NAME] = instcol[val];
                                    }
                                }
                            }
                        }
                        if(_class.CLS_ID == 0){
                            console.log(nodeProps);
                            return res.send(200,nodeProps);
                        }else{
                            opt_db.checkParentClass(req,_class.CLS_ID, function (err, parentClass) {
                                return checkAllProps(parentClass);
                            });
                        }
                    }
                })
            })
        };
        checkAllProps(clscols,nodeInfo.refid);
    });

    /*

    checkParentsClass(req.body.clsid, req.body.instid);

    function checkParentsClass(clsid, instid) {
        var nodeArray = {};
        checkParentClass(clsid, clsid, 0, instid);

        function checkParentClass(classid, nextclassid, i, instid) {
            console.log(instid);
            //console.log('nextclassid:'+nextclassid+' '+i);
            req.models.gom_clses.get(nextclassid, function (err, clscols) {
                if(instid == undefined){
                    req.models.gom_props.find({CLS_ID:nextclassid},function(err,propcols){
                        for(var j = 0;j<propcols.length;j++){
                            if(propcols[j].PROP_CAN_VISIBLE == 'T'){
                                nodeArray[propcols[j].PROP_ID] = propcols[j].PROP_NAME;
                            }
                        }
                        i++;
                        if(nextclassid == 0){
                            console.log(nodeArray);
                            res.json(nodeArray);
                            res.end();
                        }else{
                            nextclassid = clscols.PARENT_CLS_ID;
                            console.log(nextclassid);
                            checkParentClass(classid,nextclassid,i,instid);
                        }
                    })
                }else{
                    console.log(clscols.CLS_TAB_NAME);
                    maps.modelsmaps(req, clscols.CLS_TAB_NAME).get(instid, function (err, data) {

                        req.models.gom_props.find({CLS_ID: nextclassid}, function (err, propcols) {

                            for (var i = 0; i < propcols.length; i++) {
                                for (val in data) {
                                    if (val == propcols[i].PROP_COL) {
                                        if (propcols[i].PROP_CAN_VISIBLE == "T") {
                                            nodeArray[propcols[i].PROP_NAME] = data[val];
                                        }
                                    }
                                }
                            }
                            i++;
                            if (nextclassid == 0) {
                                console.log(nodeArray);
                                res.json(nodeArray);
                                res.end();
                            } else {
                                nextclassid = clscols.PARENT_CLS_ID;
                                checkParentClass(classid, nextclassid, i, instid);
                            }
                        });
                    });
                }
            })
        }
    }
    */
};