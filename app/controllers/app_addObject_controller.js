/**
 * Created by whyer on 14-5-9.
 */
var maps = require('../middleware/models_maps');
var EventProxy = require('eventproxy');
var ep = new EventProxy();
var opt_db = require('../middleware/opt_db');
module.exports = function (req, res) {
    opt_db.checkNewInstId(req, function (err, _newInstId) {
        if(err){
            console.error(err);
        }else{
            ep.emit('$ReturnNewInstId',_newInstId);
        }
    });

    ep.all('$ReturnNewInstId', function (_newInstId) {

        var insertInst = function (instid,nextclsid) {
            opt_db.checkClass(req,nextclsid, function (err, clscol) {
                req.models.gom_props.find({CLS_ID:nextclsid}, function (err, propcols) {
                    var prop = {
                        INST_ID:instid

                    };
                    for(val in req.body.props){
                        for(var i =0;i<propcols.length;i++){
                            if(val == '_'+propcols[i].PROP_COL){
                                prop[propcols[i].PROP_COL] =req.body.props[val];
                            }
                        }
                    }
                    var genProp = function (clsid) {
                        if(clsid == 0){
                            prop.STATE_ID=0;
                            prop.INSTACP_ID=0;
                            prop.CLS_ID=req.body.clsid;
                            return prop;
                        }else{
                            return prop;
                        }
                    };

                    maps.modelsmaps(req,clscol.CLS_TAB_NAME).create(genProp(nextclsid), function (err, item) {
                        if(err){
                            console.error(err);
                        }else{

                            if(clscol.CLS_ID == 0){
                                req.models.gom_refs.find(['REF_ID', 'Z'], function (err, refcols) {
                                    currentRefId = refcols[0].REF_ID + 1;
                                    currentdis = refcols[0].REF_DISP_IND + 1;
                                    var ref = {
                                        REF_ID: currentRefId,
                                        PARENT_REF_ID: req.body.refid,
                                        INST_ID: item.INST_ID,
                                        REF_DISP_IND: currentdis
                                    };
                                    req.models.gom_refs.create(ref, function (err, item) {
                                        if (err) {
                                            console.error(err);
                                        }
                                    })
                                });

                                return res.send(200,{success:true});
                            }else{
                                return insertInst(instid,clscol.PARENT_CLS_ID);
                            }
                        }
                    })
                })
            })
        };
        insertInst(_newInstId,req.body.clsid);

    })
};


