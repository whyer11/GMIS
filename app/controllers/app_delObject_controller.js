/**
 * Created by whyer on 14-5-29.
 */
var maps = require('../middleware/models_maps'),
    EventProxy = require('eventproxy'),
    ep = new EventProxy();
module.exports = function (req, res) {
    //console.log(req.body);
    checkParentsClass(req.body.clsid,req.body.instid);
    function checkParentsClass (clsid,instid) {
        req.models.gom_clses.get(clsid, function (err, clscols) {
                maps.modelsmaps(req,clscols.CLS_TAB_NAME).get(instid, function (err, col) {
                    if(clsid == 0){
                        req.models.gom_refs.get(req.body.id, function (err,refcol) {
                            refcol.remove(function (err) {
                                if(err){
                                    console.error(err);
                                }else{
                                    col.remove(function (err) {
                                        if(err){
                                            console.error(err);
                                        } else{
                                            res.end();
                                        }

                                    })
                                }
                            })
                        })
                    }else{
                        col.remove(function (err) {
                            if(err){
                                console.error(err);
                            }else{
                                checkParentsClass(clscols.PARENT_CLS_ID,instid);
                            }
                        })

                    }

                })
        })
    }
}