/**
 * Created by whyer on 14-4-12.
 */
var opt_db = require('../middleware/opt_db');
var maps = require('../middleware/models_maps');
var EventProxy = require('eventproxy');
var ep = EventProxy();
;module.exports = function(req,res){
    var currentNode = req.body;
    checkParentsClass(req.body.clsid,req.body.instid);
    function checkParentsClass (clsid,instid) {
        var nodeArray = {};
        var i = 0;
        checkParentClass(clsid,clsid,i,instid);
        function checkParentClass (classid,nextclassid,i,instid) {


                req.models.gom_clses.find({CLS_ID : nextclassid},function(err,clscols){
                        //

                        //console.log(nextclassid);
                        maps.modelsmaps(req,clscols[0].CLS_TAB_NAME).get(instid,function(err,data){
                            for (val in data){
                                if(val != 'GRANTOR_ID' && val != 'STATE_ID' && val != 'INSTACP_ID' && val != 'CLS_ID' && val != 'INST_NOTE' && val != 'INST_ID'){
                                    nodeArray[val] = data[val];
                                }
                            }
                            i++;
                            if(nextclassid == 0){
                                console.log(nodeArray);
                            }else{
                                nextclassid = clscols[0].PARENT_CLS_ID;
                                checkParentClass(classid,nextclassid,i,instid);
                            }

                        });



                })

        }
    }
    res.end();
}