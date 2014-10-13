/**
 * Created by wanghuanyu on 14-9-23.
 */
var maps = require('../middleware/models_maps'),
    EventProxy = require('eventproxy'),
    ep = new EventProxy(),
    opt_db = require('../middleware/opt_db');
module.exports = function (req, res) {
    var nodeInfo = req.body;
    console.log(nodeInfo);
    opt_db.checkRef(req,nodeInfo.refid, function (err, refcol) {
        ep.emit('$GetParentAttr',refcol);
        ep.emit('$GetSelfAttr',nodeInfo.clsid);
    });
    //TODO 检查该类型的属性,以及该类型所继承的属性
    ep.all('$GetSelfAttr', function (clsid) {
        //console.log(clsid+'clsid');
        var _selfNodeDetail = {};
        var checkSelfProps = function (nextclsid) {
            console.log(nextclsid);
            if(nextclsid != 0){
                req.models.gom_props.find({CLS_ID:nextclsid}, function (err, propcols) {
                    //TODO 以后要谨记,返回一个数组或对象,一定要进行内容的检查

                    if(propcols.length !=0) {
                        for (var i = 0; i < propcols.length; i++) {
                            console.log(propcols[i].PROP_NAME);
                            _selfNodeDetail[propcols[i].PROP_COL] = propcols[i].PROP_NAME;
                            if (i == propcols.length - 1) {
                                _selfNodeDetail.INST_NAME = '实例名称';
                                opt_db.checkParentClass(req,nextclsid, function (err, p_clscol) {
                                    return checkSelfProps(p_clscol.CLS_ID);
                                });

                            }
                        }
                    }else{

                    }
                })
            }else{
                _selfNodeDetail.INST_NAME = '实例名称';
                ep.emit('$ReturnSelfInfo', _selfNodeDetail);
            }

        };
        checkSelfProps(clsid);

    });

    ep.all('$GetParentAttr', function (refcol) {
        console.log(refcol.REF_ID);
        var _parentNodeDetail = {};
        if(refcol.REF_ID != 0){
            //TODO
            var checkParentAttr = function (_refcol) {
                opt_db.checkRef(req,_refcol.REF_ID, function (err, refcol) {
                    if(err){
                        console.log(err);
                    }else{
                        opt_db.checkInst(req,refcol.INST_ID, function (err, instcol) {
                            if(err){
                                console.log(err)
                            }else{
                                opt_db.checkClass(req,instcol.CLS_ID, function (err, clscol) {
                                    req.models.gom_props.find({CLS_ID:clscol.CLS_ID}, function (err, propcols) {
                                        maps.modelsmaps(req,clscol.CLS_TAB_NAME).get(instcol.INST_ID, function (err, attrcol) {
                                            if(err){
                                                console.error(err);
                                            }else{
                                                for(var i = 0;i<propcols.length;i++){
                                                    for(val in attrcol){
                                                        if(val == propcols[i].PROP_COL){
                                                            if(propcols[i].PROP_CAN_VISIBLE == 'T'){
                                                                _parentNodeDetail[propcols[i].PROP_NAME] = attrcol[val];
                                                            }
                                                        }
                                                    }
                                                }
                                                //console.log(_refcol.REF_ID);
                                                if(_refcol.REF_ID == 1){
                                                    //console.log(_parentNodeDetail);
                                                    ep.emit('$ReturnParentInfo',_parentNodeDetail);
                                                    return 0;
                                                }else{
                                                    opt_db.checkParentRef(req,_refcol.REF_ID, function (err, prefcol) {
                                                        if(err){
                                                            console.log(err);
                                                        }else{
                                                            return checkParentAttr(prefcol);
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    })
                                });
                            }
                        });
                    }

                });
            };
            checkParentAttr(refcol);
        }else{
            console.log('ref emit!');
            ep.emit('$ReturnParentInfo',_parentNodeDetail);
        }
    });

    ep.all('$ReturnParentInfo','$ReturnSelfInfo', function (_parentNodeDetail,_selfNodeDetail) {
        var node = {
            parentInfo:_parentNodeDetail,
            selfInfo:_selfNodeDetail
        };
        console.log(node);
        return res.send(200,node);
    })
};